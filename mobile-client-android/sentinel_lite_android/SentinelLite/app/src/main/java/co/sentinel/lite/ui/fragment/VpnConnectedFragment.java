package co.sentinel.lite.ui.fragment;


import android.annotation.SuppressLint;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.AppCompatImageButton;
import android.text.SpannableString;
import android.text.TextUtils;
import android.text.style.ImageSpan;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import java.util.Objects;

import co.sentinel.lite.R;
import co.sentinel.lite.SentinelLiteApp;
import co.sentinel.lite.di.InjectorModule;
import co.sentinel.lite.network.model.VpnListEntity;
import co.sentinel.lite.ui.activity.VpnActivity;
import co.sentinel.lite.ui.custom.BlurFlagImageView;
import co.sentinel.lite.ui.custom.OnGenericFragmentInteractionListener;
import co.sentinel.lite.ui.custom.OnVpnConnectionListener;
import co.sentinel.lite.util.AnalyticsHelper;
import co.sentinel.lite.util.AppConstants;
import co.sentinel.lite.util.AppPreferences;
import co.sentinel.lite.util.Convert;
import co.sentinel.lite.util.Converter;
import co.sentinel.lite.util.SpannableStringUtil;
import co.sentinel.lite.viewmodel.VpnConnectedViewModel;
import co.sentinel.lite.viewmodel.VpnConnectedViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnGenericFragmentInteractionListener} &
 * (@link {@link OnVpnConnectionListener})interface
 * to handle interaction events.
 * Use the {@link VpnConnectedFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class VpnConnectedFragment extends Fragment implements View.OnClickListener {

    private VpnConnectedViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private OnVpnConnectionListener mVpnListener;

    private BlurFlagImageView mFvFlag;
    private TextView mTvVpnState, mTvLocation, mTvIp, mTvDownloadSpeed, mTvUploadSpeed, mTvDataUsed,
            mTvBandwidth, mTvLatency, mTvEncMethod, mTvDuration;
    private Button mBtnDisconnect, mBtnViewVpn;
    private AppCompatImageButton mIbBookmark;
    private VpnListEntity mVpnEntity;
    private SharedPreferences mPreferences;


    private Long mConnectionTime = 0L;

    private ImageSpan mDownloadSpeedSpan, mUploadSpeedSpan, mDataUsageSpan;

    public VpnConnectedFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment VpnConnectedFragment.
     */
    public static VpnConnectedFragment newInstance() {
        return new VpnConnectedFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        setHasOptionsMenu(false);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_vpn_connected, container, false);
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
        initListeners();
        initViewModel();
    }

//    @Override
//    public void onPrepareOptionsMenu(Menu menu) {
//        menu.clear();
//    }

    @Override
    public void onResume() {
        super.onResume();
        if (!SentinelLiteApp.isVpnInitiated) {
            loadNextFragment(VpnSelectFragment.newInstance(null));
        }
    }

    @Override
    public void onPause() {
        super.onPause();
    }

    private void initView(View iView) {
        mFvFlag = iView.findViewById(R.id.fv_flag);
        mTvVpnState = iView.findViewById(R.id.tv_vpn_state);
        mTvLocation = iView.findViewById(R.id.tv_location);
        mTvIp = iView.findViewById(R.id.tv_ip);
        mIbBookmark = iView.findViewById(R.id.ib_bookmark);
        mTvDownloadSpeed = iView.findViewById(R.id.tv_download_speed);
        mTvUploadSpeed = iView.findViewById(R.id.tv_upload_speed);
        mTvDataUsed = iView.findViewById(R.id.tv_data_used);
        mTvBandwidth = iView.findViewById(R.id.tv_bandwidth);
        mTvLatency = iView.findViewById(R.id.tv_latency);
        mTvEncMethod = iView.findViewById(R.id.tv_enc_method);
        mTvDuration = iView.findViewById(R.id.tv_duration);
        mBtnDisconnect = iView.findViewById(R.id.btn_disconnect);
        mBtnViewVpn = iView.findViewById(R.id.btn_view_vpn);
        // set listeners
        mBtnDisconnect.setOnClickListener(this);
        mBtnViewVpn.setOnClickListener(this);
        mPreferences = PreferenceManager.getDefaultSharedPreferences(getActivity());


        Drawable aDownloadSpeedDrawable = ContextCompat.getDrawable(getActivity(), R.drawable.ic_download_speed);
        aDownloadSpeedDrawable.setBounds(0, 0, aDownloadSpeedDrawable.getIntrinsicWidth(), aDownloadSpeedDrawable.getIntrinsicHeight());
        mDownloadSpeedSpan = new ImageSpan(aDownloadSpeedDrawable, ImageSpan.ALIGN_BASELINE);

        Drawable mUploadSpeedDrawable = ContextCompat.getDrawable(getActivity(), R.drawable.ic_upload_speed);
        mUploadSpeedDrawable.setBounds(0, 0, mUploadSpeedDrawable.getIntrinsicWidth(), mUploadSpeedDrawable.getIntrinsicHeight());
        mUploadSpeedSpan = new ImageSpan(mUploadSpeedDrawable, ImageSpan.ALIGN_BASELINE);

        Drawable mDataUsageDrawable = ContextCompat.getDrawable(getActivity(), R.drawable.ic_data_usage);
        mDataUsageDrawable.setBounds(0, 0, mDataUsageDrawable.getIntrinsicWidth(), mDataUsageDrawable.getIntrinsicHeight());
        mDataUsageSpan = new ImageSpan(mDataUsageDrawable, ImageSpan.ALIGN_BASELINE);
        setToolbarGone();
    }

    private void initListeners() {
        mIbBookmark.setOnClickListener(v -> {
            if (mVpnEntity != null) {
                Toast.makeText(getContext(), mVpnEntity.isBookmarked() ? R.string.alert_bookmark_removed : R.string.alert_bookmark_added, Toast.LENGTH_SHORT).show();
                mViewModel.toggleVpnBookmark(mVpnEntity.getAccountAddress(), mVpnEntity.getIp());
            }
        });
    }

    private void initViewModel() {
        // init Device ID
        @SuppressLint("HardwareIds") String aDeviceId = Settings.Secure.getString(Objects.requireNonNull(getActivity()).getContentResolver(), Settings.Secure.ANDROID_ID);

        VpnConnectedViewModelFactory aFactory = InjectorModule.provideVpnConnectedViewModelFactory(getContext(), aDeviceId);
        mViewModel = ViewModelProviders.of(this, aFactory).get(VpnConnectedViewModel.class);

        mViewModel.getVpnLiveData().observe(this, vpnEntity -> {
            if (vpnEntity != null && vpnEntity.getAccountAddress().equals(AppPreferences.getInstance().getString(AppConstants.PREFS_VPN_ADDRESS))) {
                mVpnEntity = vpnEntity;
                setupVpnData(vpnEntity);
            }
        });
    }

    private void setupVpnData(VpnListEntity iVpnEntity) {
        mTvLocation.setText(getString(R.string.vpn_location_city_country, iVpnEntity.getLocation().city, iVpnEntity.getLocation().country));
        // Construct and set - IP SpannableString
        String aIp = getString(R.string.vpn_ip, iVpnEntity.getIp());
        SpannableString aStyledIp = new SpannableStringUtil.SpannableStringUtilBuilder(aIp, iVpnEntity.getIp())
                .color(ContextCompat.getColor(getContext(), R.color.colorTextWhite))
                .relativeSize(1.2f)
                .customStyle(Typeface.BOLD)
                .build();
        mTvIp.setText(aStyledIp);
        // Set country flag
        mFvFlag.setCountryCode(Converter.getCountryCode(iVpnEntity.getLocation().country));
        // Construct and set - Bandwidth SpannableString

        setBookmarkIcon(iVpnEntity);

        mTvBandwidth.setText(getString(R.string.vpn_bandwidth_value, Convert.fromBitsPerSecond(iVpnEntity.getNetSpeed().download, Convert.DataUnit.MBPS)));
        mTvEncMethod.setText(iVpnEntity.getEncryptionMethod());
        mTvLatency.setText(getString(R.string.vpn_latency_value, iVpnEntity.getLatency()));
    }

    private void setBookmarkIcon(VpnListEntity iVpnEntity) {
        mIbBookmark.setImageResource(iVpnEntity.isBookmarked() ? R.drawable.ic_bookmark_active : R.drawable.ic_bookmark_inactive);
    }

    public void updateStatus(String iStateMessage) {
        mTvVpnState.setEnabled(iStateMessage.equals(getString(R.string.state_connected)));
        mTvVpnState.setText(getString(R.string.vpn_status, iStateMessage));
        mBtnViewVpn.setEnabled(iStateMessage.equals(getString(R.string.state_connected)));
    }

    public void updateByteCount(String iDownloadSpeed, String iUploadSpeed, String iTotalDataUsed) {
        if (mTvDownloadSpeed != null && !TextUtils.isEmpty(iDownloadSpeed)) {
            // Construct and set - Download Speed SpannableString
            String aDownloadSubString = iDownloadSpeed.substring(iDownloadSpeed.indexOf(' '));
            SpannableString aDownloadSpannable = new SpannableStringUtil.SpannableStringUtilBuilder(iDownloadSpeed, aDownloadSubString)
                    .color(ContextCompat.getColor(Objects.requireNonNull(getContext()), R.color.colorTextWhiteWithAlpha70))
                    .relativeSize(0.5f)
                    .build();
//            aDownloadSpannable.setSpan(mDownloadSpeedSpan, 0, 1, 0);
            mTvDownloadSpeed.setText(aDownloadSpannable);
        }
        if (mTvUploadSpeed != null && !TextUtils.isEmpty(iUploadSpeed)) {
            // Construct and set - Upload Speed SpannableString
            String aUploadSubString = iUploadSpeed.substring(iUploadSpeed.indexOf(' '));
            SpannableString aUploadSpannable = new SpannableStringUtil.SpannableStringUtilBuilder(iUploadSpeed, aUploadSubString)
                    .color(ContextCompat.getColor(getContext(), R.color.colorTextWhiteWithAlpha70))
                    .relativeSize(0.5f)
                    .build();
//            aUploadSpannable.setSpan(mUploadSpeedSpan, 0, 1, 0);
            mTvUploadSpeed.setText(aUploadSpannable);
        }
        if (mTvDataUsed != null && !TextUtils.isEmpty(iTotalDataUsed)) {
            // Construct and set - Data used SpannableString
            String aDataUsedSubString = iTotalDataUsed.substring(iTotalDataUsed.indexOf(' '));
            SpannableString aDataUsedSpannable = new SpannableStringUtil.SpannableStringUtilBuilder(iTotalDataUsed, aDataUsedSubString)
                    .color(ContextCompat.getColor(getContext(), R.color.colorTextWhiteWithAlpha70))
                    .relativeSize(0.5f)
                    .build();
//            aDataUsedSpannable.setSpan(mDataUsageSpan, 0, 1, 0);
            mTvDataUsed.setText(aDataUsedSpannable);
        }
        if (mTvDuration != null) {
//            Construct and set - Duration SpannableString
            if (mConnectionTime == 0L) {
                // Store the VPN connection initiated time
                mConnectionTime = AppPreferences.getInstance().getLong(AppConstants.PREFS_CONNECTION_START_TIME);
            }
            String aDurationValue = mConnectionTime == 0 ? "0" : Converter.getLongDuration((long) (((double) (System.currentTimeMillis() - mConnectionTime)) / 1000));
            mTvDuration.setText(aDurationValue);
        }
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

    public void initiateVpnDisconnection() {
        if (mVpnListener != null) {
            mVpnListener.onVpnDisconnectionInitiated();
            mPreferences.edit().putBoolean("regionvisibility",false).apply();
        }
    }

    public void setToolbarGone(){
        Intent intent = new Intent("toolbargone");
        getActivity().sendBroadcast(intent);
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnGenericFragmentInteractionListener && context instanceof OnVpnConnectionListener) {
            mListener = (OnGenericFragmentInteractionListener) context;
            mVpnListener = (OnVpnConnectionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnGenericFragmentInteractionListener & OnVpnConnectionListener");
        }
    }

    @Override
    public void onDetach() {
        hideProgressDialog();
        super.onDetach();
        mListener = null;
        mVpnListener = null;
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_disconnect:
                initiateVpnDisconnection();
                AnalyticsHelper.triggerOVPNDisconnectInit();
                break;

            case R.id.btn_view_vpn:
                loadNextActivity(new Intent(getActivity(), VpnActivity.class), AppConstants.REQ_VPN_CONNECT);
                getActivity().overridePendingTransition(R.anim.enter_right_to_left, R.anim.exit_left_to_right);
                break;
        }
    }
}