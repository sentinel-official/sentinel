package sentinelgroup.io.sentinel.ui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.MenuItem;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.network.model.VpnList;
import sentinelgroup.io.sentinel.ui.fragment.VpnDetailsFragment;
import sentinelgroup.io.sentinel.util.AppConstants;

public class VpnDetailsActivity extends BaseActivity {

    private VpnList mVpnListData;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getIntentExtras();
    }

    private void getIntentExtras() {
        if (getIntent() != null)
            mVpnListData = (VpnList) getIntent().getSerializableExtra(AppConstants.EXTRA_VPN_LIST);
        loadFragment(VpnDetailsFragment.newInstance(mVpnListData));
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
