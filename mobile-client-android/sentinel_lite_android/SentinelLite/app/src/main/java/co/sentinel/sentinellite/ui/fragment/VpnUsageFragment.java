package co.sentinel.sentinellite.ui.fragment;

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
import android.support.v7.widget.LinearLayoutManager;
import android.text.SpannableString;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import co.sentinel.sentinellite.R;
import co.sentinel.sentinellite.di.InjectorModule;
import co.sentinel.sentinellite.network.model.Session;
import co.sentinel.sentinellite.network.model.Stats;
import co.sentinel.sentinellite.ui.adapter.VpnUsageListAdapter;
import co.sentinel.sentinellite.ui.custom.EmptyRecyclerView;
import co.sentinel.sentinellite.ui.custom.OnGenericFragmentInteractionListener;
import co.sentinel.sentinellite.util.AppConstants;
import co.sentinel.sentinellite.util.Converter;
import co.sentinel.sentinellite.util.SpannableStringUtil;
import co.sentinel.sentinellite.util.Status;
import co.sentinel.sentinellite.viewmodel.VpnUsageViewModelFactory;
import co.sentinel.sentinellite.viewmodel.VpnUsageViewModel;

public class VpnUsageFragment extends Fragment {

    private VpnUsageViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private TextView mTvTotalDuration, mTvTotalReceivedData;
    private SwipeRefreshLayout mSrReload;
    private EmptyRecyclerView mRvVpnHistory;

    private VpnUsageListAdapter mAdapter;

    public VpnUsageFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment VpnHistoryFragment.
     */
    public static VpnUsageFragment newInstance() {
        return new VpnUsageFragment();
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_vpn_usage, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.vpn_usage));
        initViewModel();
        mViewModel.reloadVpnUsage();
    }

    private void initView(View iView) {
        mTvTotalDuration = iView.findViewById(R.id.tv_total_duration);
        mTvTotalReceivedData = iView.findViewById(R.id.tv_total_received_data);
        mSrReload = iView.findViewById(R.id.sr_reload);
        mRvVpnHistory = iView.findViewById(R.id.rv_vpn_history);
        // Setup RecyclerView
        mRvVpnHistory.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.VERTICAL, false));
        mRvVpnHistory.setEmptyView(iView.findViewById(R.id.tv_empty_message));
        mAdapter = new VpnUsageListAdapter(getContext());
        mRvVpnHistory.setAdapter(mAdapter);
        // setup swipe to refresh layout
        mSrReload.setOnRefreshListener(() -> {
            mViewModel.reloadVpnUsage();
            mSrReload.setRefreshing(false);
        });
    }

    private void initViewModel() {
        // init Device ID
        @SuppressLint("HardwareIds") String aDeviceId = Settings.Secure.getString(getActivity().getContentResolver(), Settings.Secure.ANDROID_ID);

        VpnUsageViewModelFactory aFactory = InjectorModule.provideVpnHistoryViewModelFactory(getContext(), aDeviceId);
        mViewModel = ViewModelProviders.of(this, aFactory).get(VpnUsageViewModel.class);

        mViewModel.getVpnUsageLiveEvent().observe(this, vpnUsage -> {
            if (vpnUsage != null) {
                if (vpnUsage.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.generic_loading_message));
                } else if (vpnUsage.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    showSingleActionDialog(AppConstants.VALUE_DEFAULT, vpnUsage.message, AppConstants.VALUE_DEFAULT);
                } else {
                    hideProgressDialog();
                    if (vpnUsage.data != null && vpnUsage.data.usage != null) {
                        setTotalUsageDetails(vpnUsage.data.usage.getStats());
                        if (vpnUsage.data.usage.getSessions() != null && vpnUsage.data.usage.getSessions().size() > 0)
                            mAdapter.loadData(vpnUsage.data.usage.getSessions());
                    }
                }
            }
        });
    }

    private void setTotalUsageDetails(Stats iUsageStats) {
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
}
