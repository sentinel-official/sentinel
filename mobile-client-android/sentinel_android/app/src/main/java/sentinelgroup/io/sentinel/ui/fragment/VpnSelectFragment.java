package sentinelgroup.io.sentinel.ui.fragment;

import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
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
import sentinelgroup.io.sentinel.ui.activity.SendActivity;
import sentinelgroup.io.sentinel.ui.adapter.VpnSelectPagerAdapter;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
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

    private VpnSelectViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private ViewPager mVpVpnSelect;
    private TabLayout mTabLayout;
    private VpnSelectPagerAdapter mAdapter;

    private boolean mIsPaymentPending;

    public VpnSelectFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment VpnSelectFragment.
     */
    public static VpnSelectFragment newInstance() {
        return new VpnSelectFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
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
        if (SentinelApp.isStart)
            loadNextFragment(VpnConnectedFragment.newInstance());
        else {
            VpnSelectViewModelFactory aFactory = InjectorModule.provideVpnSelectViewModelFactory(getContext());
            mViewModel = ViewModelProviders.of(this, aFactory).get(VpnSelectViewModel.class);

            mViewModel.getVpnUsageLiveEvent().observe(this, vpnUsageResource -> {
                if (vpnUsageResource != null && !mIsPaymentPending)
                    if (vpnUsageResource.status.equals(Status.LOADING)) {
                        showProgressDialog(true, getString(R.string.generic_loading_message));
                    } else if (vpnUsageResource.data != null && vpnUsageResource.status.equals(Status.SUCCESS)) {
                        hideProgressDialog();
                        if (vpnUsageResource.data.usage != null && vpnUsageResource.data.usage.getDue() > 0L) {
                            mIsPaymentPending = true;
                            loadNextFragment(VpnPayFragment.newInstance());
                        } else {
                            setupViewPagerAndTabs();
                        }
                    } else if (vpnUsageResource.message != null && vpnUsageResource.status.equals(Status.ERROR)) {
                        hideProgressDialog();
                        showErrorDialog(vpnUsageResource.message);
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

    private Intent getIntent() {
        Intent aIntent = new Intent(getActivity(), SendActivity.class);
        Bundle aBundle = new Bundle();
        aBundle.putBoolean(AppConstants.EXTRA_IS_VPN_PAY, true);
        aBundle.putBoolean(AppConstants.EXTRA_IS_INIT, true);
        aBundle.putString(AppConstants.EXTRA_AMOUNT, getString(R.string.init_vpn_pay));
        aIntent.putExtras(aBundle);
        return aIntent;
    }

    public void makeInitPayment() {
        loadNextActivity(getIntent(), AppConstants.REQ_VPN_INIT_PAY);
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

    public void loadNextFragment(Fragment iFragment) {
        if (mListener != null) {
            mListener.onLoadNextFragment(iFragment);
        }
    }

    public void loadNextActivity(Intent iIntent, int iReqCode) {
        if (mListener != null)
            mListener.onLoadNextActivity(iIntent, iReqCode);
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