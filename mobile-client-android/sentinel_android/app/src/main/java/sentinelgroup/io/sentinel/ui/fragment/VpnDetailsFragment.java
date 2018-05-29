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

import com.haipq.android.flagkit.FlagImageView;

import java.util.Locale;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.network.model.VpnList;
import sentinelgroup.io.sentinel.ui.activity.SendActivity;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.Convert;
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

    private VpnList mVpnListData;

    private VpnListViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private FlagImageView mFvFlag;
    private TextView mTvLocation, mTvCity, mTvCountry, mTvBandwidth, mTvLatency, mTvPrice;
    private Button mBtnConnect;

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
    public static VpnDetailsFragment newInstance(VpnList iVpnListData) {
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
            mVpnListData = (VpnList) getArguments().getSerializable(ARG_VPN_LIST);
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
        mTvCity = iView.findViewById(R.id.tv_city);
        mTvCountry = iView.findViewById(R.id.tv_country);
        mTvBandwidth = iView.findViewById(R.id.tv_bandwidth);
        mTvLatency = iView.findViewById(R.id.tv_latency);
        mTvPrice = iView.findViewById(R.id.tv_price);
        mBtnConnect = iView.findViewById(R.id.btn_connect);
        // set default value
        mFvFlag.setCountryCode(getCountryCode(mVpnListData.location.country));
        mTvLocation.setText(getString(R.string.vpn_location, mVpnListData.location.city, mVpnListData.location.country));
        mTvCity.setText(getString(R.string.city, mVpnListData.location.city));
        mTvCountry.setText(getString(R.string.country, mVpnListData.location.country));
        String aBandwidthValue = getString(R.string.vpn_bandwidth_value, Convert.fromBitsPerSecond(mVpnListData.netSpeed.download, Convert.DataUnit.MBPS));
        String aBandwidth = getString(R.string.bandwidth, aBandwidthValue);
        mTvBandwidth.setText(aBandwidth);
        String aLatencyValue = getString(R.string.vpn_latency_value, mVpnListData.latency);
        String aLatency = getString(R.string.latency, aLatencyValue);
        mTvLatency.setText(aLatency);
        String aPriceValue = getString(R.string.vpn_price_value, mVpnListData.pricePerGb);
        String aPrice = getString(R.string.price, aPriceValue);
        mTvPrice.setText(aPrice);
        // Set listener
        mBtnConnect.setOnClickListener(this);
    }

    private String getCountryCode(String iCountryName) {
        String[] isoCountryCodes = Locale.getISOCountries();
        for (String code : isoCountryCodes) {
            Locale locale = new Locale("", code);
            if (iCountryName.equalsIgnoreCase(locale.getDisplayCountry())) {
                return code;
            }
        }
        return "";
    }

    private void initViewModel() {
        VpnListViewModelFactory aFactory = InjectorModule.provideVpnListViewModelFactory();
        mViewModel = ViewModelProviders.of(this, aFactory).get(VpnListViewModel.class);

        mViewModel.getVpnGetServerCredentials().observe(this, vpnCredentialsResource -> {
            if (vpnCredentialsResource != null) {
                if (vpnCredentialsResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.fetching_server_details));
                } else if (vpnCredentialsResource.data != null && vpnCredentialsResource.status.equals(Status.SUCCESS)) {
                    // TODO get the OVPn config file and connect to VPN server & remove hideProgressDialog()
                    hideProgressDialog();
                } else if (vpnCredentialsResource.message != null && vpnCredentialsResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    if (vpnCredentialsResource.message.equals("Initial VPN payment is not done."))
                        loadNextActivity(constructSendActivityIntent(vpnCredentialsResource.message, true, getString(R.string.init_vpn_pay), null));
                    else
                        showErrorDialog(vpnCredentialsResource.message);
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

    public void showErrorDialog(String iError) {
        if (mListener != null) {
            mListener.onShowErrorDialog(iError);
        }
    }

    public void loadNextActivity(Intent iIntent) {
        if (mListener != null) {
            mListener.onLoadNextActivity(iIntent);
        }
    }

    private Intent constructSendActivityIntent(String iError, boolean isInit, String iAmount, String iSessionId) {
        Intent aIntent = new Intent(getActivity(), SendActivity.class);
        Bundle aBundle = new Bundle();
        aBundle.putBoolean(AppConstants.EXTRA_IS_VPN_PAY, true);
        aBundle.putBoolean(AppConstants.EXTRA_IS_INIT, true);
        aBundle.putString(AppConstants.EXTRA_AMOUNT, iAmount);
        if (iError != null)
            aBundle.putString(AppConstants.EXTRA_INIT_MESSAGE, iError);
        if (iSessionId != null)
            aBundle.putString(AppConstants.EXTRA_SESSION_ID, iSessionId);
        aIntent.putExtras(aBundle);
        return aIntent;
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
        super.onDetach();
        mListener = null;
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.btn_connect) {
            mViewModel.getVpnServerCredentials(mVpnListData.accountAddress);
        }
    }
}
