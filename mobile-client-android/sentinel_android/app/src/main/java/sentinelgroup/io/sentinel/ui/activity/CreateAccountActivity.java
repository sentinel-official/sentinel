package sentinelgroup.io.sentinel.ui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.MenuItem;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.fragment.CreateAuidFragment;
import sentinelgroup.io.sentinel.ui.fragment.SetPinFragment;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

public class CreateAccountActivity extends SimpleBaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        checkUserLoginState();
    }

    @Override
    public void loadFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, iFragment).commit();
    }

    private void checkUserLoginState() {
        String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        if (aAccountAddress.isEmpty()) {
            // User logging in for the first time
            loadFragment(CreateAuidFragment.newInstance());
        } else {
            // User has already used the app
            if (AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_APP_PIN_SET)) { // Verify PIN
                startActivity(new Intent(this, VerifyPinActivity.class));
                finish();
            } else { // Set PIN
                loadFragment(SetPinFragment.newInstance(aAccountAddress));
            }
        }
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
        if (!(aFragment instanceof CreateAuidFragment))
            hideBackIcon();
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
    public void onShowErrorDialog(String iError) {
        showSingleActionError(iError);
    }

    @Override
    public void onCopyToClipboardClicked(String iCopyString) {
        copyToClipboard(iCopyString);
    }

    @Override
    public void onLoadNextFragment(Fragment iNextFragment) {
        loadFragment(iNextFragment);
    }

    @Override
    public void onLoadNextActivity(Intent iIntent) {
        if (iIntent != null) {
            startActivity(iIntent);
            finish();
        }
    }
}