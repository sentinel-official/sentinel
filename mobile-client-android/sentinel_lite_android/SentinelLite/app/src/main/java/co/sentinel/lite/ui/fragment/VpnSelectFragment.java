package co.sentinel.lite.ui.fragment;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.tbuonomo.viewpagerdotsindicator.DotsIndicator;

import co.sentinel.lite.R;
import co.sentinel.lite.SentinelLiteApp;
import co.sentinel.lite.ui.adapter.VpnSelectAdapter;
import co.sentinel.lite.ui.custom.OnGenericFragmentInteractionListener;
import co.sentinel.lite.util.AppConstants;

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

    private OnGenericFragmentInteractionListener mListener;

    private ViewPager mVpVpnSelect;
    private TabLayout mTabLayout;
    private DotsIndicator dotsIndicator;
    private TextView nodesTitle,settingsTitle;
    private SharedPreferences mPreferences;

    private VpnSelectAdapter mAdapter;

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

     mVpVpnSelect.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
         @Override
         public void onPageScrolled(int i, float v, int i1) {

         }

         @Override
         public void onPageSelected(int i) {
             if(i==0){
                 nodesTitle.animate().alpha(1.0f).translationX(0);
                 settingsTitle.animate().alpha(0.0f).translationX(settingsTitle.getWidth());
                 if(mPreferences.getBoolean("regionvisibility",false)==true){
                     setToolbarVisible();
                 }
             }else if(i==1){
                nodesTitle.animate().alpha(0.0f).translationX(-(nodesTitle.getWidth()));
                settingsTitle.animate().alpha(1.0f).translationX(0);
                setToolbarGone();
             }

         }

         @Override
         public void onPageScrollStateChanged(int i) {

         }
     });
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.select_vpn));
        initContent();
    }

    private void initView(View iView) {
        mVpVpnSelect = iView.findViewById(R.id.vp_vpn_select);
        mTabLayout = iView.findViewById(R.id.tab_layout);
        dotsIndicator = iView.findViewById(R.id.tabDots);
        dotsIndicator.setPointsColor(Color.WHITE);
        nodesTitle = iView.findViewById(R.id.nodesTitle);
        settingsTitle = iView.findViewById(R.id.settingsTitle);
        settingsTitle.setAlpha(0.0f);
        settingsTitle.animate().translationX(settingsTitle.getWidth());
        mPreferences = PreferenceManager.getDefaultSharedPreferences(getContext());

    }

    private void initContent() {
        if (SentinelLiteApp.isVpnInitiated)
            loadNextFragment(VpnConnectedFragment.newInstance());
        else {
            setupViewPagerAndTabs();
        }
    }

    private void setupViewPagerAndTabs() {
        // Setup ViewPager
        mAdapter = new VpnSelectAdapter(getChildFragmentManager(), getContext());
        mVpVpnSelect.setAdapter(mAdapter);
        // Setup TabLayout
        mTabLayout.setupWithViewPager(mVpVpnSelect);
        dotsIndicator.setViewPager(mVpVpnSelect);

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

    public void setToolbarGone(){
        Intent intent = new Intent("toolbargone");
        getActivity().sendBroadcast(intent);
    }

    public void setToolbarVisible(){
        Intent intent = new Intent("toolbarvisible");
        getActivity().sendBroadcast(intent);
    }

    @Override
    public void onDetach() {
        hideProgressDialog();
        super.onDetach();
        mListener = null;
    }
}