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
import sentinelgroup.io.sentinel.ui.fragment.VpnHistoryFragment;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

public class VpnHistoryActivity extends BaseActivity {
    private boolean mPaymentMade;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void onResume() {
        super.onResume();
        boolean aIsTextNetActive = AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE);
        loadFragment(aIsTextNetActive ? VpnHistoryFragment.newInstance() :
                EmptyFragment.newInstance(getString(R.string.vpn_history_main_net_unavailable), getString(R.string.vpn_history)));
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
        setResult(mPaymentMade ? RESULT_OK : RESULT_CANCELED);
        super.onBackPressed();
    }

    /**
     * Add the fragment to the container which is passed in this method's parameters
     *
     * @param iFragment [Fragment] The fragment which needs to be displayed
     */
    private void addFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().add(R.id.fl_container, iFragment).addToBackStack(null).commit();
    }

    /*
     * Remove all the fragments from the container and load the default fragment
     */
    private void removeAllFragments() {
        FragmentManager aFragManager = getSupportFragmentManager();
        for (int i = 0; i < aFragManager.getBackStackEntryCount(); ++i) {
            aFragManager.popBackStack();
        }
        loadFragment(EmptyFragment.newInstance(getString(R.string.vpn_history_main_net_unavailable), getString(R.string.vpn_history)));
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
        // Unimplemented interface method
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
        if (iIntent != null && iReqCode != AppConstants.REQ_CODE_NULL)
            startActivityForResult(iIntent, iReqCode);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case AppConstants.REQ_VPN_PAY:
                if (resultCode == RESULT_OK) {
                    mPaymentMade = true;
                    loadFragment(VpnHistoryFragment.newInstance());
                }
        }
    }

    @Override
    public void onActionButtonClicked(String iTag, Dialog iDialog, boolean isPositiveButton) {
        // Unimplemented interface method
    }

    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        super.onCheckedChanged(buttonView, isChecked);
        if (isChecked)
            loadFragment(VpnHistoryFragment.newInstance());
        else
            removeAllFragments();
    }
}
