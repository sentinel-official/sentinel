package sentinelgroup.io.sentinel.ui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.widget.TextView;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.dialog.ProgressDialogFragment;
import sentinelgroup.io.sentinel.ui.dialog.SingleActionDialogFragment;
import sentinelgroup.io.sentinel.ui.fragment.CreateAuidFragment;
import sentinelgroup.io.sentinel.ui.fragment.SecureKeysFragment;
import sentinelgroup.io.sentinel.ui.fragment.SetPinFragment;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

public class CreateAccountActivity extends AppCompatActivity implements CreateAuidFragment.OnFragmentInteractionListener {

    private Toolbar mToolbar;
    private TextView mToolbarTitle;
    private ProgressDialogFragment mPrgDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_container_simple);
        initView();
        checkUserLoginState();
    }

    private void initView() {
        mToolbar = findViewById(R.id.toolbar);
        mToolbarTitle = mToolbar.findViewById(R.id.toolbar_title);
        mPrgDialog = ProgressDialogFragment.newInstance(true);
        setupToolbar();
    }

    private void setupToolbar() {
        setSupportActionBar(mToolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayShowTitleEnabled(false);
            getSupportActionBar().setHomeAsUpIndicator(R.drawable.ic_back);
            getSupportActionBar().setDisplayShowHomeEnabled(true);
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }

    private void setToolbarTitle(String iTitle) {
        mToolbarTitle.setText(iTitle);
    }

    private void checkUserLoginState() {
        String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        if (aAccountAddress.isEmpty()) {
            // User logging in for the first time
            loadFragment(CreateAuidFragment.newInstance());
        } else {
            // User has already used the app
            if (AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_APP_PIN_SET)) {
                startActivity(new Intent(this, VerifyPinActivity.class));
                finish();
            } else {
                loadFragment(SetPinFragment.newInstance(aAccountAddress));
            }
        }
    }

    private void loadFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, iFragment).commit();
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

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed() {
        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        if (aFragment instanceof CreateAuidFragment) {
            startActivity(new Intent(this, LauncherActivity.class));
            finish();
        }
    }

    @Override
    public void onFragmentLoaded(String iTitle) {
        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        if (aFragment instanceof SecureKeysFragment || aFragment instanceof SetPinFragment) {
            if (getSupportActionBar() != null) {
                getSupportActionBar().setDisplayShowTitleEnabled(false);
                getSupportActionBar().setDisplayShowHomeEnabled(false);
                getSupportActionBar().setDisplayHomeAsUpEnabled(false);
            }
        }
        setToolbarTitle(iTitle);
    }

    @Override
    public void onToggleProgressDialog(boolean isDialogShown) {
        if (isDialogShown)
            showProgress();
        else
            hideProgress();
    }

    @Override
    public void onShowErrorDialog(String iError) {
        showError(iError);
    }

    @Override
    public void onLoadNextFragment(Fragment iNextFragment) {
        loadFragment(iNextFragment);
    }

    @Override
    public void onLoadNextActivity() {
        startActivity(new Intent(this, DashboardActivity.class));
        finish();
    }
}