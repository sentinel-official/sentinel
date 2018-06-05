package sentinelgroup.io.sentinel.ui.activity;

import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.MenuItem;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.fragment.TxHistoryFragment;

public class TxHistoryActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        loadFragment(TxHistoryFragment.newInstance());
    }

    @Override
    protected void onResume() {
        super.onResume();
        disableTestNetSwitch(false);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void loadFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, iFragment).commit();
    }

    public void addFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().add(R.id.fl_container, iFragment).addToBackStack(null).commit();
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
    public void onShowSingleActionDialog(String iMessage) {
        showSingleActionError(iMessage);
    }

    @Override
    public void onShowDoubleActionDialog(String iMessage, int iPositiveOptionId, int iNegativeOptionId) {
        // Unimplemented method
    }

    @Override
    public void onCopyToClipboardClicked(String iCopyString, int iToastTextId) {
        copyToClipboard(iCopyString, iToastTextId);
    }

    @Override
    public void onLoadNextFragment(Fragment iNextFragment) {
        addFragment(iNextFragment);
    }

    @Override
    public void onLoadNextActivity(Intent iIntent, int iReqCode) {
        // Unimplemented method
    }

    @Override
    public void onActionButtonClicked(Dialog iDialog, boolean isPositiveButton) {
        // Unimplemented method
    }
}
