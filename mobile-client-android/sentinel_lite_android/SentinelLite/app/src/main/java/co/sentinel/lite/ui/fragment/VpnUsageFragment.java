package co.sentinel.lite.ui.fragment;

import android.annotation.SuppressLint;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.constraint.ConstraintLayout;
import android.support.v4.app.Fragment;
import android.support.v4.app.ShareCompat;
import android.support.v4.content.ContextCompat;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.SwitchCompat;
import android.text.SpannableString;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import co.sentinel.lite.R;
import co.sentinel.lite.di.InjectorModule;
import co.sentinel.lite.network.model.VpnUsageEntity;
import co.sentinel.lite.ui.activity.GenericActivity;
import co.sentinel.lite.ui.adapter.VpnUsageAdapter;
import co.sentinel.lite.ui.custom.EmptyRecyclerView;
import co.sentinel.lite.ui.custom.OnGenericFragmentInteractionListener;
import co.sentinel.lite.util.AppConstants;
import co.sentinel.lite.util.Converter;
import co.sentinel.lite.util.SpannableStringUtil;
import co.sentinel.lite.util.Status;
import co.sentinel.lite.viewmodel.VpnUsageViewModelFactory;
import co.sentinel.lite.viewmodel.VpnUsageViewModel;

public class VpnUsageFragment extends Fragment {

    private VpnUsageViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private TextView mTvTotalSessions, mTvTotalDuration, mTvTotalReceivedData;
    private SwipeRefreshLayout mSrReload;
    private EmptyRecyclerView mRvVpnHistory;
    private ConstraintLayout clLanguage,clShare,clAbout,clSocial,clSocialLayout;
    private TextView btnClose,tvAbout;
    private ImageButton telegram,medium,twitter,sentinelco;
    private SwitchCompat scAuto;
    private SharedPreferences mPreferences;
    private View socialDismiss;

    private VpnUsageAdapter mAdapter;

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
        mPreferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        clLanguage = iView.findViewById(R.id.clLanguage);
        clAbout = iView.findViewById(R.id.clAbout);
        tvAbout = iView.findViewById(R.id.aboutTitle);
        clShare = iView.findViewById(R.id.clShare);
        clSocial = iView.findViewById(R.id.clSocial);
        btnClose = iView.findViewById(R.id.btnClose);
        sentinelco = iView.findViewById(R.id.ib_website);
        twitter = iView.findViewById(R.id.ib_twitter);
        telegram = iView.findViewById(R.id.ib_telegram);
        medium = iView.findViewById(R.id.ib_medium);
        scAuto = iView.findViewById(R.id.auto_switch);
        scAuto.setChecked(mPreferences.getBoolean("autoMode",false));
        clSocialLayout = iView.findViewById(R.id.clSocialLayout);
        clSocialLayout.setAlpha(0.0f);
        socialDismiss = iView.findViewById(R.id.dismissView);

        clLanguage.setOnClickListener(v -> startActivityForResult(new Intent(getContext(), GenericActivity.class).putExtra(AppConstants.EXTRA_REQ_CODE, AppConstants.REQ_LANGUAGE), AppConstants.REQ_LANGUAGE));

        clShare.setOnClickListener(v -> ShareCompat.IntentBuilder.from(getActivity())
                .setType("text/plain")
                .setChooserTitle("Share Sentinel dVPN")
                .setText("http://play.google.com/store/apps/details?id=" + getActivity().getPackageName())
                .startChooser());

        clSocial.setOnClickListener(v -> {
            clSocialLayout.setVisibility(View.VISIBLE);
            clSocialLayout.animate().alpha(1.0f);
            socialDismiss.setVisibility(View.VISIBLE);
        });

        socialDismiss.setOnClickListener(v -> {
            clSocialLayout.setVisibility(View.GONE);
            clSocialLayout.setAlpha(0.0f);
            socialDismiss.setVisibility(View.GONE);
        });

        btnClose.setOnClickListener(v -> {
            clSocialLayout.setVisibility(View.GONE);
            clSocialLayout.setAlpha(0.0f);
        });

        scAuto.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if(scAuto.isChecked()){
                mPreferences.edit().putBoolean("autoMode",true).apply();
            }else{
                mPreferences.edit().putBoolean("autoMode",false).apply();
            }
        });

        //Social buttons
        Intent socialIntent = new Intent();
        socialIntent.setAction(Intent.ACTION_VIEW);
        socialIntent.addCategory(Intent.CATEGORY_BROWSABLE);

        clAbout.setOnClickListener(v -> {
            socialIntent.setData(Uri.parse(getString(R.string.website_url)));
            startActivity(socialIntent);
        });

        telegram.setOnClickListener(v -> {
            socialIntent.setData(Uri.parse(getString(R.string.telegram_url)));
            startActivity(socialIntent);
        });

        medium.setOnClickListener(v -> {
            socialIntent.setData(Uri.parse(getString(R.string.medium_url)));
            startActivity(socialIntent);
        });

        twitter.setOnClickListener(v -> {
            socialIntent.setData(Uri.parse(getString(R.string.twitter_url)));
            startActivity(socialIntent);
        });

        sentinelco.setOnClickListener(v -> {
            socialIntent.setData(Uri.parse(getString(R.string.website_url)));
            startActivity(socialIntent);
        });


        mTvTotalSessions = iView.findViewById(R.id.tv_total_sessions);
        mTvTotalDuration = iView.findViewById(R.id.tv_total_duration);
        mTvTotalReceivedData = iView.findViewById(R.id.tv_total_received_data);
        mSrReload = iView.findViewById(R.id.sr_reload);
        mRvVpnHistory = iView.findViewById(R.id.rv_vpn_history);
        // Setup RecyclerView
        mRvVpnHistory.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.VERTICAL, false));
        mRvVpnHistory.setEmptyView(iView.findViewById(R.id.tv_empty_message));
        mAdapter = new VpnUsageAdapter(getContext());
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
                        setTotalUsageDetails(vpnUsage.data.usage);
                        if (vpnUsage.data.usage.getSessions() != null && vpnUsage.data.usage.getSessions().size() > 0) {
                            mAdapter.loadData(vpnUsage.data.usage.getSessions());
                            mRvVpnHistory.scrollToPosition(0);
                        }
                    }
                }
            }
        });
    }

    private void setTotalUsageDetails(VpnUsageEntity iUsage) {
        mTvTotalSessions.setText(String.valueOf(iUsage.getSessions().size()));
        // Construct and set - Duration SpannableString
        String aDuration = Converter.getDuration(iUsage.getStats().duration);
        String aDurationSubString = aDuration.substring(aDuration.indexOf(' '));
        SpannableString aStyledDuration = new SpannableStringUtil.SpannableStringUtilBuilder(aDuration, aDurationSubString)
                .color(ContextCompat.getColor(getContext(), R.color.colorTextWhite))
                .relativeSize(0.7f)
                .build();
        mTvTotalDuration.setText(aStyledDuration);
        // Construct and set - Data Size SpannableString
        String aSize = Converter.getFileSize(iUsage.getStats().receivedBytes);
        String aSizeSubString = aSize.substring(aSize.indexOf(' '));
        SpannableString aStyledSize = new SpannableStringUtil.SpannableStringUtilBuilder(aSize, aSizeSubString)
                .color(ContextCompat.getColor(getContext(), R.color.colorTextWhite))
                .relativeSize(0.7f)
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
