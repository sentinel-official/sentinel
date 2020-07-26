package co.sentinel.lite.ui.fragment;

import android.annotation.SuppressLint;
import android.arch.lifecycle.ViewModelProviders;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.constraint.ConstraintLayout;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.Fragment;
import android.support.v4.widget.NestedScrollView;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import java.util.Objects;

import co.sentinel.lite.R;
import co.sentinel.lite.SentinelLiteApp;
import co.sentinel.lite.di.InjectorModule;
import co.sentinel.lite.network.model.VpnListEntity;
import co.sentinel.lite.ui.activity.DashboardActivity;
import co.sentinel.lite.ui.activity.VpnActivity;
import co.sentinel.lite.ui.adapter.VpnAdapter;
import co.sentinel.lite.ui.custom.EmptyRecyclerView;
import co.sentinel.lite.ui.custom.OnGenericFragmentInteractionListener;
import co.sentinel.lite.ui.custom.OnVpnConnectionListener;
import co.sentinel.lite.ui.custom.VpnSearchListener;
import co.sentinel.lite.ui.dialog.SortFilterByDialogFragment;
import co.sentinel.lite.util.AnalyticsHelper;
import co.sentinel.lite.util.AppConstants;
import co.sentinel.lite.util.Status;
import co.sentinel.lite.viewmodel.VpnViewModel;
import co.sentinel.lite.viewmodel.VpnViewModelFactory;

import static android.view.View.GONE;
import static android.view.View.VISIBLE;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnGenericFragmentInteractionListener} &
 * (@link {@link OnVpnConnectionListener})interface
 * to handle interaction events.
 * Use the {@link VpnFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class VpnFragment extends Fragment implements VpnAdapter.OnItemClickListener {

    private VpnViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private OnVpnConnectionListener mVpnListener;

    private SwipeRefreshLayout mSrReload;
    private EmptyRecyclerView mRvVpnList;
    private VpnAdapter mAdapter;
    ConstraintLayout clEurope,clAsia,clNa,clAfrica,clSa,clOceania,clRandom,clFav;
    ConstraintLayout ClBack;
    NestedScrollView ClRegion;
    TextView tvNaCount,tvEuropeCount,tvAsiaCount,tvSaCount,tvAfricaCount,tvOceaniaCount,tvEmpty,tvLoading,tvFavCount;
    View viewHider;
    private SharedPreferences mPreferences;
    private BroadcastReceiver autoReceiver, visibilityReceiver, countReceiver;
    private FloatingActionButton fabQuickConnect;

    private SortFilterByDialogFragment.OnSortFilterDialogActionListener mSortDialogActionListener = (iTag, iDialog, isPositiveButton, iSelectedSortType, toFilterByBookmark) -> {
        if (isPositiveButton && iSelectedSortType != null) {
            if (getActivity() instanceof DashboardActivity) {
                ((DashboardActivity) getActivity()).setFilterByBookmark(toFilterByBookmark);
                ((DashboardActivity) getActivity()).setCurrentSortType(iSelectedSortType.getItemCode());
                getVpnListLiveDataSearchSortFilterBy(((DashboardActivity) getActivity()).getCurrentSearchString(), iSelectedSortType.getItemCode(), toFilterByBookmark);
            } else if (getActivity() instanceof VpnActivity) {
                ((VpnActivity) getActivity()).setFilterByBookmark(toFilterByBookmark);
                ((VpnActivity) getActivity()).setCurrentSortType(iSelectedSortType.getItemCode());
                getVpnListLiveDataSearchSortFilterBy(((VpnActivity) getActivity()).getCurrentSearchString(), iSelectedSortType.getItemCode(), toFilterByBookmark);
            }
        }
        iDialog.dismiss();
    };

    private VpnSearchListener mVpnListSearchListener = iSearchQuery -> {
        if (getActivity() instanceof DashboardActivity)
            getVpnListLiveDataSearchSortFilterBy(iSearchQuery, ((DashboardActivity) getActivity()).getCurrentSortType(), ((DashboardActivity) getActivity()).toFilterByBookmark());
        else if (getActivity() instanceof VpnActivity)
            getVpnListLiveDataSearchSortFilterBy(iSearchQuery, ((VpnActivity) getActivity()).getCurrentSortType(), ((VpnActivity) getActivity()).toFilterByBookmark());
    };

    public VpnFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment VpnListFragment.
     */
    public static VpnFragment newInstance() {
        return new VpnFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }


    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_list, container, false);

    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
        registerReceivers();
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.vpn_connections));
        initViewModel();
        if (getActivity() instanceof DashboardActivity) {
            ((DashboardActivity) getActivity()).setVpnListSearchListener(mVpnListSearchListener);
            ((DashboardActivity) getActivity()).setSortDialogActionListener(mSortDialogActionListener);
        } else if (getActivity() instanceof VpnActivity) {
            ((VpnActivity) getActivity()).setVpnListSearchListener(mVpnListSearchListener);
            ((VpnActivity) getActivity()).setSortDialogActionListener(mSortDialogActionListener);
        }
    }

    private void initView(View iView) {
        mSrReload = iView.findViewById(R.id.sr_reload);
        mRvVpnList = iView.findViewById(R.id.rv_list);
        mRvVpnList.setAlpha(0.0f);
        TextView aTvEmpty = iView.findViewById(R.id.tv_empty_message);
        // Setup RecyclerView
        mRvVpnList.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.VERTICAL, false));
        aTvEmpty.setText(R.string.vpn_empty_list_message);

        mAdapter = new VpnAdapter(this, getContext(),getActivity().getApplication());
        mRvVpnList.setAdapter(mAdapter);
        // setup swipe to refresh layout
        mSrReload.setOnRefreshListener(() -> {
            mViewModel.reloadVpnList();
            mSrReload.setRefreshing(false);
        });

        //REVAMP Select region. Region buttons will disappear to reveal server list once selected
        mPreferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        ClRegion = iView.findViewById(R.id.cl_region);
        fabQuickConnect = iView.findViewById(R.id.fab_quickconnect);
        fabQuickConnect.hide();
        tvLoading = iView.findViewById(R.id.tv_loading);
        ClBack = iView.findViewById(R.id.clBack);
        ClBack.setVisibility(GONE);
        viewHider = iView.findViewById(R.id.viewHider);
        clEurope = iView.findViewById(R.id.cl_europe);
        clAsia = iView.findViewById(R.id.cl_asia);
        clNa = iView.findViewById(R.id.cl_na);
        clSa = iView.findViewById(R.id.cl_sa);
        clAfrica = iView.findViewById(R.id.cl_africa);
        clOceania = iView.findViewById(R.id.cl_oceania);
        clRandom = iView.findViewById(R.id.cl_random);
        clFav = iView.findViewById(R.id.cl_fav);


        //Assigning server count values to counter text views
        tvNaCount = iView.findViewById(R.id.tvCountNa);
        tvEuropeCount = iView.findViewById(R.id.tvCountEurope);
        tvAsiaCount= iView.findViewById(R.id.tvCountAsia);
        tvAfricaCount = iView.findViewById(R.id.tvCountAfrica);
        tvSaCount = iView.findViewById(R.id.tvCountSa);
        tvOceaniaCount = iView.findViewById(R.id.tvCountOceania);
        tvFavCount = iView.findViewById(R.id.tvCountFav);


        if(mPreferences.getInt("firstlaunch",0)==0){
            new Handler().postDelayed(new Runnable() {
              @Override
            public void run() {
                  mAdapter.assignRegionCount();
                  getUpdatedServerCounts();
                  clFav.setVisibility(VISIBLE);
                  mPreferences.edit().putInt("firstlaunch",1).apply();
                  ClRegion.setVisibility(View.VISIBLE);
                  fabQuickConnect.show();
                  tvLoading.setVisibility(GONE);
                }
              }, 3000);
            }else{
            getUpdatedServerCounts();
            clFav.setVisibility(VISIBLE);
            ClRegion.setVisibility(View.VISIBLE);
            fabQuickConnect.show();
            tvLoading.setVisibility(GONE);
            }

        clEurope.setOnClickListener(v -> initiateRegionClick(1));

        clAsia.setOnClickListener(v -> initiateRegionClick(2));

        clNa.setOnClickListener(v -> initiateRegionClick(3));

        clAfrica.setOnClickListener(v -> initiateRegionClick(4));

        clSa.setOnClickListener(v -> initiateRegionClick(5));

        clOceania.setOnClickListener(v -> initiateRegionClick(6));

        clFav.setOnClickListener(v -> initiateRegionClick(7));

        //REVAMP return to region selection if the user wants to view nodes from other continents
        ClBack.setOnClickListener(v -> {
            ClRegion.setVisibility(View.VISIBLE);
            fabQuickConnect.show();
            mRvVpnList.setVisibility(View.VISIBLE);
            mRvVpnList.setAlpha(0.0f);
            ClBack.setVisibility(GONE);
            mPreferences.edit().putBoolean("regionvisibility",false).apply();
            setToolbarGone();
        });

        clRandom.setOnClickListener(v -> onConnectClicked(mAdapter.generateRandomAddress()));
        fabQuickConnect.setOnClickListener(v -> onConnectClicked(mAdapter.generateRandomAddress()));

        //REVAMP this view serves as a wall to prevent the user from accidentally clicking the invisible recyclerview (which cannot be made GONE without refreshing)
        viewHider.setOnClickListener(v -> {});
    }

    public void initiateRegionClick(int flagCode){
        ClRegion.setVisibility(GONE);
        fabQuickConnect.hide();
        mPreferences.edit().putInt("regionFlag",flagCode).apply();
        mAdapter.setRegion();
        mAdapter.assignRegionCount();
        mRvVpnList.animate().alpha(1.0f);
        mRvVpnList.setVisibility(VISIBLE);
        ClBack.setVisibility(View.VISIBLE);
        mPreferences.edit().putBoolean("regionvisibility",true).apply();
        setToolbarVisible();
    }

    public void setToolbarVisible(){
        Intent intent = new Intent("toolbarvisible");
        getActivity().sendBroadcast(intent);
    }

    public void setToolbarGone(){
        Intent intent = new Intent("toolbargone");
        getActivity().sendBroadcast(intent);
    }

    private void initViewModel() {
        // init Device ID
        @SuppressLint("HardwareIds") String aDeviceId = Settings.Secure.getString(Objects.requireNonNull(getActivity()).getContentResolver(), Settings.Secure.ANDROID_ID);

        VpnViewModelFactory aFactory = InjectorModule.provideVpnListViewModelFactory(getContext(), aDeviceId);
        mViewModel = ViewModelProviders.of(this, aFactory).get(VpnViewModel.class);

        if (getActivity() instanceof DashboardActivity)
            getVpnListLiveDataSearchSortFilterBy(((DashboardActivity) getActivity()).getCurrentSearchString(), ((DashboardActivity) getActivity()).getCurrentSortType(), ((DashboardActivity) getActivity()).toFilterByBookmark());
        else if (getActivity() instanceof VpnActivity)
            getVpnListLiveDataSearchSortFilterBy(((VpnActivity) getActivity()).getCurrentSearchString(), ((VpnActivity) getActivity()).getCurrentSortType(), ((VpnActivity) getActivity()).toFilterByBookmark());
        else
            getVpnListLiveDataSearchSortFilterBy("%%", AppConstants.SORT_BY_DEFAULT, false);

        mViewModel.getVpnListErrorLiveEvent().observe(this, iMessage -> {
            if (iMessage != null && !iMessage.isEmpty() && mAdapter.getItemCount() != 0)
                if (iMessage.equals(AppConstants.ERROR_GENERIC))
                    showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), AppConstants.VALUE_DEFAULT);
                else
                    showSingleActionDialog(AppConstants.VALUE_DEFAULT, iMessage, AppConstants.VALUE_DEFAULT);
        });
        mViewModel.getVpnGetServerCredentials().observe(this, vpnCredentialsResource -> {
            if (vpnCredentialsResource != null) {
                if (vpnCredentialsResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.fetching_server_details));
                } else if (vpnCredentialsResource.data != null && vpnCredentialsResource.status.equals(Status.SUCCESS)) {
                    mViewModel.getVpnConfig(vpnCredentialsResource.data);
                } else if (vpnCredentialsResource.message != null && vpnCredentialsResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    if (vpnCredentialsResource.message.equals(AppConstants.ERROR_GENERIC))
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
                    if (vpnConfigResource.message.equals(AppConstants.ERROR_GENERIC))
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
                    initiateVpnConnection(vpnConfigSaveResource.data);
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

    public void initiateVpnConnection(String iVpnConfigFilePath) {
        if (mVpnListener != null) {
            mVpnListener.onVpnConnectionInitiated(iVpnConfigFilePath);
        }
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
        mVpnListSearchListener = null;
        mSortDialogActionListener = null;
        if (getActivity() instanceof DashboardActivity) {
            ((DashboardActivity) getActivity()).removeVpnListSearchListener();
            ((DashboardActivity) getActivity()).removeSortDialogActionListener();
        } else if (getActivity() instanceof VpnActivity) {
            ((VpnActivity) getActivity()).removeVpnListSearchListener();
            ((VpnActivity) getActivity()).removeSortDialogActionListener();
        }
    }

    @Override
    public void onRootViewClicked(VpnListEntity iItemData) {
        if (getActivity() instanceof DashboardActivity) {
            Intent aIntent = new Intent(getActivity(), VpnActivity.class);
            aIntent.putExtra(AppConstants.EXTRA_VPN_LIST, iItemData);
            loadNextActivity(aIntent, AppConstants.REQ_VPN_CONNECT);
            getActivity().overridePendingTransition(R.anim.enter_right_to_left, R.anim.exit_left_to_right);
            setToolbarGone();
        } else {
            loadNextFragment(VpnDetailsFragment.newInstance(iItemData));
        }
    }

    @Override
    public void onConnectClicked(String iVpnAddress) {
        if (!SentinelLiteApp.isVpnConnected) {
            mViewModel.getVpnServerCredentials(iVpnAddress);
            AnalyticsHelper.triggerOVPNConnectInit();
        } else
            showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.vpn_already_connected), AppConstants.VALUE_DEFAULT);
    }

    @Override
    public void onBookmarkClicked(VpnListEntity iItemData) {
        mViewModel.toggleVpnBookmark(iItemData.getAccountAddress(), iItemData.getIp());
        Toast.makeText(getContext(), iItemData.isBookmarked() ? R.string.alert_bookmark_removed : R.string.alert_bookmark_added, Toast.LENGTH_SHORT).show();
    }

    public void getVpnListLiveDataSearchSortFilterBy(String iSearchQuery, String iSelectedSortType, boolean toFilterByBookmark) {
        if (mViewModel != null) {
            mViewModel.getVpnListLiveDataSearchSortFilterBy(iSearchQuery, iSelectedSortType, toFilterByBookmark).observe(this, vpnList -> {
                if (vpnList != null) {
                    mAdapter.loadData(vpnList);
                    mRvVpnList.scrollToPosition(0);
                }
            });
        }
    }

    public void registerReceivers(){
        autoReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context arg0, Intent intent) {
                String action = intent.getAction();
                if (action.equals("auto")) {
                    onConnectClicked(mPreferences.getString("randomNodeAddress","0"));
                }
            }
        };
        getActivity().registerReceiver(autoReceiver, new IntentFilter("auto"));

        visibilityReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String action = intent.getAction();
                if (action.equals("closelist")){
                    ClRegion.setVisibility(View.VISIBLE);
                    fabQuickConnect.show();
                    mRvVpnList.setVisibility(View.VISIBLE);
                    mRvVpnList.setAlpha(0.0f);
                    ClBack.setVisibility(GONE);
                    mPreferences.edit().putBoolean("regionvisibility",false).apply();
                }
            }
        };
        getActivity().registerReceiver(visibilityReceiver, new IntentFilter("closelist"));

        countReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context arg0, Intent intent) {
                String action = intent.getAction();
                if (action.equals("count")) {
                    mAdapter.assignRegionCount();
                    getUpdatedServerCounts();
                }
            }
        };
        getActivity().registerReceiver(countReceiver, new IntentFilter("count"));

    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        getActivity().unregisterReceiver(visibilityReceiver);
        getActivity().unregisterReceiver(autoReceiver);
        getActivity().unregisterReceiver(countReceiver);

    }

    @Override
    public void onResume() {
        super.onResume();
        mViewModel.reloadVpnList();
        if (mRvVpnList.getVisibility()==VISIBLE){
            setToolbarVisible();
        }
    }

    public void getUpdatedServerCounts(){
                checkCounts("naCount",clNa,tvNaCount);
                checkCounts("europeCount",clEurope,tvEuropeCount);
                checkCounts("asiaCount",clAsia,tvAsiaCount);
                checkCounts("africaCount",clAfrica,tvAfricaCount);
                checkCounts("saCount",clSa,tvSaCount);
                checkCounts("oceaniaCount",clOceania,tvOceaniaCount);
                checkCounts("favCount",clFav,tvFavCount);
    }

    public void checkCounts(String key, ConstraintLayout regionButton, TextView textCount){
        if(mPreferences.getInt(key,-1)==0&&!key.equals("favCount")){//if the region count is zero, hide the region's button
            regionButton.setVisibility(GONE);
        }else if(mPreferences.getInt(key,-1)==-1){//if the region count is -1 then region count has not been initialized, recursively calculate until the value is obtained

        }else{
            regionButton.setVisibility(View.VISIBLE);//if the region count is above 0 display the region's button
        }
        textCount.setText(Integer.toString(mPreferences.getInt(key,0)));
    }

}
