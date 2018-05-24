package sentinelgroup.io.sentinel.ui.activity;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
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

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.dialog.SingleActionDialogFragment;
import sentinelgroup.io.sentinel.ui.fragment.WalletFragment;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

public class DashboardActivity extends AppCompatActivity implements CompoundButton.OnCheckedChangeListener, WalletFragment.OnFragmentInteractionListener {

    private DrawerLayout mDrawerLayout;
    private Toolbar mToolbar;
    private SwitchCompat mSwitchNet;
    private TextView mSwitchState;
    private MenuItem mMenuVpn, mMenuWallet;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);
        initView();
        loadWalletFragment();
    }

    @Override
    protected void onResume() {
        super.onResume();
        // setup testnet switch
        setupTestNetSwitch();
    }

    private void initView() {
        mToolbar = findViewById(R.id.toolbar);
        mSwitchNet = findViewById(R.id.switch_net);
        mSwitchState = findViewById(R.id.switch_state);
        mDrawerLayout = findViewById(R.id.drawer_layout);
        NavigationView aNavView = findViewById(R.id.navigation_view);
        //setup toolbar
        setupToolbar();
        // set drawer scrim color
        mDrawerLayout.setScrimColor(Color.TRANSPARENT);
        // set click listeners
        mSwitchNet.setOnCheckedChangeListener(this);
        aNavView.getHeaderView(0).findViewById(R.id.ib_back).setOnClickListener(v -> mDrawerLayout.closeDrawers());
        aNavView.setNavigationItemSelectedListener(
                new NavigationView.OnNavigationItemSelectedListener() {
                    @Override
                    public boolean onNavigationItemSelected(MenuItem menuItem) {
                        // set item as selected to persist highlight
                        menuItem.setChecked(true);
                        // handle item click
                        handleNavigationItemClick(menuItem.getItemId());
                        // close drawer when item is tapped
                        mDrawerLayout.closeDrawers();
                        return true;
                    }
                });
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

    private void setupTestNetSwitch() {
        boolean isActive = AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE);
        mSwitchNet.setChecked(isActive);
        mSwitchState.setText(getString(R.string.test_net_state, getString(isActive ? R.string.active : R.string.deactive)));
    }

    private void handleNavigationItemClick(int itemItemId) {
        switch (itemItemId) {
            case R.id.nav_tx_history:
                break;
            case R.id.nav_vpn_history:
                break;
            case R.id.nav_nw_stats:
                break;
            case R.id.nav_usage_stats:
                break;
            case R.id.nav_reset_pin:
                startActivityForResult(new Intent(this, ResetPinActivity.class), AppConstants.REQ_RESET_PIN);
                break;
            case R.id.nav_help:
                break;
            case R.id.nav_about:
                break;
        }
    }

    private void loadFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, iFragment).commit();
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
        toggleItemState(item);
        switch (item.getItemId()) {
            case android.R.id.home:
                mDrawerLayout.openDrawer(GravityCompat.START);
                return true;

            case R.id.action_vpn:
                loadVpnFragment();
                return true;

            case R.id.action_wallet:
                loadWalletFragment();
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    private void toggleItemState(MenuItem item) {
        if (item.getItemId() == R.id.action_vpn) {
            mMenuVpn.setIcon(R.drawable.menu_vpn_selected);
            mMenuWallet.setIcon(R.drawable.shape_wallet_unselected);
        } else if (item.getItemId() == R.id.action_wallet) {
            mMenuVpn.setIcon(R.drawable.shape_vpn_unselected);
            mMenuWallet.setIcon(R.drawable.menu_wallet_selected);
        }
    }

    private void loadVpnFragment() {
        // set
    }

    private void loadWalletFragment() {
        loadFragment(WalletFragment.newInstance());
    }

    private void copyAddressToClipboard(String iAccountAddress) {
        ClipboardManager clipboard = (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
        if (clipboard != null) {
            ClipData clip = ClipData.newPlainText(getString(R.string.app_name), iAccountAddress);
            Toast.makeText(this, R.string.address_copied, Toast.LENGTH_SHORT).show();
            clipboard.setPrimaryClip(clip);
        }
    }

    private void showError(String iTitle, String iMessage, String iButtonLabel) {
        iTitle = iTitle == null ? getString(R.string.please_note) : iTitle;
        iButtonLabel = iButtonLabel == null ? getString(R.string.ok) : iButtonLabel;
        SingleActionDialogFragment.newInstance(iTitle, iMessage, iButtonLabel)
                .show(getSupportFragmentManager(), "alert_dialog");
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
            ((WalletFragment) aFragment).updateBalance();
        }
    }

    @Override
    public void onCopyAddressClicked(String iAccountAddress) {
        copyAddressToClipboard(iAccountAddress);
    }

    @Override
    public void onShowRequestSuccessDialog(String iMessage) {
        showError(getString(R.string.yay), iMessage, getString(R.string.thanks));
    }

    @Override
    public void onSendClicked() {
        startActivity(new Intent(this, SendActivity.class));
    }

    @Override
    public void onReceiveClicked() {
        startActivity(new Intent(this,ReceiveActivity.class));
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case AppConstants.REQ_RESET_PIN:
                if (resultCode == RESULT_OK) {
                    Toast.makeText(this, R.string.reset_pin_success, Toast.LENGTH_SHORT).show();
                }
                break;
        }
    }
}