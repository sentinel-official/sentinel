package sentinelgroup.io.sentinel.ui.fragment;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.SentinelApp;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.ui.adapter.VpnSelectPagerAdapter;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.NetworkUtil;
import sentinelgroup.io.sentinel.util.Status;
import sentinelgroup.io.sentinel.viewmodel.VpnSelectViewModel;
import sentinelgroup.io.sentinel.viewmodel.VpnSelectViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnGenericFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link VpnSelectFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class VpnSelectFragment extends Fragment {
    private static final String ARG_MESSAGE = "message";

    private VpnSelectViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private ViewPager mVpVpnSelect;
    private TabLayout mTabLayout;

    private VpnSelectPagerAdapter mAdapter;

    public VpnSelectFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @param iMessage
     * @return A new instance of fragment VpnSelectFragment.
     */
    public static VpnSelectFragment newInstance(String iMessage) {
        VpnSelectFragment fragment = new VpnSelectFragment();
        Bundle args = new Bundle();
        args.putString(ARG_MESSAGE, iMessage);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            String aMessage = getArguments().getString(ARG_MESSAGE);
            if (aMessage != null && !aMessage.isEmpty())
                showSingleActionDialog(AppConstants.VALUE_DEFAULT, aMessage, AppConstants.VALUE_DEFAULT);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_vpn_select, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.select_vpn));
        initViewModel();
    }

    private void initView(View iView) {
        mVpVpnSelect = iView.findViewById(R.id.vp_vpn_select);
        mTabLayout = iView.findViewById(R.id.tab_layout);
    }

    private void initViewModel() {
        if (SentinelApp.isVpnInitiated)
            loadNextFragment(VpnConnectedFragment.newInstance());
        else {
            // init Device ID
            @SuppressLint("HardwareIds") String aDeviceId = Settings.Secure.getString(getActivity().getContentResolver(), Settings.Secure.ANDROID_ID);

            VpnSelectViewModelFactory aFactory = InjectorModule.provideVpnSelectViewModelFactory(getContext(), aDeviceId);
            mViewModel = ViewModelProviders.of(this, aFactory).get(VpnSelectViewModel.class);

            mViewModel.getTokenAlertLiveEvent().observe(this, isTokenRequested -> {
                if (isTokenRequested != null && isTokenRequested) {
                    showSingleActionDialog(R.string.yay, getString(R.string.free_token_requested), R.string.thanks);
                }
            });

            mViewModel.getVpnUsageLiveEvent().observe(this, vpnUsageResource -> {
                if (vpnUsageResource != null)
                    if (vpnUsageResource.status.equals(Status.LOADING)) {
                        showProgressDialog(true, getString(R.string.generic_loading_message));
                    } else if (vpnUsageResource.data != null && vpnUsageResource.status.equals(Status.SUCCESS)) {
                        hideProgressDialog();
                        boolean aIsTextNetActive = AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE);
                        if (aIsTextNetActive)
                            if (vpnUsageResource.data.usage != null && vpnUsageResource.data.usage.getDue() > 0L) {
                                loadNextFragment(VpnPayFragment.newInstance());
                            } else {
                                if (NetworkUtil.isOnline())
                                    setupViewPagerAndTabs();
                                else
                                    loadNextFragment(NoNetworkFragment.newInstance());
                            }
                        else
                            loadNextFragment(EmptyFragment.newInstance(getString(R.string.vpn_main_net_unavailable), getString(R.string.app_name)));
                    } else if (vpnUsageResource.message != null && vpnUsageResource.status.equals(Status.ERROR)) {
                        hideProgressDialog();
                        if (vpnUsageResource.message.equals(AppConstants.GENERIC_ERROR))
                            showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), AppConstants.VALUE_DEFAULT);
                        else if (!vpnUsageResource.message.equals(getString(R.string.no_internet)))
                            showSingleActionDialog(AppConstants.VALUE_DEFAULT, vpnUsageResource.message, AppConstants.VALUE_DEFAULT);
                        else
                            loadNextFragment(NoNetworkFragment.newInstance());
                    }
            });
        }
    }

    private void setupViewPagerAndTabs() {
        // Setup ViewPager
        mAdapter = new VpnSelectPagerAdapter(getChildFragmentManager(), getContext());
        mVpVpnSelect.setAdapter(mAdapter);
        // Setup TabLayout
        mTabLayout.setupWithViewPager(mVpVpnSelect);
        // Iterate over all tabs and set the custom view
        for (int i = 0; i < mTabLayout.getTabCount(); i++) {
            TabLayout.Tab aTabItem = mTabLayout.getTabAt(i);
            if (aTabItem != null) {
                aTabItem.setCustomView(mAdapter.getTabView(i));
            }
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
        if (mListener != null)
            mListener.onLoadNextActivity(iIntent, iReqCode);
    }

    public void onActionButtonClicked(String iTag, Dialog iDialog, boolean isPositiveButton) {
        if (isPositiveButton && iTag.equals(AppConstants.TAG_INIT_PAY)) {
            if (mAdapter.getItem(mVpVpnSelect.getCurrentItem()) instanceof VpnListFragment) {
                ((VpnListFragment) mAdapter.getItem(mVpVpnSelect.getCurrentItem())).makeInitPayment();
            }
        }
        iDialog.dismiss();
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

    public void onSortTypeSelected(String iTag, Dialog iDialog, boolean isPositiveButton, String iSelectedSortType) {
        if (isPositiveButton && iTag.equals(AppConstants.TAG_SORT_BY)) {
            if (mAdapter.getItem(mVpVpnSelect.getCurrentItem()) instanceof VpnListFragment) {
                ((VpnListFragment) mAdapter.getItem(mVpVpnSelect.getCurrentItem())).getVpnListLiveDataSortedBy(iSelectedSortType);
            }
        }
        iDialog.dismiss();
    }
}