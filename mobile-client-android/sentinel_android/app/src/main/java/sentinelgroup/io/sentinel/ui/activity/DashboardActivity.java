package sentinelgroup.io.sentinel.ui.activity;

import android.app.Dialog;
import android.content.ClipData;
import android.content.ClipboardManager;
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
import android.support.design.widget.NavigationView;
import android.support.v4.app.Fragment;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.AppCompatEditText;
import android.support.v7.widget.AppCompatImageButton;
import android.support.v7.widget.SwitchCompat;
import android.support.v7.widget.Toolbar;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.CompoundButton;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.util.HashMap;
import java.util.Map;

import de.blinkt.openvpn.LaunchVPN;
import de.blinkt.openvpn.VpnProfile;
import de.blinkt.openvpn.core.ConnectionStatus;
import de.blinkt.openvpn.core.IOpenVPNServiceInternal;
import de.blinkt.openvpn.core.OpenVPNManagement;
import de.blinkt.openvpn.core.OpenVPNService;
import de.blinkt.openvpn.core.ProfileManager;
import de.blinkt.openvpn.core.VpnStatus;
import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.SentinelApp;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.ui.custom.OnVpnConnectionListener;
import sentinelgroup.io.sentinel.ui.custom.ProfileAsync;
import sentinelgroup.io.sentinel.ui.custom.VpnListSearchListener;
import sentinelgroup.io.sentinel.ui.dialog.DoubleActionDialogFragment;
import sentinelgroup.io.sentinel.ui.dialog.ProgressDialogFragment;
import sentinelgroup.io.sentinel.ui.dialog.RatingDialogFragment;
import sentinelgroup.io.sentinel.ui.dialog.SingleActionDialogFragment;
import sentinelgroup.io.sentinel.ui.dialog.SortFilterByDialogFragment;
import sentinelgroup.io.sentinel.ui.fragment.VpnConnectedFragment;
import sentinelgroup.io.sentinel.ui.fragment.VpnSelectFragment;
import sentinelgroup.io.sentinel.ui.fragment.WalletFragment;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Logger;

import static de.blinkt.openvpn.core.OpenVPNService.humanReadableByteCount;
import static sentinelgroup.io.sentinel.util.AppConstants.DOUBLE_ACTION_DIALOG_TAG;
import static sentinelgroup.io.sentinel.util.AppConstants.PROGRESS_DIALOG_TAG;
import static sentinelgroup.io.sentinel.util.AppConstants.RATING_DIALOG_TAG;
import static sentinelgroup.io.sentinel.util.AppConstants.SINGLE_ACTION_DIALOG_TAG;

public class DashboardActivity extends AppCompatActivity implements CompoundButton.OnCheckedChangeListener,
        OnGenericFragmentInteractionListener, OnVpnConnectionListener, VpnStatus.StateListener, VpnStatus.ByteCountListener, DoubleActionDialogFragment.OnDialogActionListener, View.OnClickListener {

    private static final int VPN_SELECT_FRAGMENT = 0;
    private static final int WALLET_FRAGMENT = 1;

    private String mIntentExtra;
    private boolean mHasActivityResult;

    private DrawerLayout mDrawerLayout;
    private NavigationView mNavMenuView, mNavFooter;
    private Toolbar mToolbar;
    private SwitchCompat mSwitchNet;
    private TextView mSwitchState;
    private AppCompatImageButton mIbSearch, mIbSort, mIbCloseSearch, mIbClearSearch;
    private LinearLayout mLlSearch;
    private AppCompatEditText mEtSearch;
    private ProgressDialogFragment mPrgDialog;
    private MenuItem mMenuVpn, mMenuWallet;
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
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);
        shouldShowHelper();
        initView();
        loadVpnSelectFragment(null, "onCreate");
    }

    @Override
    protected void onResume() {
        super.onResume();
        // setup VPN listeners & services
        VpnStatus.addStateListener(this);
        VpnStatus.addByteCountListener(this);
        Intent intent = new Intent(this, OpenVPNService.class);
        intent.setAction(OpenVPNService.START_SERVICE);
        bindService(intent, mConnection, Context.BIND_AUTO_CREATE);
        // check intent and take necessary actions
        if (getIntent().getExtras() != null) {
            mIntentExtra = getIntent().getStringExtra(AppConstants.EXTRA_NOTIFICATION_ACTIVITY);
        }
        if (mIntentExtra != null && mIntentExtra.equals(AppConstants.HOME)) {
            loadVpnSelectFragment(null, "onResume hasIntentExtras");
        }
        // initialize/update the TESTNET switch
        setupTestNetSwitch();
        // check and toggle TESTNET switch state (if needed) when returning from other activity
        toggleTestNetSwitch(!(getCurrentFragment() instanceof VpnConnectedFragment));

        initListeners();
    }

    @Override
    protected void onPause() {
        super.onPause();
        unbindService(mConnection);
        VpnStatus.removeStateListener(this);
        VpnStatus.removeByteCountListener(this);
    }

    @Override
    public void onBackPressed() {
        if (mDrawerLayout != null && mDrawerLayout.isDrawerOpen(GravityCompat.START))
            mDrawerLayout.closeDrawers();
        else if (!TextUtils.isEmpty(mEtSearch.getText()))
            closeSearch();
        else
            super.onBackPressed();
    }

    private Fragment getCurrentFragment() {
        return getSupportFragmentManager().findFragmentById(R.id.fl_container);
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

    public void handleSortFilterIcon() {
        mIbSort.setImageResource((!getCurrentSortType().equals(AppConstants.SORT_BY_DEFAULT) || toFilterByBookmark()) ? R.drawable.ic_sorted : R.drawable.ic_sort);
    }

    /*
     *  Show the Helper screens when the user is opening the app for the first time
     */
    private void shouldShowHelper() {
        if (!AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_HELPER_SHOWN)) {
            onLoadNextActivity(new Intent(this, HelperActivity.class), AppConstants.REQ_HELPER_SCREENS);
        }
    }

    /*
     * Set the TESTNET switch state, switch text and the state text based on the TESTNET state
     * value stored in the shared preferences.
     */
    private void setupTestNetSwitch() {
        boolean isActive = AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE);
        mSwitchNet.setChecked(isActive);
        mSwitchState.setText(getString(R.string.test_net, getString(isActive ? R.string.on : R.string.off)));
    }

    /*
     * Instantiate all the views used in the XML and perform other instantiation steps (if needed)
     */
    private void initView() {
        mToolbar = findViewById(R.id.toolbar);
        mSwitchNet = findViewById(R.id.switch_net);
        mSwitchState = findViewById(R.id.tv_switch_state);
        mIbSearch = findViewById(R.id.ib_search);
        mIbSort = findViewById(R.id.ib_sort);
        mLlSearch = findViewById(R.id.ll_search);
        mEtSearch = findViewById(R.id.et_search);
        mIbCloseSearch = findViewById(R.id.ib_close_search);
        mIbClearSearch = findViewById(R.id.ib_clear_search);
        mDrawerLayout = findViewById(R.id.drawer_layout);
        mPrgDialog = ProgressDialogFragment.newInstance(true);
        mNavMenuView = findViewById(R.id.nav_menu_view);
        mNavFooter = findViewById(R.id.nav_footer_view);
        // set drawer scrim color
        mDrawerLayout.setScrimColor(Color.TRANSPARENT);
        // instantiate toolbar
        setupToolbar();
    }

    /**
     * Setup Listeners for all views
     */
    private void initListeners() {
        // add listeners
        mSwitchNet.setOnCheckedChangeListener(this);
        mIbSearch.setOnClickListener(this);
        mIbSort.setOnClickListener(this);
        mEtSearch.addTextChangedListener(mSearchWatcher);
        mIbCloseSearch.setOnClickListener(this);
        mIbClearSearch.setOnClickListener(this);
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
        mNavFooter.getHeaderView(0).findViewById(R.id.ib_telegram).setOnClickListener(v -> openUrl(getString(R.string.telegram_url)));
        mNavFooter.getHeaderView(0).findViewById(R.id.ib_medium).setOnClickListener(v -> openUrl(getString(R.string.medium_url)));
        mNavFooter.getHeaderView(0).findViewById(R.id.ib_twitter).setOnClickListener(v -> openUrl(getString(R.string.twitter_url)));
        mNavFooter.getHeaderView(0).findViewById(R.id.ib_website).setOnClickListener(v -> openUrl(getString(R.string.website_url)));
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
        mToolbar.findViewById(R.id.toolbar_icon).setVisibility(iTitle.equals(getString(R.string.app_name)) ? View.VISIBLE : View.GONE);
        ((TextView) mToolbar.findViewById(R.id.toolbar_title)).setText(iTitle);
    }

    /*
     * Handle click action on the Navigation items
     */
    private void handleNavigationItemClick(int itemItemId) {
        switch (itemItemId) {
            case R.id.nav_tx_history:
                startActivityForResult(new Intent(this, TxHistoryActivity.class), AppConstants.REQ_TX_HISTORY);
                break;
            case R.id.nav_vpn_history:
                startActivityForResult(new Intent(this, VpnHistoryActivity.class), AppConstants.REQ_VPN_HISTORY);
                break;
            case R.id.nav_reset_pin:
                startActivityForResult(new Intent(this, ResetPinActivity.class), AppConstants.REQ_RESET_PIN);
                break;
            case R.id.nav_language:
                startActivityForResult(new Intent(this, GenericListActivity.class).putExtra(AppConstants.EXTRA_REQ_CODE, AppConstants.REQ_LANGUAGE), AppConstants.REQ_LANGUAGE);
                break;
            case R.id.nav_share_app:
                startActivity(new Intent(this, ShareAppActivity.class));
                break;
            case R.id.nav_faq:
                openUrl(getString(R.string.link_coming_soon));
                break;
            case R.id.nav_logout:
                if (!SentinelApp.isVpnInitiated)
                    showDoubleActionDialog(AppConstants.TAG_LOGOUT, -1, getString(R.string.logout_desc), R.string.logout, android.R.string.cancel);
                else
                    showSingleActionError(AppConstants.VALUE_DEFAULT, getString(R.string.disconnect_vpn_to_logout), AppConstants.VALUE_DEFAULT);
        }
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
        RatingDialogFragment.newInstance().show(getSupportFragmentManager(), RATING_DIALOG_TAG);
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
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(PROGRESS_DIALOG_TAG);
        if (isShow) {
            if (aFragment == null) {
                if (!isHalfDim)
                    mPrgDialog.setNoDim();
                mPrgDialog.setLoadingMessage(iMessage);
                mPrgDialog.show(getSupportFragmentManager(), PROGRESS_DIALOG_TAG);
            } else {
                mPrgDialog.updateLoadingMessage(iMessage);
            }
        } else {
            if (aFragment != null)
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
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(SINGLE_ACTION_DIALOG_TAG);
        int aTitleId = iTitleId != -1 ? iTitleId : R.string.please_note;
        int aPositiveOptionText = iPositiveOptionId != -1 ? iPositiveOptionId : android.R.string.ok;
        if (aFragment == null)
            SingleActionDialogFragment.newInstance(aTitleId, iMessage, aPositiveOptionText)
                    .show(getSupportFragmentManager(), SINGLE_ACTION_DIALOG_TAG);
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
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(DOUBLE_ACTION_DIALOG_TAG);
        int aTitleId = iTitleId != -1 ? iTitleId : R.string.please_note;
        int aPositiveOptionId = iPositiveOptionId != -1 ? iPositiveOptionId : android.R.string.ok;
        int aNegativeOptionId = iNegativeOptionId != -1 ? iNegativeOptionId : android.R.string.cancel;
        if (aFragment == null)
            DoubleActionDialogFragment.newInstance(iTag, aTitleId, iMessage, aPositiveOptionId, aNegativeOptionId)
                    .show(getSupportFragmentManager(), DOUBLE_ACTION_DIALOG_TAG);
    }

    /**
     * Replace the existing fragment in the container with the new fragment passed in this method's
     * parameters
     *
     * @param iFragment [Fragment] The fragment which needs to be displayed
     */
    private void loadFragment(Fragment iFragment) {
        toggleTestNetSwitch(!(iFragment instanceof VpnConnectedFragment));
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, iFragment).commit();
        if (iFragment instanceof VpnSelectFragment) {
            mIbSearch.setVisibility(View.VISIBLE);
            mIbSort.setVisibility(View.VISIBLE);
        } else {
            mIbSearch.setVisibility(View.GONE);
            mIbSort.setVisibility(View.GONE);
            mLlSearch.setVisibility(View.GONE);
        }
    }

    /*
     * Replaces the existing fragment in the container with VpnSelectFragment
     */
    private void loadVpnSelectFragment(String iMessage, String iLocation) {
        if (!mFragmentMap.containsKey(VPN_SELECT_FRAGMENT)) {
            mFragmentMap.put(VPN_SELECT_FRAGMENT, VpnSelectFragment.newInstance(iMessage));
        }
        loadFragment(mFragmentMap.get(VPN_SELECT_FRAGMENT));
        Logger.logInfo("loadVpnSelectFragment", iLocation);
    }

    /*
     * Replaces the existing fragment in the container with WalletFragment
     */
    private void loadWalletFragment() {
        if (!mFragmentMap.containsKey(WALLET_FRAGMENT)) {
            mFragmentMap.put(WALLET_FRAGMENT, WalletFragment.newInstance());
        }
        loadFragment(mFragmentMap.get(WALLET_FRAGMENT));
    }

    /*
     * Toggles the state of the TESTNET switch
     */
    private void toggleTestNetSwitch(boolean isEnabled) {
        mSwitchNet.setEnabled(isEnabled);
        if (!isEnabled) {
            mSwitchNet.setChecked(true);
            AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE, true);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_dashboard, menu);
        mMenuVpn = menu.findItem(R.id.action_vpn);
        mMenuWallet = menu.findItem(R.id.action_wallet);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                mDrawerLayout.openDrawer(GravityCompat.START);
                return true;

            case R.id.action_vpn:
                if ((getCurrentFragment() instanceof WalletFragment)) {
                    toggleItemState(item.getItemId());
                    loadVpnSelectFragment(null, "onOptionsItemSelected action_vpn");
                }
                return true;

            case R.id.action_wallet:
                if (!(getCurrentFragment() instanceof WalletFragment)) {
                    toggleItemState(item.getItemId());
                    loadWalletFragment();
                    closeSearch();
                }
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    /*
     * Update the Options Menu icon when a menu is clicked
     */
    private void toggleItemState(int iItemId) {
        mMenuVpn.setIcon(iItemId == R.id.action_vpn ? R.drawable.menu_vpn_selected : R.drawable.menu_vpn_unselected);
        mMenuWallet.setIcon(iItemId == R.id.action_wallet ? R.drawable.menu_wallet_selected : R.drawable.menu_wallet_unselected);
    }

    /**
     * Copies the string to the clipboard and shows a Toast on completing it
     *
     * @param iCopyString  [String] The text which needs to be copied to the clipboard
     * @param iToastTextId [int] The resource id of the toast message.
     */
    private void copyToClipboard(String iCopyString, int iToastTextId) {
        ClipboardManager clipboard = (ClipboardManager) this.getSystemService(CLIPBOARD_SERVICE);
        if (clipboard != null) {
            ClipData clip = ClipData.newPlainText(getString(R.string.app_name), iCopyString);
            Toast.makeText(this, iToastTextId, Toast.LENGTH_SHORT).show();
            clipboard.setPrimaryClip(clip);
        }
    }

    /*
     * Load the VPN profile to which connection is to be established, observe it's load state and
     * perform the necessary action
     */
    private void setupProfile(String iPath) {
        if (!SentinelApp.isVpnConnected) {
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
            SentinelApp.isVpnConnected = false;
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
            case AppConstants.REQ_VPN_HISTORY:
                if (resultCode == RESULT_OK) {
                    if (!(getCurrentFragment() instanceof WalletFragment))
                        loadVpnSelectFragment(null, "onActivityResult REQ_VPN_HISTORY");
                }
                break;
            case AppConstants.REQ_RESET_PIN:
                if (resultCode == RESULT_OK) {
                    Toast.makeText(this, R.string.reset_pin_success, Toast.LENGTH_SHORT).show();
                }
                break;
            case AppConstants.REQ_VPN_CONNECT:
                if (resultCode == RESULT_OK) {
                    mHasActivityResult = true;
                }
                break;
            case AppConstants.REQ_VPN_PAY:
                if (resultCode == RESULT_OK) {
                    loadVpnSelectFragment(null, "onActivityResult REQ_VPN_PAY");
                }
                break;
            case AppConstants.REQ_VPN_INIT_PAY:
                if (resultCode == RESULT_OK) {
                    showSingleActionError(AppConstants.VALUE_DEFAULT, getString(R.string.init_vpn_pay_success_message), AppConstants.VALUE_DEFAULT);
                }
                break;
            case AppConstants.REQ_HELPER_SCREENS:
                if (resultCode == RESULT_OK) {
                    AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_HELPER_SHOWN, true);
                }
                break;
            case AppConstants.REQ_LANGUAGE:
                if (resultCode == RESULT_OK) {
                    refreshMenuTitles();
                    if (!(getCurrentFragment() instanceof WalletFragment))
                        loadVpnSelectFragment(null, "onActivityResult REQ_LANGUAGE");
                    else
                        loadWalletFragment();
                }
                break;
        }
    }

    /*
     * Refresh the navigation menu titles after a new language is set
     */
    private void refreshMenuTitles() {
        Menu aMenu = mNavMenuView.getMenu();
        MenuItem aMenuTxHistory = aMenu.findItem(R.id.nav_tx_history);
        aMenuTxHistory.setTitle(R.string.transaction_history);
        MenuItem aMenuVpnHistory = aMenu.findItem(R.id.nav_vpn_history);
        aMenuVpnHistory.setTitle(R.string.vpn_history);
        MenuItem aMenuResetPin = aMenu.findItem(R.id.nav_reset_pin);
        aMenuResetPin.setTitle(R.string.reset_pin);
        MenuItem aMenuLanguage = aMenu.findItem(R.id.nav_language);
        aMenuLanguage.setTitle(R.string.language);
        MenuItem aMenuReferral = aMenu.findItem(R.id.nav_share_app);
        aMenuReferral.setTitle(R.string.share_app);
        MenuItem aMenuSocialLinks = aMenu.findItem(R.id.nav_faq);
        aMenuSocialLinks.setTitle(R.string.faq);
        MenuItem aMenuLogout = aMenu.findItem(R.id.nav_logout);
        aMenuLogout.setTitle(R.string.logout);
    }

    /*
     * Logout user by clearing all the values in shared preferences and reloading the
     * LauncherActivity
     */
    private void logoutUser() {
        AppPreferences.getInstance().clearSavedData(this);
        AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_CLEAR_DB, true);
        startActivity(new Intent(this, LauncherActivity.class));
        finish();
    }

    // Listener implementations
    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE, isChecked);
        mSwitchState.setText(getString(R.string.test_net, getString(isChecked ? R.string.on : R.string.off)));

        Fragment aFragment = getCurrentFragment();
        if (aFragment instanceof WalletFragment) {
            ((WalletFragment) aFragment).updateBalance();
        } else if (!(aFragment instanceof VpnConnectedFragment))
            loadVpnSelectFragment(null, "onCheckedChanged");
    }


    @Override
    public void onFragmentLoaded(String iTitle) {
        setToolbarTitle(iTitle);
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
    public void onCopyToClipboardClicked(String iCopyString, int iToastTextId) {
        copyToClipboard(iCopyString, iToastTextId);
    }

    @Override
    public void onLoadNextFragment(Fragment iNextFragment) {
        loadFragment(iNextFragment);
    }

    @Override
    public void onLoadNextActivity(Intent iIntent, int iReqCode) {
        if (iIntent != null)
            if (iReqCode != AppConstants.REQ_CODE_NULL)
                startActivityForResult(iIntent, iReqCode);
            else
                startActivity(iIntent);
    }

    @Override
    public void onVpnConnectionInitiated(String iVpnConfigFilePath) {
        loadFragment(VpnConnectedFragment.newInstance());
        setupProfile(iVpnConfigFilePath);
    }

    @Override
    public void onVpnDisconnectionInitiated() {
        SentinelApp.isVpnConnected = true;
        stopVPNConnection();
    }

    @Override
    public void onActionButtonClicked(String iTag, Dialog iDialog, boolean isPositiveButton) {
        Fragment aFragment = getCurrentFragment();
        if (isPositiveButton && iTag.equals(AppConstants.TAG_LOGOUT)) {
            logoutUser();
            iDialog.dismiss();
        } else if (aFragment instanceof VpnSelectFragment) {
            ((VpnSelectFragment) aFragment).onActionButtonClicked(iTag, iDialog, isPositiveButton);
        }
    }

    @Override
    public void updateState(String state, String logMessage, int localizedResId, ConnectionStatus level) {
        Logger.logError("VPN_STATE", state + " - " + logMessage + " : " + getString(localizedResId), null);
        runOnUiThread(() -> {
            Fragment aFragment = getCurrentFragment();
            // Called when the VPN connection terminates
            if (state.equals("USER_VPN_PERMISSION_CANCELLED")
                    || state.equals("CONNECTRETRY")
                    || (state.equals("NOPROCESS") && SentinelApp.isVpnConnected)) {
                AppPreferences.getInstance().saveLong(AppConstants.PREFS_CONNECTION_START_TIME, 0L);
                if (!(aFragment instanceof WalletFragment)) {
                    switch (state) {
                        case "USER_VPN_PERMISSION_CANCELLED":
                            loadVpnSelectFragment(getString(localizedResId), "updateState USER_VPN_PERMISSION_CANCELLED");
                            break;
                        case "CONNECTRETRY":
                            loadVpnSelectFragment(getString(R.string.network_lost), "updateState CONNECTRETRY");
                            break;
                        default:
                            showRatingDialog();
                            loadVpnSelectFragment(null, "updateState default");
                            break;
                    }
                }
                SentinelApp.isVpnInitiated = false;
                SentinelApp.isVpnConnected = false;
                SentinelApp.isVpnReconnectFailed = false;
            } else {
                if (aFragment != null && aFragment instanceof VpnConnectedFragment) {
                    runOnUiThread(() -> {
                        ((VpnConnectedFragment) aFragment).updateStatus(getString(localizedResId));
                    });
                }
            }

            // Called when user connects to a VPN node from other activity
            if (mHasActivityResult) {
                onVpnConnectionInitiated(AppPreferences.getInstance().getString(AppConstants.PREFS_CONFIG_PATH));
                mHasActivityResult = false;
            }
        });
    }

    @Override
    public void setConnectedVPN(String uuid) {
    }

    @Override
    public void updateByteCount(long in, long out, long diffIn, long diffOut) {
        Fragment aFragment = getCurrentFragment();
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
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.ib_search:
                openSearch();
                break;
            case R.id.ib_sort:
                openSortDialog();
                break;
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
        mLlSearch.setVisibility(View.GONE);
        mEtSearch.getText().clear();
        mEtSearch.clearFocus();
        mCurrentSearchString.delete(0, mCurrentSearchString.length());
        hideKeyboard();
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
}