package sentinelgroup.io.sentinel.ui.activity;

import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.view.MenuItem;
import android.widget.CompoundButton;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.fragment.EmptyFragment;
import sentinelgroup.io.sentinel.ui.fragment.TxHistoryFragment;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

public class TxHistoryActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void onResume() {
        super.onResume();
        boolean aIsTextNetActive = AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE);
        loadFragment(aIsTextNetActive ? TxHistoryFragment.newInstance() :
                EmptyFragment.newInstance(getString(R.string.tx_history_main_net_unavailable), getString(R.string.transaction_history)));
    }

    @Override
    public void loadFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, iFragment).commit();
    }

    public void addFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().add(R.id.fl_container, iFragment).addToBackStack(null).commit();
    }


    public void removeAllFragments() {
        FragmentManager aFragManager = getSupportFragmentManager();
        for (int i = 0; i < aFragManager.getBackStackEntryCount(); ++i) {
            aFragManager.popBackStack();
        }
        loadFragment(EmptyFragment.newInstance(getString(R.string.tx_history_main_net_unavailable), getString(R.string.transaction_history)));
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
        }
        return super.onOptionsItemSelected(item);
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
    public void onActionButtonClicked(String iTag, Dialog iDialog, boolean isPositiveButton) {
        // Unimplemented method
    }

    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        super.onCheckedChanged(buttonView, isChecked);
        if (isChecked)
            loadFragment(TxHistoryFragment.newInstance());
        else
            removeAllFragments();
    }
}
