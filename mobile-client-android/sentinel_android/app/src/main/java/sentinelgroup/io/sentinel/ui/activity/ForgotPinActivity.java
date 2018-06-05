package sentinelgroup.io.sentinel.ui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.MenuItem;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.fragment.ForgotPinFragment;

public class ForgotPinActivity extends SimpleBaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        loadFragment(ForgotPinFragment.newInstance());
    }

    @Override
    public void loadFragment(Fragment iFragment) {
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
    public void onBackPressed() {
        setResult(RESULT_CANCELED);
        finish();
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
        loadFragment(iNextFragment);
    }

    @Override
    public void onLoadNextActivity(Intent iIntent, int iReqCode) {
        if (iIntent == null) {
            setResult(RESULT_OK);
            finish();
        }
    }
}
