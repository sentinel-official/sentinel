package sentinelgroup.io.sentinel.ui.activity;

import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.MenuItem;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.dialog.DoubleActionDialogFragment;
import sentinelgroup.io.sentinel.ui.fragment.CreateAuidFragment;
import sentinelgroup.io.sentinel.ui.fragment.SetPinFragment;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

public class CreateAccountActivity extends SimpleBaseActivity implements DoubleActionDialogFragment.OnDialogActionListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        checkUserLoginState();
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

    /*
     * Check the user's login state and show the appropriate screen
     */
    private void checkUserLoginState() {
        String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        if (aAccountAddress.isEmpty()) {
            // User logging in for the first time
            loadFragment(CreateAuidFragment.newInstance());
        } else {
            // User has already used the app
            if (AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_APP_PIN_SET)) {
                // Verify PIN
                startActivity(new Intent(this, VerifyPinActivity.class));
                finish();
            } else {
                // Set PIN
                loadFragment(SetPinFragment.newInstance(aAccountAddress));
            }
        }
    }

    /**
     * Replace the existing fragment in the container with the new fragment passed in this method's
     * parameters
     *
     * @param iFragment [Fragment] The fragment which needs to be displayed
     */
    @Override
    public void loadFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, iFragment).commit();
    }

    // Listener implementations
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
    public void onShowSingleActionDialog(int iTitleId, String iMessage, int iPositiveOptionId) {
        showSingleActionError(iTitleId, iMessage, iPositiveOptionId);
    }

    @Override
    public void onShowDoubleActionDialog(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId) {
        showDoubleActionError(iTag, iTitleId, iMessage, iPositiveOptionId, iNegativeOptionId);
    }

    @Override
    public void onCopyToClipboardClicked(String iCopyString, int iToastText) {
        copyToClipboard(iCopyString, iToastText);
    }

    @Override
    public void onLoadNextFragment(Fragment iNextFragment) {
        loadFragment(iNextFragment);
    }

    @Override
    public void onLoadNextActivity(Intent iIntent, int iReqCode) {
        if (iIntent != null) {
            startActivity(iIntent);
            finish();
        }
    }

    @Override
    public void onActionButtonClicked(String iTag, Dialog iDialog, boolean isPositiveButton) {
        if (isPositiveButton) {
            if (iTag.equals(AppConstants.TAG_ADD_REFERRAL)) {
                Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
                if (aFragment instanceof CreateAuidFragment) {
                    ((CreateAuidFragment) aFragment).loadNextFragment();
                }
            }
        }
        iDialog.dismiss();
    }
}