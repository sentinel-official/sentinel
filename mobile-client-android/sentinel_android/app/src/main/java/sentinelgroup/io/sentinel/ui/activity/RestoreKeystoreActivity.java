package sentinelgroup.io.sentinel.ui.activity;

import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.MenuItem;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.dialog.DoubleActionDialogFragment;
import sentinelgroup.io.sentinel.ui.fragment.RestoreKeystoreFragment;

public class RestoreKeystoreActivity extends SimpleBaseActivity implements DoubleActionDialogFragment.OnDialogActionListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        loadFragment(RestoreKeystoreFragment.newInstance());
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
        if (aFragment instanceof RestoreKeystoreFragment) {
            startActivity(new Intent(this, LauncherActivity.class));
            finish();
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
        if (!(aFragment instanceof RestoreKeystoreFragment))
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
    public void onCopyToClipboardClicked(String iCopyString, int iToastTextId) {
        copyToClipboard(iCopyString, iToastTextId);
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
        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        if (aFragment instanceof RestoreKeystoreFragment) {
            ((RestoreKeystoreFragment) aFragment).onActionButtonClicked(iTag, iDialog, isPositiveButton);
        }
    }
}