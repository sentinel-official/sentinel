package sentinelgroup.io.sentinel.ui.activity;

import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.MenuItem;
import android.widget.CompoundButton;

import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.fragment.SendFragment;
import sentinelgroup.io.sentinel.util.AppConstants;

public class SendActivity extends BaseActivity {
    private boolean mIsVpnPay, mIsInit;
    private String mAmount, mSessionId, mToAddress;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getIntentExtras();
    }

    @Override
    protected void onResume() {
        super.onResume();
        disableTestNetSwitch(mIsVpnPay);
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
        if (aFragment instanceof SendFragment)
            setResult(((SendFragment) aFragment).getTransactionState() ? RESULT_OK : RESULT_CANCELED);
        finish();
    }

    /*
     * Get intent extras passed to it from the calling activity
     */
    private void getIntentExtras() {
        Bundle aBundle = getIntent().getExtras();
        if (aBundle != null) {
            mIsVpnPay = aBundle.getBoolean(AppConstants.EXTRA_IS_VPN_PAY);
            mIsInit = aBundle.getBoolean(AppConstants.EXTRA_IS_INIT);
            mAmount = aBundle.getString(AppConstants.EXTRA_AMOUNT);
            mToAddress = aBundle.getString(AppConstants.EXTRA_TO_ADDRESS);
            if (mIsVpnPay && !mIsInit)
                mSessionId = aBundle.getString(AppConstants.EXTRA_SESSION_ID);
        }
        loadFragment(SendFragment.newInstance(mIsVpnPay, mIsInit, mAmount, mSessionId, mToAddress));
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        IntentResult result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
        if (result != null) {
            if (result.getContents() == null) {
                showSingleActionError(AppConstants.VALUE_DEFAULT, getString(R.string.no_scan_results), AppConstants.VALUE_DEFAULT);
            } else {
                if (result.getContents().matches("0[xX][0-9a-fA-F]+") && result.getContents().length() == 42) {
                    Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
                    if (aFragment instanceof SendFragment)
                        ((SendFragment) aFragment).updateToAddress(result.getContents());
                } else {
                    showSingleActionError(AppConstants.VALUE_DEFAULT, getString(R.string.not_a_address), AppConstants.VALUE_DEFAULT);
                }
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data);
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
        loadFragment(iNextFragment);
    }

    @Override
    public void onLoadNextActivity(Intent iIntent, int iReqCode) {
        if (iIntent == null && iReqCode == AppConstants.REQ_CODE_NULL) {
            IntentIntegrator aIntentIntegrator = new IntentIntegrator(this);
            aIntentIntegrator.setBeepEnabled(true);
            aIntentIntegrator.setOrientationLocked(true);
            aIntentIntegrator.setCaptureActivity(ScanCodeActivity.class);
            aIntentIntegrator.initiateScan();
        }
    }

    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        super.onCheckedChanged(buttonView, isChecked);
        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        if (aFragment instanceof SendFragment) {
            ((SendFragment) aFragment).updateAdapterData(isChecked);
        }
    }

    @Override
    public void onActionButtonClicked(String iTag, Dialog iDialog, boolean isPositiveButton) {
        // Unimplemented interface method
    }
}