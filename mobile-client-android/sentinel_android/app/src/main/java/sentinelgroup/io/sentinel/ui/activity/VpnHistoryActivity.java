package sentinelgroup.io.sentinel.ui.activity;

import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.MenuItem;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.fragment.VpnHistoryFragment;
import sentinelgroup.io.sentinel.util.AppConstants;

public class VpnHistoryActivity extends BaseActivity {

    private boolean mPaymentMade;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        loadFragment(VpnHistoryFragment.newInstance());
    }

    @Override
    protected void onResume() {
        super.onResume();
        disableTestNetSwitch(true);
    }

    @Override
    public void loadFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, iFragment).commit();
    }

    public void addFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().add(R.id.fl_container, iFragment).addToBackStack(null).commit();
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
    public void onActionButtonClicked(Dialog iDialog, boolean isPositiveButton) {
        // Unimplemented interface method
    }
}
