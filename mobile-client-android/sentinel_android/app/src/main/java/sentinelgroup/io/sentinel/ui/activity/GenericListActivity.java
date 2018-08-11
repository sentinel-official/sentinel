package sentinelgroup.io.sentinel.ui.activity;

import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.MenuItem;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.fragment.GenericListFragment;
import sentinelgroup.io.sentinel.util.AppConstants;

public class GenericListActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getIntentExtras();
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
        setResult(RESULT_OK);
        finish();
    }

    /*
     * Get intent extras passed to it from the calling activity
     */
    private void getIntentExtras() {
        Bundle aExtras = getIntent().getExtras();
        if (aExtras != null) {
            int aReqCode = aExtras.getInt(AppConstants.EXTRA_REQ_CODE);
            if (aReqCode == AppConstants.REQ_LANGUAGE)
                loadFragment(GenericListFragment.newInstance(aReqCode));
        } else
            finish();
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
        setToolbarTitle(iTitle);
    }

    @Override
    public void onShowProgressDialog(boolean isHalfDim, String iMessage) {
        // Unimplemented method
    }

    @Override
    public void onHideProgressDialog() {
        // Unimplemented method
    }

    @Override
    public void onShowSingleActionDialog(int iTitleId, String iMessage, int iPositiveOptionId) {
        showSingleActionError(iTitleId, iMessage, iPositiveOptionId);
    }

    @Override
    public void onShowDoubleActionDialog(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId) {
        // Unimplemented method
    }

    @Override
    public void onCopyToClipboardClicked(String iCopyString, int iToastTextId) {
        // Unimplemented method
    }

    @Override
    public void onLoadNextFragment(Fragment iNextFragment) {
        // Unimplemented method
    }

    @Override
    public void onLoadNextActivity(Intent iIntent, int iReqCode) {
        if (iIntent != null && iReqCode == AppConstants.REQ_CODE_NULL)
            startActivity(iIntent);
    }

    @Override
    public void onActionButtonClicked(String iTag, Dialog iDialog, boolean isPositiveButton) {
        // Unimplemented method
    }
}
