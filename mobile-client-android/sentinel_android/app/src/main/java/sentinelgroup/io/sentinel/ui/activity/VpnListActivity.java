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

    private void getIntentExtras() {
        if (getIntent().getExtras() != null) {
            mVpnListData = (VpnListEntity) getIntent().getSerializableExtra(AppConstants.EXTRA_VPN_LIST);
            loadFragment(VpnDetailsFragment.newInstance(mVpnListData));
        } else {
            loadFragment(VpnListFragment.newInstance());
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        disableTestNetSwitch(mVpnListData == null);
    }

    @Override
    public void loadFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, iFragment).commit();
    }

    private void addFragment(Fragment iNextFragment) {
        getSupportFragmentManager().beginTransaction().add(R.id.fl_container, iNextFragment).addToBackStack(null).commit();
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
        showDoubleActionError(R.string.init_vpn_pay_title, iMessage, iPositiveOptionId, iNegativeOptionId);
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
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == AppConstants.REQ_VPN_INIT_PAY) {
            if (resultCode == RESULT_OK) {
                showSingleActionError(getString(R.string.init_vpn_pay_success_message));
            }
        }
    }

    @Override
    public void onVpnConnectionInitiated(String iVpnConfigFilePath) {
        // Unimplemented interface method
    }

    @Override
    public void onVpnDisconnectionInitiated() {
        // Unimplemented interface method
    }

    @Override
    public void onActionButtonClicked(Dialog iDialog, boolean isPositiveButton) {
        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        if (isPositiveButton) {
            if (aFragment instanceof VpnDetailsFragment)
                ((VpnDetailsFragment) aFragment).loadNextActivity(getIntent());
        }
        iDialog.dismiss();
    }
}
