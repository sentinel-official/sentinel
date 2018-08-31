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
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.haipq.android.flagkit.FlagImageView;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.SentinelApp;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.network.model.VpnDetailListData;
import sentinelgroup.io.sentinel.network.model.VpnListEntity;
import sentinelgroup.io.sentinel.ui.adapter.VpnDetailListAdapter;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Convert;
import sentinelgroup.io.sentinel.util.Converter;
import sentinelgroup.io.sentinel.util.Status;
import sentinelgroup.io.sentinel.viewmodel.VpnListViewModel;
import sentinelgroup.io.sentinel.viewmodel.VpnListViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link VpnDetailsFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class VpnDetailsFragment extends Fragment implements View.OnClickListener {
    private static final String ARG_VPN_LIST = "vpn_list";

    private VpnListEntity mVpnListData;

    private VpnListViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private FlagImageView mFvFlag;
    private TextView mTvLocation;
    private RecyclerView mRvVpnDetailsList;
    private Button mBtnConnect;

    private VpnDetailListAdapter mAdapter;

    public VpnDetailsFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param iVpnListData Parameter 1.
     * @return A new instance of fragment VpnDetailsFragment.
     */
    public static VpnDetailsFragment newInstance(VpnListEntity iVpnListData) {
        VpnDetailsFragment fragment = new VpnDetailsFragment();
        Bundle args = new Bundle();
        args.putSerializable(ARG_VPN_LIST, iVpnListData);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mVpnListData = (VpnListEntity) getArguments().getSerializable(ARG_VPN_LIST);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_vpn_details, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.vpn_connections));
        initViewModel();
    }

    private void initView(View iView) {
        mFvFlag = iView.findViewById(R.id.fv_flag);
        mTvLocation = iView.findViewById(R.id.tv_location);
        mRvVpnDetailsList = iView.findViewById(R.id.rv_vpn_detail_list);
        mBtnConnect = iView.findViewById(R.id.btn_connect);
        // set default value
        mFvFlag.setCountryCode(Converter.getCountryCode(mVpnListData.getLocation().country));
        mTvLocation.setText(mVpnListData.getLocation().country);
        // setup recyclerview
        mAdapter = new VpnDetailListAdapter(getContext(),  getListData());
        mRvVpnDetailsList.setLayoutManager(new LinearLayoutManager(getContext()));
        mRvVpnDetailsList.setAdapter(mAdapter);
        // Set listener
        mBtnConnect.setOnClickListener(this);
    }

    private List<VpnDetailListData> getListData() {
        List<VpnDetailListData> aData = new ArrayList<>();
        aData.add(new VpnDetailListData(getString(R.string.city), mVpnListData.getLocation().city));
        aData.add(new VpnDetailListData(getString(R.string.country), mVpnListData.getLocation().country));
        aData.add(new VpnDetailListData(getString(R.string.bandwidth), getString(R.string.vpn_bandwidth_value, Convert.fromBitsPerSecond(mVpnListData.getNetSpeed().download, Convert.DataUnit.MBPS))));
        aData.add(new VpnDetailListData(getString(R.string.latency), getString(R.string.vpn_latency_value, mVpnListData.getLatency())));
        aData.add(new VpnDetailListData(getString(R.string.encryption), mVpnListData.getEncryptionMethod()));
        aData.add(new VpnDetailListData(getString(R.string.node_version), mVpnListData.getVersion()));
        String aRatingValue;
        if (mVpnListData.getRating() == 0.0) {
            aRatingValue = "N/A";
        } else {
            aRatingValue = String.format(Locale.getDefault(), "%.1f / %.1f", mVpnListData.getRating(), AppConstants.MAX_NODE_RATING);
        }
        aData.add(new VpnDetailListData(getString(R.string.node_rating), aRatingValue));
        aData.add(new VpnDetailListData(getString(R.string.price), getString(R.string.vpn_price_value, mVpnListData.getPricePerGb())));
        return aData;
    }

    private void initViewModel() {
        // init Device ID
        @SuppressLint("HardwareIds") String aDeviceId = Settings.Secure.getString(getActivity().getContentResolver(), Settings.Secure.ANDROID_ID);

        VpnListViewModelFactory aFactory = InjectorModule.provideVpnListViewModelFactory(getContext(), aDeviceId);
        mViewModel = ViewModelProviders.of(this, aFactory).get(VpnListViewModel.class);

        mViewModel.getVpnGetServerCredentials().observe(this, vpnCredentialsResource -> {
            if (vpnCredentialsResource != null) {
                if (vpnCredentialsResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.fetching_server_details));
                } else if (vpnCredentialsResource.data != null && vpnCredentialsResource.status.equals(Status.SUCCESS)) {
                    mViewModel.getVpnConfig(vpnCredentialsResource.data);
                } else if (vpnCredentialsResource.message != null && vpnCredentialsResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    if (vpnCredentialsResource.message.equals(AppConstants.INIT_PAY_ERROR))
                        showDoubleActionDialog(AppConstants.TAG_INIT_PAY, AppConstants.VALUE_DEFAULT,
                                getString(R.string.init_vpn_pay_pending_message),
                                R.string.pay, AppConstants.VALUE_DEFAULT);
                    else if (vpnCredentialsResource.message.equals(AppConstants.GENERIC_ERROR))
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), AppConstants.VALUE_DEFAULT);
                    else
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, vpnCredentialsResource.message, AppConstants.VALUE_DEFAULT);
                }
            }
        });
        mViewModel.getVpnConfigLiveEvent().observe(this, vpnConfigResource -> {
            if (vpnConfigResource != null) {
                if (vpnConfigResource.status.equals((Status.LOADING))) {
                    showProgressDialog(true, getString(R.string.fetching_config));
                } else if (vpnConfigResource.data != null && vpnConfigResource.status.equals(Status.SUCCESS)) {
                    mViewModel.saveCurrentVpnSessionConfig(vpnConfigResource.data);
                } else if (vpnConfigResource.message != null && vpnConfigResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    if (vpnConfigResource.message.equals(AppConstants.GENERIC_ERROR))
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), AppConstants.VALUE_DEFAULT);
                    else
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, vpnConfigResource.message, AppConstants.VALUE_DEFAULT);
                }
            }
        });
        mViewModel.getVpnConfigSaveLiveEvent().observe(this, vpnConfigSaveResource -> {
            if (vpnConfigSaveResource != null) {
                if (vpnConfigSaveResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.saving_config));
                } else if (vpnConfigSaveResource.data != null && vpnConfigSaveResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    loadNextActivity(null);
                } else if (vpnConfigSaveResource.message != null && vpnConfigSaveResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    showSingleActionDialog(AppConstants.VALUE_DEFAULT, vpnConfigSaveResource.message, AppConstants.VALUE_DEFAULT);
                }
            }
        });
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

    private void showDoubleActionDialog(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId) {
        if (mListener != null) {
            mListener.onShowDoubleActionDialog(iTag, iTitleId, iMessage, iPositiveOptionId, iNegativeOptionId);
        }
    }

    public void loadNextActivity(Intent iIntent) {
        if (mListener != null) {
            mListener.onLoadNextActivity(iIntent, AppConstants.REQ_VPN_INIT_PAY);
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
        if (v.getId() == R.id.btn_connect) {
            boolean aIsTextNetActive = AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE);
            if (aIsTextNetActive) {
                if (!SentinelApp.isVpnConnected)
                    mViewModel.getVpnServerCredentials(mVpnListData.getAccountAddress());
                else
                    showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.vpn_already_connected), AppConstants.VALUE_DEFAULT);
            } else
                showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.vpn_main_net_unavailable), AppConstants.VALUE_DEFAULT);
        }
    }
}