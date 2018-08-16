package sentinelgroup.io.sentinel.ui.fragment;


import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.text.SpannableString;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.network.model.Session;
import sentinelgroup.io.sentinel.network.model.Stats;
import sentinelgroup.io.sentinel.ui.activity.SendActivity;
import sentinelgroup.io.sentinel.ui.adapter.VpnHistoryListAdapter;
import sentinelgroup.io.sentinel.ui.custom.EmptyRecyclerView;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.Converter;
import sentinelgroup.io.sentinel.util.SpannableStringUtil;
import sentinelgroup.io.sentinel.viewmodel.VpnHistoryViewModel;
import sentinelgroup.io.sentinel.viewmodel.VpnHistoryViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link VpnHistoryFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class VpnHistoryFragment extends Fragment implements VpnHistoryListAdapter.OnItemClickListener {

    private VpnHistoryViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private TextView mTvSentPaid, mTvTotalDuration, mTvTotalReceivedData;
    private SwipeRefreshLayout mSrReload;
    private EmptyRecyclerView mRvVpnHistory;

    private VpnHistoryListAdapter mAdapter;

    public VpnHistoryFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment VpnHistoryFragment.
     */
    public static VpnHistoryFragment newInstance() {
        return new VpnHistoryFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_vpn_history, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.vpn_history));
        initViewModel();
    }

    private void initView(View iView) {
        mTvSentPaid = iView.findViewById(R.id.tv_total_sent_paid);
        mTvTotalDuration = iView.findViewById(R.id.tv_total_duration);
        mTvTotalReceivedData = iView.findViewById(R.id.tv_total_received_data);
        mSrReload = iView.findViewById(R.id.sr_reload);
        mRvVpnHistory = iView.findViewById(R.id.rv_vpn_history);
        // Setup RecyclerView
        mRvVpnHistory.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.VERTICAL, false));
        mRvVpnHistory.setEmptyView(iView.findViewById(R.id.tv_empty_message));
        mAdapter = new VpnHistoryListAdapter(this, getContext());
        mRvVpnHistory.setAdapter(mAdapter);
        // setup swipe to refresh layout
        mSrReload.setOnRefreshListener(() -> {
            mViewModel.reloadVpnUsage();
            mSrReload.setRefreshing(false);
        });
    }

    private void initViewModel() {
        VpnHistoryViewModelFactory aFactory = InjectorModule.provideVpnHistoryViewModelFactory(getContext());
        mViewModel = ViewModelProviders.of(this, aFactory).get(VpnHistoryViewModel.class);

        mViewModel.getVpnUsageLiveEvent().observe(this, vpnUsage -> {
            if (vpnUsage != null && vpnUsage.getStats() != null) {
                setTotalUsageDetails(vpnUsage.getStats());
                if (vpnUsage.getSessions() != null && vpnUsage.getSessions().size() > 0)
                    mAdapter.loadData(vpnUsage.getSessions());
            }
        });
    }

    private void setTotalUsageDetails(Stats iUsageStats) {
        mTvSentPaid.setText(Converter.getFormattedTokenString(iUsageStats.amount));
        // Construct and set - Duration SpannableString
        String aDuration = Converter.getDuration(iUsageStats.duration);
        String aDurationSubString = aDuration.substring(aDuration.indexOf(' '));
        SpannableString aStyledDuration = new SpannableStringUtil.SpannableStringUtilBuilder(aDuration, aDurationSubString)
                .color(ContextCompat.getColor(getContext(), R.color.colorTextGray))
                .relativeSize(0.5f)
                .build();
        mTvTotalDuration.setText(aStyledDuration);
        // Construct and set - Data Size SpannableString
        String aSize = Converter.getFileSize(iUsageStats.receivedBytes);
        String aSizeSubString = aSize.substring(aSize.indexOf(' '));
        SpannableString aStyledSize = new SpannableStringUtil.SpannableStringUtilBuilder(aSize, aSizeSubString)
                .color(ContextCompat.getColor(getContext(), R.color.colorTextGray))
                .relativeSize(0.5f)
                .build();
        mTvTotalReceivedData.setText(aStyledSize);
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
    public void onRootViewClicked(Session iSession) {
        loadNextFragment(VpnSessionDetailsFragment.newInstance(iSession));
    }

    @Override
    public void onPayClicked(String iValue, String iSessionId) {
        loadNextActivity(constructSendActivityIntent(iValue, iSessionId), AppConstants.REQ_VPN_PAY);
    }
}
