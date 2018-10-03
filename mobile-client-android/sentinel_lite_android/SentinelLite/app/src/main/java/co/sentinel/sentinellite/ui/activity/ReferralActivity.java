package co.sentinel.sentinellite.ui.activity;

import android.Manifest;
import android.app.Dialog;
import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.Fragment;
import android.view.MenuItem;

import co.sentinel.sentinellite.R;
import co.sentinel.sentinellite.ui.dialog.AddressToClaimDialogFragment;
import co.sentinel.sentinellite.ui.fragment.ReferralFragment;
import co.sentinel.sentinellite.util.AppConstants;
import co.sentinel.sentinellite.util.AppPreferences;

import static co.sentinel.sentinellite.util.AppConstants.NEUTRAL_BUTTON;
import static co.sentinel.sentinellite.util.AppConstants.POSITIVE_BUTTON;
import static co.sentinel.sentinellite.util.AppConstants.TAG_DOWNLOAD;
import static co.sentinel.sentinellite.util.AppConstants.TAG_LINK_ACCOUNT_CONFIRMATION;

public class ReferralActivity extends BaseActivity implements AddressToClaimDialogFragment.OnAddressSubmitListener {
    private DownloadManager mDownloadManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        loadFragment(ReferralFragment.newInstance());
        // init download manager
        mDownloadManager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
        }
        return super.onOptionsItemSelected(item);
    }

    private void downloadApp() {
        Uri aDownloadUri;
        String aFileUri = AppPreferences.getInstance().getString(AppConstants.PREFS_FILE_URL);
        String aFileName = AppPreferences.getInstance().getString(AppConstants.PREFS_FILE_NAME);

        if (aFileUri.startsWith("http://") || aFileUri.startsWith("https://"))
            aDownloadUri = Uri.parse(aFileUri);
        else
            aDownloadUri = Uri.parse("https://" + aFileUri);
        DownloadManager.Request aRequest = new DownloadManager.Request(aDownloadUri);
        aRequest.setTitle(getString(R.string.downloading_app_tite))
                .setDescription(aFileName)
                .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "/Sentinel/" + "/" + aFileName);
        mDownloadManager.enqueue(aRequest);
    }

    public boolean checkForPermissionGrant() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
                // Permission is granted
                return true;
            } else {
                // Permission is revoked
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, AppConstants.REQ_CODE_PERMISSION);
                return false;
            }
        }
        return true;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        switch (requestCode) {
            case AppConstants.REQ_CODE_PERMISSION:
                boolean isPermissionForAllGranted = false;
                if (grantResults.length > 0 && permissions.length == grantResults.length) {
                    for (int i = 0; i < permissions.length; i++) {
                        isPermissionForAllGranted = grantResults[i] == PackageManager.PERMISSION_GRANTED;
                    }
                }
                if (isPermissionForAllGranted) {
                    // Permission granted. Download.
                    downloadApp();
                }
                break;
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
    public void onShowTripleActionDialog(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId, int iNeutralOptionId) {
        showTripleActionError(iTag, iTitleId, iMessage, iPositiveOptionId, iNegativeOptionId, iNeutralOptionId);
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
        if (iIntent != null) {
            startActivity(Intent.createChooser(iIntent, getResources().getText(R.string.send_to)));
        }
    }

    @Override
    public void onActionButtonClicked(String iTag, Dialog iDialog, int iButtonType) {
        if (iButtonType == NEUTRAL_BUTTON) {
            if (iTag.equals(TAG_DOWNLOAD)) {
                if (checkForPermissionGrant()) {
                    downloadApp();
                    iDialog.dismiss();
                }
            }
        } else if (iButtonType == POSITIVE_BUTTON) {
            if (iTag.equals(TAG_DOWNLOAD)) {
                Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
                if (aFragment instanceof ReferralFragment) {
                    ((ReferralFragment) aFragment).showEnterAddressDialog();
                    iDialog.dismiss();
                }
            } else if (iTag.equals(TAG_LINK_ACCOUNT_CONFIRMATION)) {
                Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
                if (aFragment instanceof ReferralFragment) {
                    ((ReferralFragment) aFragment).linkSncSlcAccounts(iDialog);
                }
            }
        } else {
            iDialog.dismiss();
        }
    }

    @Override
    public void onAddressSubmitted(String iAddress) {
        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        if (aFragment instanceof ReferralFragment) {
            ((ReferralFragment) aFragment).onAddressSubmitted(iAddress);
        }
    }
}