package sentinelgroup.io.sentinel.ui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.MenuItem;
import android.widget.CompoundButton;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.fragment.SendFragment;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

public class SendActivity extends BaseActivity {

    private boolean mIsVpnPay, mIsInit;
    private String mAmount, mSessionId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getIntentExtras();
    }

    private void getIntentExtras() {
        Bundle aBundle = getIntent().getExtras();
        if (aBundle != null) {
            mIsVpnPay = aBundle.getBoolean(AppConstants.EXTRA_IS_VPN_PAY);
            mIsInit = aBundle.getBoolean(AppConstants.EXTRA_IS_INIT);
            mAmount = aBundle.getString(AppConstants.EXTRA_AMOUNT);
            if (mIsVpnPay && !mIsInit)
                mSessionId = aBundle.getString(AppConstants.EXTRA_SESSION_ID);
            if (mIsInit)
                showSingleActionError(aBundle.getString(AppConstants.EXTRA_INIT_MESSAGE));
        }
        loadFragment(SendFragment.newInstance(mIsVpnPay, mIsInit, mAmount, mSessionId));
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
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE, isChecked);
        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        if (aFragment instanceof SendFragment) {
            ((SendFragment) aFragment).updateAdapterData(isChecked);
        }
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
    }
}