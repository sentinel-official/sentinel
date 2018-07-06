package sentinelgroup.io.sentinel.ui.activity;

import android.app.Dialog;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.graphics.Color;
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
import android.support.v7.widget.SwitchCompat;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.CompoundButton;
import android.widget.TextView;
import android.widget.Toast;

import de.blinkt.openvpn.LaunchVPN;
import de.blinkt.openvpn.VpnProfile;
import de.blinkt.openvpn.core.ConnectionStatus;
import de.blinkt.openvpn.core.IOpenVPNServiceInternal;
import de.blinkt.openvpn.core.OpenVPNService;
import de.blinkt.openvpn.core.ProfileManager;
import de.blinkt.openvpn.core.VpnStatus;
import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.SentinelApp;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.ui.custom.OnVpnConnectionListener;
import sentinelgroup.io.sentinel.ui.custom.ProfileAsync;
import sentinelgroup.io.sentinel.ui.dialog.DoubleActionDialogFragment;
import sentinelgroup.io.sentinel.ui.dialog.ProgressDialogFragment;
import sentinelgroup.io.sentinel.ui.dialog.SingleActionDialogFragment;
import sentinelgroup.io.sentinel.ui.fragment.VpnConnectedFragment;
import sentinelgroup.io.sentinel.ui.fragment.VpnSelectFragment;
import sentinelgroup.io.sentinel.ui.fragment.WalletFragment;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Logger;

import static sentinelgroup.io.sentinel.util.AppConstants.DOUBLE_ACTION_DIALOG_TAG;
import static sentinelgroup.io.sentinel.util.AppConstants.PROGRESS_DIALOG_TAG;
import static sentinelgroup.io.sentinel.util.AppConstants.SINGLE_ACTION_DIALOG_TAG;

public class DashboardActivity extends AppCompatActivity implements CompoundButton.OnCheckedChangeListener,
        OnGenericFragmentInteractionListener, OnVpnConnectionListener, VpnStatus.StateListener, DoubleActionDialogFragment.OnDialogActionListener {

    private String mIntentExtra;
    private boolean mHasActivityResult;

    private DrawerLayout mDrawerLayout;
    private Toolbar mToolbar;
    private SwitchCompat mSwitchNet;
    private TextView mSwitchState;
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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);
        shouldShowHelper();
        initView();
        loadVpnFragment(null);
    }

    private void shouldShowHelper() {
        if (!AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_HELPER_SHOWN)) {
            onLoadNextActivity(new Intent(this, HelperActivity.class), AppConstants.REQ_HELPER_SCREENS);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        // setup VPN listeners & services
        VpnStatus.addStateListener(this);
        Intent intent = new Intent(this, OpenVPNService.class);
        intent.setAction(OpenVPNService.START_SERVICE);
        bindService(intent, mConnection, Context.BIND_AUTO_CREATE);
        // check intent
        if (getIntent().getExtras() != null) {
            mIntentExtra = getIntent().getStringExtra(AppConstants.EXTRA_NOTIFICATION_ACTIVITY);
        }
        if (mIntentExtra != null && mIntentExtra.equals(AppConstants.HOME)) {
            loadVpnFragment(null);
        }
        // setup testnet switch
        setupTestNetSwitch();
        // toggle switch state when returning from other activity
        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        toggleTestNetSwitch(!(aFragment instanceof VpnConnectedFragment));
    }

    private void setupTestNetSwitch() {
        boolean isActive = AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE);
        mSwitchNet.setChecked(isActive);
        mSwitchState.setText(getString(R.string.test_net_state, getString(isActive ? R.string.active : R.string.deactive)));
    }

    @Override
    protected void onPause() {
        super.onPause();
        unbindService(mConnection);
    }

    private void initView() {
        mToolbar = findViewById(R.id.toolbar);
        mSwitchNet = findViewById(R.id.switch_net);
        mSwitchState = findViewById(R.id.switch_state);
        mDrawerLayout = findViewById(R.id.drawer_layout);
        mPrgDialog = ProgressDialogFragment.newInstance(true);
        NavigationView aNavView = findViewById(R.id.navigation_view);
        //setup toolbar
        setupToolbar();
        // set drawer scrim color
        mDrawerLayout.setScrimColor(Color.TRANSPARENT);
        // set click listeners
        mSwitchNet.setOnCheckedChangeListener(this);
        aNavView.getHeaderView(0).findViewById(R.id.ib_back).setOnClickListener(v -> mDrawerLayout.closeDrawers());
        aNavView.setNavigationItemSelectedListener(
                menuItem -> {
                    // set item as selected to persist highlight
                    menuItem.setChecked(true);
                    // handle item click
                    handleNavigationItemClick(menuItem.getItemId());
                    // close drawer when item is tapped
                    mDrawerLayout.closeDrawers();
                    return true;
                });
    }

    @Override
    protected void onStop() {
        VpnStatus.removeStateListener(this);
        super.onStop();
    }

    private void setupToolbar() {
        setSupportActionBar(mToolbar);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayShowTitleEnabled(false);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setHomeAsUpIndicator(R.drawable.ic_hamburger_menu);
        }
    }

    private void handleNavigationItemClick(int itemItemId) {
        switch (itemItemId) {
            case R.id.nav_tx_history:
                startActivityForResult(new Intent(this, TxHistoryActivity.class), AppConstants.REQ_TX_HISTORY);
                break;
            case R.id.nav_vpn_history:
                startActivityForResult(new Intent(this, VpnHistoryActivity.class), AppConstants.REQ_VPN_HISTORY);
                break;
//            case R.id.nav_nw_stats:
//                break;
//            case R.id.nav_usage_stats:
//                break;
            case R.id.nav_reset_pin:
                startActivityForResult(new Intent(this, ResetPinActivity.class), AppConstants.REQ_RESET_PIN);
                break;
            case R.id.nav_help:
                startActivityForResult(new Intent(this, GenericListActivity.class).putExtra(AppConstants.EXTRA_REQ_CODE, AppConstants.REQ_HELP), AppConstants.REQ_CODE_NULL);
                break;
            case R.id.nav_social_links:
                startActivityForResult(new Intent(this, GenericListActivity.class).putExtra(AppConstants.EXTRA_REQ_CODE, AppConstants.REQ_SOCIAL_LINKS), AppConstants.REQ_CODE_NULL);
                break;
            case R.id.nav_logout:
                showDoubleActionDialog(AppConstants.TAG, -1, getString(R.string.logout_desc), R.string.logout, android.R.string.cancel);
        }
    }

    private void showProgressDialog(boolean isHalfDim, String iMessage) {
        toggleProgressDialogState(true, isHalfDim, iMessage == null ? getString(R.string.generic_loading_message) : iMessage);
    }

    private void hideProgressDialog() {
        toggleProgressDialogState(false, false, null);
    }

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
                mPrgDialog.dismiss();
        }
    }

    protected void showSingleActionError(String iMessage) {
        showSingleActionError(-1, iMessage, -1);
    }

    protected void showSingleActionError(int iTitleId, String iMessage, int iPositiveOptionId) {
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(SINGLE_ACTION_DIALOG_TAG);
        int aTitleId = iTitleId != -1 ? iTitleId : R.string.please_note;
        int aPositiveOptionText = iPositiveOptionId != -1 ? iPositiveOptionId : android.R.string.ok;
        if (aFragment == null)
            SingleActionDialogFragment.newInstance(aTitleId, iMessage, aPositiveOptionText)
                    .show(getSupportFragmentManager(), SINGLE_ACTION_DIALOG_TAG);
    }

    protected void showDoubleActionDialog(String iTag, String iMessage) {
        showDoubleActionDialog(iTag, -1, iMessage, -1, -1);
    }

    protected void showDoubleActionDialog(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId) {
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(DOUBLE_ACTION_DIALOG_TAG);
        int aTitleId = iTitleId != -1 ? iTitleId : R.string.please_note;
        int aPositiveOptionId = iPositiveOptionId != -1 ? iPositiveOptionId : android.R.string.ok;
        int aNegativeOptionId = iNegativeOptionId != -1 ? iNegativeOptionId : android.R.string.cancel;
        if (aFragment == null)
            DoubleActionDialogFragment.newInstance(iTag, aTitleId, iMessage, aPositiveOptionId, aNegativeOptionId)
                    .show(getSupportFragmentManager(), DOUBLE_ACTION_DIALOG_TAG);
    }


    private void loadFragment(Fragment iFragment) {
        toggleTestNetSwitch(!(iFragment instanceof VpnConnectedFragment));
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, iFragment).commit();
    }

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
        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        toggleItemState(item.getItemId());
        switch (item.getItemId()) {
            case android.R.id.home:
                mDrawerLayout.openDrawer(GravityCompat.START);
                return true;

            case R.id.action_vpn:
                if ((aFragment instanceof WalletFragment))
                    loadVpnFragment(null);
                return true;

            case R.id.action_wallet:
                if (!(aFragment instanceof WalletFragment))
                    loadWalletFragment();
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    private void toggleItemState(int iItemId) {
        if (iItemId == R.id.action_vpn) {
            mMenuVpn.setIcon(R.drawable.menu_vpn_selected);
            mMenuWallet.setIcon(R.drawable.menu_wallet_unselected);
        } else if (iItemId == R.id.action_wallet) {
            mMenuVpn.setIcon(R.drawable.menu_vpn_unselected);
            mMenuWallet.setIcon(R.drawable.menu_wallet_selected);
        }
    }

    private void copyToClipboard(String iCopyString, int iToastTextId) {
        ClipboardManager clipboard = (ClipboardManager) this.getSystemService(CLIPBOARD_SERVICE);
        if (clipboard != null) {
            ClipData clip = ClipData.newPlainText(getString(R.string.app_name), iCopyString);
            Toast.makeText(this, iToastTextId, Toast.LENGTH_SHORT).show();
            clipboard.setPrimaryClip(clip);
        }
    }

    private void loadVpnFragment(String iMessage) {
        loadFragment(VpnSelectFragment.newInstance(iMessage));
    }

    private void loadWalletFragment() {
        loadFragment(WalletFragment.newInstance());
    }

    void setupProfile(String iPath) {
        if (!SentinelApp.isStart) {
            profileAsync = new ProfileAsync(this, iPath, new ProfileAsync.OnProfileLoadListener() {
                @Override
                public void onProfileLoadSuccess() {
                    startVPN();
                }

                @Override
                public void onProfileLoadFailed(String msg) {
                    Toast.makeText(DashboardActivity.this, "Init Fail" + msg, Toast.LENGTH_SHORT).show();
                }
            });
            profileAsync.execute();
        }
    }

    private void startVPN() {
        try {
            ProfileManager pm = ProfileManager.getInstance(this);
            VpnProfile profile = pm.getProfileByName(Build.MODEL);//
            startVPNConnection(profile);
        } catch (Exception ex) {
            SentinelApp.isStart = false;
        }
    }

    private void startVPNConnection(VpnProfile profile) {
        Intent intent = new Intent(getApplicationContext(), LaunchVPN.class);
        intent.putExtra(LaunchVPN.EXTRA_KEY, profile.getUUID().toString());
        intent.setAction(Intent.ACTION_MAIN);
        startActivity(intent);
    }

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
    public void onBackPressed() {
        if (mDrawerLayout != null && mDrawerLayout.isDrawerOpen(GravityCompat.START))
            mDrawerLayout.closeDrawers();
        else
            super.onBackPressed();
    }

    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE, isChecked);
        mSwitchState.setText(getString(R.string.test_net_state, getString(isChecked ? R.string.active : R.string.deactive)));

        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        if (aFragment instanceof WalletFragment) {
            ((WalletFragment) aFragment).updateBalance(isChecked);
        } else if (!(aFragment instanceof VpnConnectedFragment))
            loadVpnFragment(null);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        switch (requestCode) {
            case AppConstants.REQ_VPN_HISTORY:
                if (resultCode == RESULT_OK) {
                    if (!(aFragment instanceof WalletFragment))
                        loadVpnFragment(null);
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
                    loadVpnFragment(null);
                }
                break;
            case AppConstants.REQ_VPN_INIT_PAY:
                if (resultCode == RESULT_OK) {
                    showSingleActionError(getString(R.string.init_vpn_pay_success_message));
                }
                break;
            case AppConstants.REQ_HELPER_SCREENS:
                if (resultCode == RESULT_OK) {
                    AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_HELPER_SHOWN, true);
                }
        }
    }

    @Override
    public void onFragmentLoaded(String iTitle) {
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
    public void onShowSingleActionDialog(String iMessage) {
        if (iMessage.equals(getString(R.string.free_token_requested)))
            showSingleActionError(R.string.yay, iMessage, R.string.thanks);
        else
            showSingleActionError(iMessage);
    }

    @Override
    public void onShowDoubleActionDialog(String iMessage, int iPositiveOptionId, int iNegativeOptionId) {
        showDoubleActionDialog(AppConstants.TAG_INIT_PAY, R.string.init_vpn_pay_title, iMessage, iPositiveOptionId, iNegativeOptionId);
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
        SentinelApp.isStart = true;
        stopVPNConnection();
    }

    @Override
    public void onActionButtonClicked(String iTag, Dialog iDialog, boolean isPositiveButton) {
        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        if (isPositiveButton) {
            if (iTag.equals(AppConstants.TAG_INIT_PAY) && aFragment instanceof VpnSelectFragment)
                ((VpnSelectFragment) aFragment).makeInitPayment();
            else if (iTag.equals(AppConstants.TAG_LOGOUT))
                logoutUser();
        }
        iDialog.dismiss();
    }

    private void logoutUser() {
        AppPreferences.getInstance().clearSavedData(this);
        startActivity(new Intent(this, LauncherActivity.class));
        finish();
    }

    @Override
    public void updateState(String state, String logMessage, int localizedResId, ConnectionStatus level) {
        Logger.logError("VPN_STATE", state + " - " + logMessage + " : " + getString(localizedResId), null);
        runOnUiThread(() -> {
            Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);

            if (state.equals("CONNECTED")) {
                SentinelApp.isStart = true;
            }

            if (state.equals("USER_VPN_PERMISSION")) {
                SentinelApp.isStart = true;
            }

            if (state.equals("NOPROCESS") || state.equals("USER_VPN_PERMISSION_CANCELLED")) {
                AppPreferences.getInstance().saveString(AppConstants.PREFS_SESSION_NAME, "");
                if (!(aFragment instanceof WalletFragment) && !mHasActivityResult && SentinelApp.isStart) {
                    loadVpnFragment(state.equals("NOPROCESS") ? null : getString(localizedResId));
                }
                SentinelApp.isStart = false;
            }

            if (mHasActivityResult) {
                onVpnConnectionInitiated(AppPreferences.getInstance().getString(AppConstants.PREFS_CONFIG_PATH));
                mHasActivityResult = false;
            }
        });
    }

    @Override
    public void setConnectedVPN(String uuid) {
    }
}