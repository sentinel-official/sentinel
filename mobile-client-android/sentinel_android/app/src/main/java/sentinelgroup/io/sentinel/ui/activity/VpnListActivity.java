package sentinelgroup.io.sentinel.ui.activity;

import android.app.Dialog;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.MenuItem;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.network.model.VpnListEntity;
import sentinelgroup.io.sentinel.ui.custom.OnVpnConnectionListener;
import sentinelgroup.io.sentinel.ui.fragment.VpnDetailsFragment;
import sentinelgroup.io.sentinel.ui.fragment.VpnListFragment;
import sentinelgroup.io.sentinel.util.AppConstants;

public class VpnListActivity extends BaseActivity implements OnVpnConnectionListener {
    private VpnListEntity mVpnListData;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getIntentExtras();
    }

    @Override
    protected void onResume() {
        super.onResume();
        disableTestNetSwitch(mVpnListData == null);
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
        super.onBackPressed();
        overridePendingTransition(R.anim.enter_left_to_right, R.anim.exit_right_to_left);
    }

    /*
     * Get intent extras passed to it from the calling activity
     */
    private void getIntentExtras() {
        if (getIntent().getExtras() != null) {
            mVpnListData = (VpnListEntity) getIntent().getSerializableExtra(AppConstants.EXTRA_VPN_LIST);
            loadFragment(VpnDetailsFragment.newInstance(mVpnListData));
        } else {
            loadFragment(VpnListFragment.newInstance());
        }
    }

    /**
     * Add the fragment to the container which is passed in this method's parameters
     *
     * @param iFragment [Fragment] The fragment which needs to be displayed
     */
    private void addFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().add(R.id.fl_container, iFragment).addToBackStack(null).commit();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == AppConstants.REQ_VPN_INIT_PAY) {
            if (resultCode == RESULT_OK) {
                showSingleActionError(AppConstants.VALUE_DEFAULT, getString(R.string.init_vpn_pay_success_message), AppConstants.VALUE_DEFAULT);
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
        addFragment(iNextFragment);
    }

    @Override
    public void onLoadNextActivity(Intent iIntent, int iReqCode) {
        if (iIntent != null)
            startActivityForResult(iIntent, iReqCode);
        else {
            setResult(RESULT_OK);
            finish();
        }
    }

    @Override
    public void onActionButtonClicked(String iTag, Dialog iDialog, boolean isPositiveButton) {
        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        if (isPositiveButton) {
            if (aFragment instanceof VpnDetailsFragment && iTag.equals(AppConstants.TAG_INIT_PAY))
                ((VpnDetailsFragment) aFragment).loadNextActivity(getIntent());
        }
        iDialog.dismiss();
    }

    @Override
    public void onVpnConnectionInitiated(String iVpnConfigFilePath) {
        // Unimplemented interface method
    }

    @Override
    public void onVpnDisconnectionInitiated() {
        // Unimplemented interface method
    }
}