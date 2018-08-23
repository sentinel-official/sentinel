package sentinelgroup.io.sentinel.ui.fragment;


import android.annotation.SuppressLint;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.support.v4.widget.SwipeRefreshLayout;
import android.text.SpannableString;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.network.model.Session;
import sentinelgroup.io.sentinel.ui.activity.SendActivity;
import sentinelgroup.io.sentinel.ui.activity.VpnListActivity;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.Converter;
import sentinelgroup.io.sentinel.util.SpannableStringUtil;
import sentinelgroup.io.sentinel.util.Status;
import sentinelgroup.io.sentinel.viewmodel.VpnPayViewModel;
import sentinelgroup.io.sentinel.viewmodel.VpnPayViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnGenericFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link VpnPayFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class VpnPayFragment extends Fragment implements View.OnClickListener {

    private VpnPayViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private TextView mTvSentDue, mTvDuration, mtvDataUsed, mTvSessionId, mTvDateTime;
    private SwipeRefreshLayout mSrReload;
    private Button mBtnMakePayment, mBtnReportPayment, mBtnViewVpn;

    private String mValue, mSessionId;

    public VpnPayFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment VpnPayFragment.
     */
    public static VpnPayFragment newInstance() {
        return new VpnPayFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_vpn_pay, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.app_name));
        initViewModel();
    }

    private void initView(View iView) {
        mSrReload = iView.findViewById(R.id.sr_reload);
        mTvSentDue = iView.findViewById(R.id.tv_sent_due);
        mTvDuration = iView.findViewById(R.id.tv_duration);
        mtvDataUsed = iView.findViewById(R.id.tv_data_used);
        mTvSessionId = iView.findViewById(R.id.tv_session_id);
        mTvDateTime = iView.findViewById(R.id.tv_date_time);
        mBtnMakePayment = iView.findViewById(R.id.btn_make_payment);
        mBtnReportPayment = iView.findViewById(R.id.btn_report_payment);
        mBtnViewVpn = iView.findViewById(R.id.btn_view_vpn);
        // set listeners
        mBtnMakePayment.setOnClickListener(this);
        mBtnReportPayment.setOnClickListener(this);
        mBtnViewVpn.setOnClickListener(this);
        // setup swipe to refresh layout
        mSrReload.setOnRefreshListener(() -> {
            mSrReload.setRefreshing(false);
            loadNextFragment(VpnSelectFragment.newInstance(null));
        });
    }

    private void initViewModel() {
        // init Device ID
        @SuppressLint("HardwareIds") String aDeviceId = Settings.Secure.getString(getActivity().getContentResolver(), Settings.Secure.ANDROID_ID);

        VpnPayViewModelFactory aFactory = InjectorModule.provideVpnPayViewModelFactory(getContext(), aDeviceId);
        mViewModel = ViewModelProviders.of(this, aFactory).get(VpnPayViewModel.class);

        mViewModel.getVpnUsageLiveEvent().observe(this, vpnUsage -> {
            if (vpnUsage != null)
                if (vpnUsage.getSessions() != null && vpnUsage.getSessions().size() > 0)
                    for (int i = 0; i < vpnUsage.getSessions().size(); i++)
                        if (!vpnUsage.getSessions().get(i).isPaid)
                            setupVpnUsageData(vpnUsage.getSessions().get(i));
        });

        mViewModel.getReportPaymentLiveEvent().observe(this, reportPayResource -> {
            if (reportPayResource != null) {
                if (reportPayResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.reporting_payment));
                } else if (reportPayResource.data != null && reportPayResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    Toast.makeText(getContext(), R.string.payment_done_success, Toast.LENGTH_SHORT).show();
                    loadNextFragment(VpnSelectFragment.newInstance(null));
                } else if (reportPayResource.message != null && reportPayResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    if (reportPayResource.message.equals(AppConstants.GENERIC_ERROR))
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), AppConstants.VALUE_DEFAULT);
                    else
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, reportPayResource.message, AppConstants.VALUE_DEFAULT);
                }
            }
        });
    }

    private void setupVpnUsageData(Session iSession) {
        // Construct and set - Sent Due SpannableString
        String aSentDue = getString(R.string.sents, Converter.getFormattedTokenString(iSession.amount));
        String aSentDueSubString = aSentDue.substring(aSentDue.indexOf(' '));
        SpannableString aStyledSentDue = new SpannableStringUtil.SpannableStringUtilBuilder(aSentDue, aSentDueSubString)
                .color(ContextCompat.getColor(getContext(), R.color.colorTextWhiteWithAlpha70))
                .relativeSize(0.5f)
                .build();
        mTvSentDue.setText(aStyledSentDue);
        // Construct and set - Duration SpannableString
        String aDuration = Converter.getDuration(iSession.sessionDuration);
        String aDurationSubString = aDuration.substring(aDuration.indexOf(' '));
        SpannableString aStyledDuration = new SpannableStringUtil.SpannableStringUtilBuilder(aDuration, aDurationSubString)
                .color(ContextCompat.getColor(getContext(), R.color.colorTextWhiteWithAlpha70))
                .relativeSize(0.5f)
                .build();
        mTvDuration.setText(aStyledDuration);
        // Construct and set - Data Size SpannableString
        String aSize = Converter.getFileSize(iSession.receivedBytes);
        String aSizeSubString = aSize.substring(aSize.indexOf(' '));
        SpannableString aStyledSize = new SpannableStringUtil.SpannableStringUtilBuilder(aSize, aSizeSubString)
                .color(ContextCompat.getColor(getContext(), R.color.colorTextWhiteWithAlpha70))
                .relativeSize(0.5f)
                .build();
        mtvDataUsed.setText(aStyledSize);
        // set value for session id and timestamp
        mTvSessionId.setText(iSession.sessionId);
        mTvDateTime.setText(Converter.convertEpochToDate(iSession.timestamp));
        // store values for making payment
        mValue = Converter.getFormattedTokenString(iSession.amount);
        mSessionId = iSession.sessionId;
        // enable pay button
        toggleButtonState(true);
    }

    private void toggleButtonState(boolean isEnabled) {
        mBtnMakePayment.setEnabled(isEnabled);
        mBtnReportPayment.setEnabled(isEnabled);
        mBtnViewVpn.setEnabled(isEnabled);
    }

    private Intent constructSendActivityIntent(String iAmount, String iSessionId) {
        Intent aIntent = new Intent(getActivity(), SendActivity.class);
        Bundle aBundle = new Bundle();
        aBundle.putBoolean(AppConstants.EXTRA_IS_VPN_PAY, true);
        aBundle.putBoolean(AppConstants.EXTRA_IS_INIT, false);
        aBundle.putString(AppConstants.EXTRA_AMOUNT, iAmount);
        if (iSessionId != null)
            aBundle.putString(AppConstants.EXTRA_SESSION_ID, iSessionId);
        aIntent.putExtras(aBundle);
        return aIntent;
    }

    // Interface interaction methods
    public void fragmentLoaded(String iTitle) {
        if (mListener != null) {
            mListener.onFragmentLoaded(iTitle);
        }
    }

    public void showProgressDialog(boolean isHalfDim, String iMessage) {
        if (mListener != null) {
            mListener.onShowProgressDialog(isHalfDim, iMessage);
        }
    }

    public void hideProgressDialog() {
        if (mListener != null) {
            mListener.onHideProgressDialog();
        }
    }

    public void showSingleActionDialog(int iTitleId, String iMessage, int iPositiveOptionId) {
        if (mListener != null) {
            mListener.onShowSingleActionDialog(iTitleId, iMessage, iPositiveOptionId);
        }
    }

    public void loadNextFragment(Fragment iFragment) {
        if (mListener != null) {
            mListener.onLoadNextFragment(iFragment);
        }
    }

    public void loadNextActivity(Intent iIntent, int iReqCode) {
        if (mListener != null) {
            mListener.onLoadNextActivity(iIntent, iReqCode);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnGenericFragmentInteractionListener) {
            mListener = (OnGenericFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnGenericFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        hideProgressDialog();
        super.onDetach();
        mListener = null;
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_make_payment:
                loadNextActivity(constructSendActivityIntent(mValue, mSessionId), AppConstants.REQ_VPN_PAY);
                break;

            case R.id.btn_report_payment:
                mViewModel.reportPayment(mValue, mSessionId);
                break;

            case R.id.btn_view_vpn:
                loadNextActivity(new Intent(getActivity(), VpnListActivity.class), AppConstants.REQ_CODE_NULL);
                break;
        }
    }
}
