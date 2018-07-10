package sentinelgroup.io.sentinel.ui.fragment;


import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
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
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.Converter;
import sentinelgroup.io.sentinel.util.Status;
import sentinelgroup.io.sentinel.viewmodel.VpnSessionViewModel;
import sentinelgroup.io.sentinel.viewmodel.VpnSessionViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnGenericFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link VpnSessionDetailsFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class VpnSessionDetailsFragment extends Fragment implements View.OnClickListener {

    private static final String ARG_SESSION_DATA = "session_data";

    private Session mSessionData;

    private VpnSessionViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private TextView mTvSessionId, mTvDateTime, mTvReceivedData, mTvDuration, mTvSessionCost;
    private Button mBtnMakePayment, mBtnReportPayment;

    public VpnSessionDetailsFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param iSessionData Parameter 1.
     * @return A new instance of fragment VpnSessionDetailsFragment.
     */
    public static VpnSessionDetailsFragment newInstance(Session iSessionData) {
        VpnSessionDetailsFragment fragment = new VpnSessionDetailsFragment();
        Bundle args = new Bundle();
        args.putSerializable(ARG_SESSION_DATA, iSessionData);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mSessionData = (Session) getArguments().getSerializable(ARG_SESSION_DATA);
        }
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_vpn_session_details, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.vpn_session_details));
        initViewModel();
    }

    private void initView(View iView) {
        mTvSessionId = iView.findViewById(R.id.tv_session_id);
        mTvDateTime = iView.findViewById(R.id.tv_date_time);
        mTvReceivedData = iView.findViewById(R.id.tv_received_data);
        mTvDuration = iView.findViewById(R.id.tv_duration);
        mTvSessionCost = iView.findViewById(R.id.tv_session_cost);
        mBtnMakePayment = iView.findViewById(R.id.btn_make_payment);
        mBtnReportPayment = iView.findViewById(R.id.btn_report_payment);
        // set Default values
        setSessionDataValue();
        // set listeners
        mBtnMakePayment.setOnClickListener(this);
        mBtnReportPayment.setOnClickListener(this);
    }

    private void setSessionDataValue() {
        mTvSessionId.setText(mSessionData.sessionId);
        mTvDateTime.setText(Converter.convertEpochToDate(mSessionData.timestamp));
        mTvReceivedData.setText(Converter.getFileSize(mSessionData.receivedBytes));
        mTvDuration.setText(Converter.getLongDuration(mSessionData.sessionDuration));
        mTvSessionCost.setText(getString(R.string.sents, Converter.getFormattedSentBalance(mSessionData.amount)));
        mBtnMakePayment.setVisibility(mSessionData.isPaid ? View.GONE : View.VISIBLE);
        mBtnReportPayment.setVisibility(mSessionData.isPaid ? View.GONE : View.VISIBLE);
    }

    private void initViewModel() {
        VpnSessionViewModelFactory aFactory = InjectorModule.provideVpnSessionViewModelFactory(getContext());
        mViewModel = ViewModelProviders.of(this, aFactory).get(VpnSessionViewModel.class);

        mViewModel.getReportPaymentLiveEvent().observe(this, reportPayResource -> {
            if (reportPayResource != null) {
                if (reportPayResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.reporting_payment));
                } else if (reportPayResource.data != null && reportPayResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    Toast.makeText(getContext(), reportPayResource.data.message, Toast.LENGTH_SHORT).show();
                } else if (reportPayResource.message != null && reportPayResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    showErrorDialog(reportPayResource.message);
                }
            }
        });
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

    public void showErrorDialog(String iError) {
        if (mListener != null) {
            mListener.onShowSingleActionDialog(iError);
        }
    }

    public void loadNextFragment(Fragment iNextFragment) {
        if (mListener != null) {
            mListener.onLoadNextFragment(iNextFragment);
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
        String aValue = Converter.getFormattedSentBalance(mSessionData.amount);
        switch (v.getId()) {
            case R.id.btn_make_payment:
                loadNextActivity(constructSendActivityIntent(aValue, mSessionData.sessionId), AppConstants.REQ_VPN_PAY);
                break;

            case R.id.btn_report_payment:
                // Call Report Payment API
                mViewModel.reportPayment(aValue, mSessionData.sessionId);
                break;
        }
    }
}
