package sentinelgroup.io.sentinel.ui.activity;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.SwitchCompat;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.widget.CompoundButton;
import android.widget.TextView;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.dialog.ProgressDialogFragment;
import sentinelgroup.io.sentinel.ui.dialog.SingleActionDialogFragment;
import sentinelgroup.io.sentinel.ui.fragment.SendFragment;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

public class SendActivity extends AppCompatActivity implements SendFragment.OnFragmentInteractionListener, CompoundButton.OnCheckedChangeListener {
    private Toolbar mToolbar;
    private SwitchCompat mSwitchNet;
    private TextView mToolbarTitle, mSwitchState;
    private ProgressDialogFragment mPrgDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_container);
        initView();
        loadFragment(SendFragment.newInstance());
    }

    @Override
    protected void onResume() {
        super.onResume();
        // setup testnet switch
        setupTestNetSwitch();
    }

    private void initView() {
        mToolbar = findViewById(R.id.toolbar);
        mToolbarTitle = mToolbar.findViewById(R.id.toolbar_title);
        mSwitchNet = findViewById(R.id.switch_net);
        mSwitchState = findViewById(R.id.switch_state);
        mPrgDialog = ProgressDialogFragment.newInstance(true);
        //setup toolbar
        setupToolbar();
        // set click listeners
        mSwitchNet.setOnCheckedChangeListener(this);
    }

    private void setupToolbar() {
        setSupportActionBar(mToolbar);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            getSupportActionBar().setDisplayShowTitleEnabled(false);
            getSupportActionBar().setHomeAsUpIndicator(R.drawable.ic_back);
            getSupportActionBar().setDisplayShowHomeEnabled(true);
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }

    private void setToolbarTitle(String iTitle) {
        mToolbarTitle.setText(iTitle);
    }

    private void showProgress() {
        mPrgDialog.show(getSupportFragmentManager(), "progress_dialog");
    }

    private void hideProgress() {
        if (mPrgDialog != null)
            mPrgDialog.dismiss();
    }

    private void showError(String iError) {
        SingleActionDialogFragment.newInstance(getString(R.string.please_note), iError, getString(android.R.string.ok))
                .show(getSupportFragmentManager(), "alert_dialog");
    }

    private void setupTestNetSwitch() {
        boolean isActive = AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE);
        mSwitchNet.setChecked(isActive);
        mSwitchState.setText(getString(R.string.test_net_state, getString(isActive ? R.string.active : R.string.deactive)));
    }

    private void loadFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, iFragment).commit();
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE, isChecked);
        mSwitchState.setText(getString(R.string.test_net_state, getString(isChecked ? R.string.active : R.string.deactive)));
        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        if (aFragment instanceof SendFragment) {
            ((SendFragment) aFragment).updateAdapterData(isChecked);
        }
    }

    @Override
    public void onFragmentLoaded(String iTitle) {
        setToolbarTitle(iTitle);
    }

    @Override
    public void onToggleProgressDialog(boolean isDialogShown) {
        if(isDialogShown)
            showProgress();
        else
            hideProgress();
    }

    @Override
    public void onShowErrorDialog(String iError) {
        showError(iError);
    }

    @Override
    public void onLoadNextActivity() {

    }
}
