package co.sentinel.sentinellite.ui.activity;

import android.app.Dialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.os.RemoteException;
import android.support.annotation.Nullable;
import android.support.design.widget.NavigationView;
import android.support.v4.app.Fragment;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.AppCompatEditText;
import android.support.v7.widget.AppCompatImageButton;
import android.support.v7.widget.Toolbar;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.util.HashMap;
import java.util.Map;

import co.sentinel.sentinellite.BuildConfig;
import co.sentinel.sentinellite.R;
import co.sentinel.sentinellite.SentinelLiteApp;
import co.sentinel.sentinellite.ui.custom.OnGenericFragmentInteractionListener;
import co.sentinel.sentinellite.ui.custom.OnVpnConnectionListener;
import co.sentinel.sentinellite.ui.custom.ProfileAsync;
import co.sentinel.sentinellite.ui.custom.VpnListSearchListener;
import co.sentinel.sentinellite.ui.dialog.DoubleActionDialogFragment;
import co.sentinel.sentinellite.ui.dialog.ProgressDialogFragment;
import co.sentinel.sentinellite.ui.dialog.RatingDialogFragment;
import co.sentinel.sentinellite.ui.dialog.SingleActionDialogFragment;
import co.sentinel.sentinellite.ui.dialog.SortFilterByDialogFragment;
import co.sentinel.sentinellite.ui.dialog.TripleActionDialogFragment;
import co.sentinel.sentinellite.ui.fragment.VpnConnectedFragment;
import co.sentinel.sentinellite.ui.fragment.VpnSelectFragment;
import co.sentinel.sentinellite.util.AnalyticsHelper;
import co.sentinel.sentinellite.util.AppConstants;
import co.sentinel.sentinellite.util.AppPreferences;
import co.sentinel.sentinellite.util.DoneOnEditorActionListener;
import co.sentinel.sentinellite.util.Logger;
import de.blinkt.openvpn.LaunchVPN;
import de.blinkt.openvpn.VpnProfile;
import de.blinkt.openvpn.core.ConnectionStatus;
import de.blinkt.openvpn.core.IOpenVPNServiceInternal;
import de.blinkt.openvpn.core.OpenVPNManagement;
import de.blinkt.openvpn.core.OpenVPNService;
import de.blinkt.openvpn.core.ProfileManager;
import de.blinkt.openvpn.core.VpnStatus;

import static co.sentinel.sentinellite.util.AppConstants.TAG_DOUBLE_ACTION_DIALOG;
import static co.sentinel.sentinellite.util.AppConstants.TAG_PROGRESS_DIALOG;
import static co.sentinel.sentinellite.util.AppConstants.TAG_RATING_DIALOG;
import static co.sentinel.sentinellite.util.AppConstants.TAG_SINGLE_ACTION_DIALOG;
import static co.sentinel.sentinellite.util.AppConstants.TAG_TRIPLE_ACTION_DIALOG;
import static de.blinkt.openvpn.core.OpenVPNService.humanReadableByteCount;

public class DashboardActivity extends AppCompatActivity implements OnGenericFragmentInteractionListener,
        OnVpnConnectionListener, VpnStatus.StateListener, VpnStatus.ByteCountListener, DoubleActionDialogFragment.OnDialogActionListener, View.OnClickListener {

    private boolean mHasActivityResult;

    private DrawerLayout mDrawerLayout;
    private NavigationView mNavMenuView, mNavFooter;
    private Toolbar mToolbar;
    private TextView mToolbarTitle;
    private AppCompatImageButton mIbCloseSearch, mIbClearSearch;
    private LinearLayout mLlSearch;
    private AppCompatEditText mEtSearch;
    private ProgressDialogFragment mPrgDialog;
    private MenuItem mMenuSearch, mMenuSort;
    private ProfileAsync profileAsync;
    private IOpenVPNServiceInternal mService;
    private ServiceConnection mConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName className, IBinder service) {
            mService = IOpenVPNServiceInternal.Stub.asInterface(service);
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            mService = null;
        }
    };

    private SortFilterByDialogFragment.OnSortFilterDialogActionListener mSortDialogActionListener;
    private VpnListSearchListener mVpnListSearchListener;

    private boolean toFilterByBookmark;
    private boolean toShowOptionsMenu;
    private String mCurrentSortType = AppConstants.SORT_BY_DEFAULT;
    private StringBuilder mCurrentSearchString = new StringBuilder();
    private TextWatcher mSearchWatcher = new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {

        }

        @Override
        public void afterTextChanged(Editable s) {
            mIbClearSearch.setVisibility(TextUtils.isEmpty(s) ? View.GONE : View.VISIBLE);
            if (s.length() >= 3) {
                setCurrentSearchString(s.toString());
                triggerSearch();
            } else if (TextUtils.isEmpty(s)) {
                clearCurrentSearchString();
                triggerSearch();
            }
        }
    };

    private Map<Integer, Fragment> mFragmentMap = new HashMap<>();

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);
        shouldShowHelper();
        initView();
        initListeners();
        loadVpnFragment(null);
    }

    @Override
    protected void onStart() {
        super.onStart();
        // setup VPN listeners & services
        Intent intent = new Intent(this, OpenVPNService.class);
        intent.setAction(OpenVPNService.START_SERVICE);
        bindService(intent, mConnection, Context.BIND_AUTO_CREATE);
    }

    @Override
    protected void onResume() {
        VpnStatus.addStateListener(this);
        VpnStatus.addByteCountListener(this);
        super.onResume();
    }

    @Override
    protected void onPause() {
        VpnStatus.removeStateListener(this);
        VpnStatus.removeByteCountListener(this);
        super.onPause();
    }

    @Override
    protected void onStop() {
        super.onStop();
        unbindService(mConnection);
    }

    @Override
    public void onBackPressed() {
        if (mDrawerLayout != null && mDrawerLayout.isDrawerOpen(GravityCompat.START))
            mDrawerLayout.closeDrawers();
        else if (mLlSearch.getVisibility() == View.VISIBLE)
            closeSearch();
        else
            super.onBackPressed();
    }

    public void setCurrentSearchString(String iSearchQuery) {
        mCurrentSearchString.replace(0, mCurrentSearchString.length(), iSearchQuery);
    }

    public void clearCurrentSearchString() {
        mCurrentSearchString.delete(0, mCurrentSearchString.length());
    }

    public boolean toFilterByBookmark() {
        return toFilterByBookmark;
    }

    public void setFilterByBookmark(boolean toFilterByBookmark) {
        this.toFilterByBookmark = toFilterByBookmark;
    }

    public String getCurrentSearchString() {
        return "%" + mCurrentSearchString.toString() + "%";
    }

    public void setCurrentSortType(String iSortType) {
        mCurrentSortType = iSortType;
    }

    public String getCurrentSortType() {
        return mCurrentSortType;
    }

    public void setVpnListSearchListener(VpnListSearchListener iVpnListSearchListener) {
        mVpnListSearchListener = iVpnListSearchListener;
    }

    public void removeVpnListSearchListener() {
        mVpnListSearchListener = null;
    }

    public void setSortDialogActionListener(SortFilterByDialogFragment.OnSortFilterDialogActionListener iSortDialogActionListener) {
        mSortDialogActionListener = iSortDialogActionListener;
    }

    public void removeSortDialogActionListener() {
        mSortDialogActionListener = null;
    }

    private void triggerSearch() {
        if (mVpnListSearchListener != null) {
            mVpnListSearchListener.onSearchTriggered(getCurrentSearchString());
        }
    }

    /*
     *  Show the Helper screens when the user is opening the app for the first time
     */
    private void shouldShowHelper() {
//        TODO Change logic
//        if (!AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_HELPER_SHOWN)) {
        if (AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_HELPER_SHOWN)) {
            onLoadNextActivity(new Intent(this, HelperActivity.class), AppConstants.REQ_HELPER_SCREENS);
        }
    }

    /*
     * Instantiate all the views used in the XML and perform other instantiation steps (if needed)
     */
    private void initView() {
        mToolbar = findViewById(R.id.toolbar);
        mToolbarTitle = findViewById(R.id.toolbar_title);
        mDrawerLayout = findViewById(R.id.drawer_layout);
        mPrgDialog = ProgressDialogFragment.newInstance(true);
        mNavMenuView = findViewById(R.id.nav_menu_view);
        mNavFooter = findViewById(R.id.nav_footer_view);
        mLlSearch = findViewById(R.id.ll_search);
        mEtSearch = findViewById(R.id.et_search);
        mIbCloseSearch = findViewById(R.id.ib_close_search);
        mIbClearSearch = findViewById(R.id.ib_clear_search);
        // set drawer scrim color
        mDrawerLayout.setScrimColor(Color.TRANSPARENT);
        // instantiate toolbar
        setupToolbar();
        // add listeners
        mNavMenuView.setItemIconTintList(null);
        mNavMenuView.getHeaderView(0).findViewById(R.id.ib_back).setOnClickListener(v -> mDrawerLayout.closeDrawers());
        mNavMenuView.setNavigationItemSelectedListener(
                menuItem -> {
                    // set item as selected to persist highlight
                    menuItem.setChecked(true);
                    // handle item click
                    handleNavigationItemClick(menuItem.getItemId());
                    // close drawer when item is tapped
                    mDrawerLayout.closeDrawers();
                    return true;
                });
        String aVersionName = getString(R.string.lite, BuildConfig.VERSION_NAME);
        ((TextView) mNavFooter.getHeaderView(0).findViewById(R.id.tv_app_version)).setText(aVersionName);
        mNavFooter.getHeaderView(0).findViewById(R.id.ib_telegram).setOnClickListener(v -> openUrl(getString(R.string.telegram_url)));
        mNavFooter.getHeaderView(0).findViewById(R.id.ib_medium).setOnClickListener(v -> openUrl(getString(R.string.medium_url)));
        mNavFooter.getHeaderView(0).findViewById(R.id.ib_twitter).setOnClickListener(v -> openUrl(getString(R.string.twitter_url)));
        mNavFooter.getHeaderView(0).findViewById(R.id.ib_website).setOnClickListener(v -> openUrl(getString(R.string.website_url)));
    }

    /**
     * Setup Listeners for all views
     */
    private void initListeners() {
        mEtSearch.addTextChangedListener(mSearchWatcher);
        mEtSearch.setOnEditorActionListener(new DoneOnEditorActionListener());
        mIbCloseSearch.setOnClickListener(this);
        mIbClearSearch.setOnClickListener(this);
    }

    /*
     * Handle click action on the Navigation items
     */
    private void handleNavigationItemClick(int itemItemId) {
        switch (itemItemId) {
            case R.id.nav_vpn_usage:
                startActivityForResult(new Intent(this, VpnUsageActivity.class), AppConstants.REQ_VPN_USAGE);
                break;
            case R.id.nav_language:
                startActivityForResult(new Intent(this,
                        GenericListActivity.class).putExtra(AppConstants.EXTRA_REQ_CODE, AppConstants.REQ_LANGUAGE), AppConstants.REQ_LANGUAGE);
                break;
            case R.id.nav_share_app:
                startActivity(new Intent(this, ShareAppActivity.class));
                break;
            case R.id.nav_faq:
                openUrl(getString(R.string.link_coming_soon));
                break;
        }
    }

    /*
     * Set the toolbar as the default actionbar and set the home indicator
     */
    private void setupToolbar() {
        setSupportActionBar(mToolbar);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayShowTitleEnabled(false);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeAsUpIndicator(R.drawable.ic_hamburger_menu);
        }
        setToolbarTitle(getString(R.string.app_name));
    }

    /**
     * Set the toolbar title
     *
     * @param iTitle [String] The title to be shown in the toolbar
     */
    protected void setToolbarTitle(String iTitle) {
        findViewById(R.id.toolbar_icon).setVisibility(iTitle.equals(getString(R.string.app_name)) ? View.VISIBLE : View.GONE);
        mToolbarTitle.setText(iTitle);
    }

    /*
     * Open url in chrome or other web viewer
     */
    private void openUrl(String iUrl) {
        if (iUrl != null && !iUrl.isEmpty() && (iUrl.startsWith("http://") || iUrl.startsWith("https://"))) {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(iUrl)));
        } else {
            showSingleActionError(AppConstants.VALUE_DEFAULT, iUrl, AppConstants.VALUE_DEFAULT);
        }
    }

    /**
     * Shows dialog to give rating for previous dVPN session.
     */
    private void showRatingDialog() {
        RatingDialogFragment.newInstance().show(getSupportFragmentManager(), TAG_RATING_DIALOG);
    }

    /**
     * Initialize the Progress Dialog which needs to be shown while loading a screen
     *
     * @param isHalfDim [boolean] Denotes whether the dialog's background should be transparent or
     *                  dimmed
     * @param iMessage  [String] The message text which needs to be shown as Loading message
     */
    private void showProgressDialog(boolean isHalfDim, String iMessage) {
        toggleProgressDialogState(true, isHalfDim, iMessage == null ? getString(R.string.generic_loading_message) : iMessage);
    }

    /**
     * Hide the Progress Dialog window if it is currently being displayed
     */
    private void hideProgressDialog() {
        toggleProgressDialogState(false, false, null);
    }

    /*
     * Helper method to initialize & update the attributes of the Progress Dialog and to toggle
     * it's visibility
     */
    private void toggleProgressDialogState(boolean isShow, boolean isHalfDim, String iMessage) {
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(TAG_PROGRESS_DIALOG);
        if (isShow) {
            if (aFragment == null) {
                if (!isHalfDim)
                    mPrgDialog.setNoDim();
                mPrgDialog.setLoadingMessage(iMessage);
                mPrgDialog.show(getSupportFragmentManager(), TAG_PROGRESS_DIALOG);
            } else {
                mPrgDialog.updateLoadingMessage(iMessage);
            }
        } else {
            if (aFragment != null && mPrgDialog != null)
                mPrgDialog.dismissAllowingStateLoss();
        }
    }

    /**
     * Shows an Error dialog with a Single button
     *
     * @param iTitleId          [int] The resource id of the title to be displayed
     * @param iMessage          [String] The error message to be displayed
     * @param iPositiveOptionId [int] The resource id of the button text
     */
    protected void showSingleActionError(int iTitleId, String iMessage, int iPositiveOptionId) {
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(TAG_SINGLE_ACTION_DIALOG);
        int aTitleId = iTitleId != -1 ? iTitleId : R.string.please_note;
        int aPositiveOptionText = iPositiveOptionId != -1 ? iPositiveOptionId : android.R.string.ok;
        if (aFragment == null)
            SingleActionDialogFragment.newInstance(aTitleId, iMessage, aPositiveOptionText)
                    .show(getSupportFragmentManager(), TAG_SINGLE_ACTION_DIALOG);
    }

    /**
     * Shows an Error dialog with a Two buttons
     *
     * @param iTag              [String] The Tag assigned to the fragment when it's added to the container
     * @param iTitleId          [int] The resource id of the title to be displayed
     * @param iMessage          [String] The error message to be displayed
     * @param iPositiveOptionId [int] The resource id of the positive button text
     * @param iNegativeOptionId [int] The resource id of the negative button text
     */
    protected void showDoubleActionDialog(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId) {
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(TAG_DOUBLE_ACTION_DIALOG);
        int aTitleId = iTitleId != -1 ? iTitleId : R.string.please_note;
        int aPositiveOptionId = iPositiveOptionId != -1 ? iPositiveOptionId : android.R.string.ok;
        int aNegativeOptionId = iNegativeOptionId != -1 ? iNegativeOptionId : android.R.string.cancel;
        if (aFragment == null)
            DoubleActionDialogFragment.newInstance(iTag, aTitleId, iMessage, aPositiveOptionId, aNegativeOptionId)
                    .show(getSupportFragmentManager(), TAG_DOUBLE_ACTION_DIALOG);
    }

    /**
     * Shows a dialog with a Three buttons
     *
     * @param iTag              [String] The Tag assigned to the fragment when it's added to the container
     * @param iTitleId          [int] The resource id of the title to be displayed (default - "Please Note")
     * @param iMessage          [String] The error message to be displayed
     * @param iPositiveOptionId [int] The resource id of the positive button text (default - "Yes")
     * @param iNegativeOptionId [int] The resource id of the negative button text (default - "No")
     * @param iNeutralOptionId  [int] The resource id of the neutral button text (default - "Cancel")
     */
    protected void showTripleActionError(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId, int iNeutralOptionId) {
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(TAG_TRIPLE_ACTION_DIALOG);
        int aTitleId = iTitleId != -1 ? iTitleId : R.string.please_note;
        int aPositiveOptionId = iPositiveOptionId != -1 ? iPositiveOptionId : android.R.string.yes;
        int aNegativeOptionId = iNegativeOptionId != -1 ? iNegativeOptionId : android.R.string.no;
        int aNeutralOptionId = iNeutralOptionId != -1 ? iNeutralOptionId : android.R.string.cancel;
        if (aFragment == null)
            TripleActionDialogFragment.newInstance(iTag, aTitleId, iMessage, aPositiveOptionId, aNegativeOptionId, aNeutralOptionId)
                    .show(getSupportFragmentManager(), TAG_TRIPLE_ACTION_DIALOG);
    }

    /**
     * Replace the existing fragment in the container with the new fragment passed in this method's
     * parameters
     *
     * @param iFragment [Fragment] The fragment which needs to be displayed
     */
    private void loadFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, iFragment).commit();
        toShowOptionsMenu = iFragment instanceof VpnSelectFragment;
        invalidateOptionsMenu();
        closeSearch();
    }

    /*
     * Replaces the existing fragment in the container with VpnSelectFragment
     */
    private void loadVpnFragment(String iMessage) {
        loadFragment(VpnSelectFragment.newInstance(iMessage));
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_dashboard, menu);
        mMenuSearch = menu.findItem(R.id.action_search);
        mMenuSort = menu.findItem(R.id.action_sort);
        mMenuSearch.setVisible(toShowOptionsMenu);
        mMenuSort.setVisible(toShowOptionsMenu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                closeSearch();
                mDrawerLayout.openDrawer(GravityCompat.START);
                return true;

            case R.id.action_search:
                openSearch();
                return true;

            case R.id.action_sort:
                openSortDialog();
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    /*
     * Update the Options Menu icon
     */
    public void toggleItemState() {
        mMenuSort.setIcon((!getCurrentSortType().equals(AppConstants.SORT_BY_DEFAULT) || toFilterByBookmark()) ? R.drawable.ic_sorted : R.drawable.ic_sort);
    }

    /*
     * Load the VPN profile to which connection is to be established, observe it's load state and
     * perform the necessary action
     */
    private void setupProfile(String iPath) {
        if (!SentinelLiteApp.isVpnConnected) {
            profileAsync = new ProfileAsync(this, iPath, new ProfileAsync.OnProfileLoadListener() {
                @Override
                public void onProfileLoadSuccess() {
                    startVPN();
                }

                @Override
                public void onProfileLoadFailed(String iMessage) {
                    Toast.makeText(DashboardActivity.this, "Init Fail" + iMessage, Toast.LENGTH_SHORT).show();
                }
            });
            profileAsync.execute();
        }
    }

    /*
     * Start VPN connection after the VPN profile is loaded successfully
     */
    private void startVPN() {
        try {
            ProfileManager pm = ProfileManager.getInstance(this);
            VpnProfile profile = pm.getProfileByName(Build.MODEL);//
            startVPNConnection(profile);
        } catch (Exception ex) {
            SentinelLiteApp.isVpnConnected = false;
        }
    }

    /*
     * Launch the activity which handles the VPN connection by passing it the VPN profile
     */
    private void startVPNConnection(VpnProfile profile) {
        Intent intent = new Intent(getApplicationContext(), LaunchVPN.class);
        intent.putExtra(LaunchVPN.EXTRA_KEY, profile.getUUID().toString());
        intent.setAction(Intent.ACTION_MAIN);
        startActivity(intent);
    }

    /*
     * Stop the VPN service and delete the last used VPN profile
     */
    private void stopVPNConnection() {
        ProfileManager.setConntectedVpnProfileDisconnected(this);
        if (mService != null) {
            try {
                mService.stopVPN(false);
            } catch (RemoteException e) {
                VpnStatus.logException(e);
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case AppConstants.REQ_VPN_CONNECT:
                if (resultCode == RESULT_OK)
                    mHasActivityResult = true;
                break;

            case AppConstants.REQ_HELPER_SCREENS:
                if (resultCode == RESULT_OK)
//                    TODO uncomment below line
                    // AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_HELPER_SHOWN, true);
                    break;

            case AppConstants.REQ_LANGUAGE:
                if (resultCode == RESULT_OK)
                    refreshMenuTitles();
                loadVpnFragment(null);
                break;
        }
    }

    /*
     * Refresh the navigation menu titles after a new language is set
     */
    private void refreshMenuTitles() {
        Menu aMenu = mNavMenuView.getMenu();
        MenuItem aMenuVpnUsage = aMenu.findItem(R.id.nav_vpn_usage);
        aMenuVpnUsage.setTitle(R.string.vpn_usage);
        MenuItem aMenuLanguage = aMenu.findItem(R.id.nav_language);
        aMenuLanguage.setTitle(R.string.language);
        MenuItem aMenuReferral = aMenu.findItem(R.id.nav_share_app);
        aMenuReferral.setTitle(R.string.share_app);
        MenuItem aMenuSocialLinks = aMenu.findItem(R.id.nav_faq);
        aMenuSocialLinks.setTitle(R.string.faq);
        setToolbarTitle(getString(R.string.app_name));
    }


    @Override
    public void onFragmentLoaded(String iTitle) {
        // Unimplemented interface method
    }

    @Override
    public void onShowProgressDialog(boolean isHalfDim, String iMessage) {
        showProgressDialog(isHalfDim, iMessage);
    }

    @Override
    public void onHideProgressDialog() {
        hideProgressDialog();
    }

    @Override
    public void onShowSingleActionDialog(int iTitleId, String iMessage, int iPositiveOptionId) {
        showSingleActionError(iTitleId, iMessage, iPositiveOptionId);
    }

    @Override
    public void onShowDoubleActionDialog(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId) {
        showDoubleActionDialog(iTag, iTitleId, iMessage, iPositiveOptionId, iNegativeOptionId);
    }

    @Override
    public void onShowTripleActionDialog(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId, int iNeutralOptionId) {
        showTripleActionError(iTag, iTitleId, iMessage, iPositiveOptionId, iNegativeOptionId, iNeutralOptionId);
    }

    @Override
    public void onCopyToClipboardClicked(String iCopyString, int iToastTextId) {

    }

    @Override
    public void onLoadNextFragment(Fragment iNextFragment) {
        loadFragment(iNextFragment);
        hideKeyboard();
    }

    @Override
    public void onLoadNextActivity(Intent iIntent, int iReqCode) {
        if (iIntent != null)
            if (iReqCode != AppConstants.REQ_CODE_NULL)
                startActivityForResult(iIntent, iReqCode);
            else
                startActivity(iIntent);
        hideKeyboard();
    }

    @Override
    public void onVpnConnectionInitiated(String iVpnConfigFilePath) {
        loadFragment(VpnConnectedFragment.newInstance());
        setupProfile(iVpnConfigFilePath);
    }

    @Override
    public void onVpnDisconnectionInitiated() {
        SentinelLiteApp.isVpnConnected = true;
        stopVPNConnection();
    }

    @Override
    public void onActionButtonClicked(String iTag, Dialog iDialog, int iButtonType) {
        // unimplemented interface method
    }

    @Override
    public void updateState(String state, String logMessage, int localizedResId, ConnectionStatus level) {
        Logger.logError("VPN_STATE", state + " - " + logMessage + " : " + getString(localizedResId), null);

        runOnUiThread(() -> {
            Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
            // Called when the VPN connection terminates
            if (state.equals("USER_VPN_PERMISSION_CANCELLED")
                    || (state.equals("CONNECTRETRY"))
                    || (state.equals("NOPROCESS") && SentinelLiteApp.isVpnConnected)) {
                AppPreferences.getInstance().saveLong(AppConstants.PREFS_CONNECTION_START_TIME, 0L);
                switch (state) {
                    case "USER_VPN_PERMISSION_CANCELLED":
                        loadVpnFragment(getString(localizedResId));
                        break;
                    case "CONNECTRETRY":
                        onVpnDisconnectionInitiated();
                        loadVpnFragment(getString(R.string.network_lost));
                        break;
                    default:
                        showRatingDialog();
                        loadVpnFragment(null);
                        AnalyticsHelper.triggerOVPNDisconnectDone();
                        break;
                }
                SentinelLiteApp.isVpnInitiated = false;
                SentinelLiteApp.isVpnConnected = false;
                SentinelLiteApp.isVpnReconnectFailed = false;
            } else {
                if (aFragment != null && aFragment instanceof VpnConnectedFragment) {
                    runOnUiThread(() -> {
                        ((VpnConnectedFragment) aFragment).updateStatus(getString(localizedResId));
                    });
                }
            }

            if (state.equals("CONNECTED")) {
                AnalyticsHelper.triggerOVPNConnectDone();
            }

            if (SentinelLiteApp.isVpnReconnectFailed) {
                AppPreferences.getInstance().saveLong(AppConstants.PREFS_CONNECTION_START_TIME, 0L);
                onVpnDisconnectionInitiated();
                loadVpnFragment(getString(R.string.network_lost));
                SentinelLiteApp.isVpnInitiated = false;
                SentinelLiteApp.isVpnConnected = false;
                SentinelLiteApp.isVpnReconnectFailed = false;
            }

            // Called when user connects to a VPN node from other activity
            if (mHasActivityResult) {
                onVpnConnectionInitiated(AppPreferences.getInstance().getString(AppConstants.PREFS_CONFIG_PATH));
                mHasActivityResult = false;
            }
        });
    }

    @Override
    public void updateByteCount(long in, long out, long diffIn, long diffOut) {
        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        if (aFragment != null && aFragment instanceof VpnConnectedFragment) {
            String aDownloadSpeed = humanReadableByteCount(diffIn / OpenVPNManagement.mBytecountInterval, true, getResources());
            String aUploadSpeed = humanReadableByteCount(diffOut / OpenVPNManagement.mBytecountInterval, true, getResources());
            String aTotalData = humanReadableByteCount(in, false, getResources());
            runOnUiThread(() -> {
                ((VpnConnectedFragment) aFragment).updateByteCount(aDownloadSpeed, aUploadSpeed, aTotalData);
            });
        }
    }

    @Override
    public void setConnectedVPN(String uuid) {
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.ib_close_search:
                closeSearch();
                break;
            case R.id.ib_clear_search:
                mEtSearch.getText().clear();
                break;
            default:
                break;
        }
    }

    private void openSearch() {
        mLlSearch.setVisibility(View.VISIBLE);
        mEtSearch.setFocusable(true);
        mEtSearch.setFocusableInTouchMode(true);
        mEtSearch.requestFocus();
        showKeyboard(mEtSearch);
    }

    private void openSortDialog() {
        if (mSortDialogActionListener != null) {
            SortFilterByDialogFragment.newInstance(AppConstants.TAG_SORT_BY, getCurrentSortType(), toFilterByBookmark(), mSortDialogActionListener).show(getSupportFragmentManager(), AppConstants.SORT_BY_DIALOG_TAG);
        }
    }

    private void closeSearch() {
        hideKeyboard();
        mLlSearch.setVisibility(View.GONE);
        mEtSearch.getText().clear();
        mEtSearch.clearFocus();
        mCurrentSearchString.delete(0, mCurrentSearchString.length());
    }

    private void showKeyboard(View iView) {
        InputMethodManager aInputMethodManager = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        assert aInputMethodManager != null;
        aInputMethodManager.showSoftInput(iView, InputMethodManager.SHOW_FORCED);
    }

    private void hideKeyboard() {
        InputMethodManager aInputMethodManager = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        //Find the currently focused view, so we can grab the correct window token from it.
        View view = getCurrentFocus();
        //If no view currently has focus, create a new one, just so we can grab a window token from it
        if (view == null) {
            view = new View(this);
        }
        if (aInputMethodManager != null) {
            aInputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);
        }
    }

//    public boolean overrideDispatchEvent() {
//        return false;
//    }
//
//    @Override
//    public boolean dispatchTouchEvent(MotionEvent ev) {
//        if (getCurrentFocus() != null && ev.getAction() == MotionEvent.ACTION_UP && getCurrentFocus() instanceof AppCompatEditText) {
//            if (!overrideDispatchEvent()) {
//                InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
//                imm.hideSoftInputFromWindow(getCurrentFocus().getWindowToken(), 0);
//            }
//        }
//        return super.dispatchTouchEvent(ev);
//    }

}