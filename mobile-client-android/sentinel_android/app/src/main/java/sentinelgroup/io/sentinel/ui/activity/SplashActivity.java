package sentinelgroup.io.sentinel.ui.activity;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.app.DownloadManager;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.provider.Settings;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.widget.TextView;

import org.json.JSONException;

import io.branch.referral.Branch;
import sentinelgroup.io.sentinel.BuildConfig;
import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.ui.dialog.DoubleActionDialogFragment;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Logger;
import sentinelgroup.io.sentinel.util.Status;
import sentinelgroup.io.sentinel.viewmodel.SplashViewModel;
import sentinelgroup.io.sentinel.viewmodel.SplashViewModelFactory;

import static sentinelgroup.io.sentinel.util.AppConstants.DOUBLE_ACTION_DIALOG_TAG;

public class SplashActivity extends AppCompatActivity implements DoubleActionDialogFragment.OnDialogActionListener {
    private static final String TAG_ERROR = "error";
    private static final String TAG_UPDATE = "update";

    private SplashViewModel mViewModel;

    private Handler mHandler;
    private Runnable mRunnable;

    private DownloadManager mDownloadManager;

    private String mFileUrl, mFileName;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        initViewModel();
    }

    private void initViewModel() {
        String aVersionName = getString(R.string.app_version, BuildConfig.VERSION_NAME);
        ((TextView) findViewById(R.id.tv_app_version)).setText(aVersionName);

        // init download manager
        mDownloadManager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);

        // init Device ID
        @SuppressLint("HardwareIds") String aDeviceId = Settings.Secure.getString(this.getContentResolver(), Settings.Secure.ANDROID_ID);

        SplashViewModelFactory aFactory = InjectorModule.provideSplashViewModelFactory(this, aDeviceId);
        mViewModel = ViewModelProviders.of(this, aFactory).get(SplashViewModel.class);

        mViewModel.getAccountInfoLiveEvent().observe(this, genericResponseResource -> {
            if (genericResponseResource != null) {
                if (genericResponseResource.data != null && genericResponseResource.status.equals(Status.SUCCESS)) {
                    mViewModel.fetchSncVersionInfo();
                } else if (genericResponseResource.message != null && genericResponseResource.status.equals(Status.ERROR)) {
                    if (genericResponseResource.message.equals(AppConstants.ERROR_GENERIC))
                        showDoubleActionError(TAG_ERROR, AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), R.string.retry, R.string.cancel);
                    else if (genericResponseResource.message.equals(getString(R.string.no_internet)))
                        showDoubleActionError(TAG_ERROR, AppConstants.VALUE_DEFAULT, genericResponseResource.message, R.string.retry, R.string.cancel);
                    else {
                        clearAppData();
                        mViewModel.fetchSncVersionInfo();
                    }
                }
            }
        });

        mViewModel.getVersionInfoLiveEvent().observe(this, versionInfoResource -> {
            if (versionInfoResource != null) {
                if (versionInfoResource.data != null && versionInfoResource.status.equals(Status.SUCCESS)) {
                    mFileUrl = versionInfoResource.data.fileUrl;
                    mFileName = versionInfoResource.data.fileName;
                    int aLatestVersion = versionInfoResource.data.version;
                    int aAppVersion = BuildConfig.VERSION_CODE;
                    if (aAppVersion < aLatestVersion && !TextUtils.isEmpty(AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS))) {
                        showDoubleActionError(TAG_UPDATE, R.string.update_available, getString(R.string.update_desc), R.string.download, R.string.cancel_button_label);
                    } else {
                        loadNextActivityAfterDelay();
                    }
                } else if (versionInfoResource.message != null && versionInfoResource.status.equals(Status.ERROR)) {
                    if (versionInfoResource.message.equals(AppConstants.GENERIC_ERROR))
                        showDoubleActionError(TAG_ERROR, AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), R.string.retry, R.string.cancel_button_label);
                    else
                        showDoubleActionError(TAG_ERROR, AppConstants.VALUE_DEFAULT, versionInfoResource.message, R.string.retry, R.string.cancel_button_label);
                }
            }
        });
    }

    /**
     * Shows an Error dialog with a Two buttons
     *
     * @param iTag              [String] The Tag assigned to the fragment when it's added to the container
     * @param iTitleId          [int] The resource id of the title to be displayed (default - "Please Note")
     * @param iMessage          [String] The error message to be displayed
     * @param iPositiveOptionId [int] The resource id of the positive button text (default - "Ok")
     * @param iNegativeOptionId [int] The resource id of the negative button text (default - "Cancel")
     */
    private void showDoubleActionError(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId) {
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(DOUBLE_ACTION_DIALOG_TAG);
        int aTitleId = iTitleId != -1 ? iTitleId : R.string.please_note;
        int aPositiveOptionId = iPositiveOptionId != -1 ? iPositiveOptionId : android.R.string.ok;
        int aNegativeOptionId = iNegativeOptionId != -1 ? iNegativeOptionId : android.R.string.cancel;
        if (aFragment == null)
            DoubleActionDialogFragment.newInstance(iTag, aTitleId, iMessage, aPositiveOptionId, aNegativeOptionId)
                    .show(getSupportFragmentManager(), DOUBLE_ACTION_DIALOG_TAG);
    }

    /*
     * Logout user by clearing all the values in shared preferences and reloading the
     * LauncherActivity
     */
    private void clearAppData() {
        AppPreferences.getInstance().clearSavedData(this);
        mViewModel.clearUserSession();
    }

    private void loadNextActivityAfterDelay() {
        mHandler = new Handler();
        mRunnable = () -> {
            if (!AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_INFO_SHOWN)
                    && AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS).isEmpty()) {
                openNextActivity(OnBoardingActivity.class);
            } else {
                openNextActivity(LauncherActivity.class);
            }
        };
        mHandler.postDelayed(mRunnable, 2000);
    }

    /*
     * Fire the next activity based on the condition
     */
    private void openNextActivity(Class<?> iClass) {
        startActivity(new Intent(this, iClass));
        finish();
    }

    private void updateApp() {
        Uri aDownloadUri;
        if (mFileUrl.startsWith("http://") || mFileUrl.startsWith("https://"))
            aDownloadUri = Uri.parse(mFileUrl);
        else
            aDownloadUri = Uri.parse("https://" + mFileUrl);
        DownloadManager.Request aRequest = new DownloadManager.Request(aDownloadUri);
        aRequest.setTitle(getString(R.string.downloading_app_tite))
                .setDescription(mFileName)
                .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                .setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "/Sentinel/" + "/" + mFileName);
        mDownloadManager.enqueue(aRequest);
        finish();
    }

    @Override
    protected void onDestroy() {
        if (mHandler != null && mRunnable != null)
            mHandler.removeCallbacks(mRunnable);
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        // Disable back action
    }

    @Override
    public void onActionButtonClicked(String iTag, Dialog iDialog, boolean isPositiveButton) {
        iDialog.dismiss();
        if (isPositiveButton) {
            if (iTag.equals(TAG_UPDATE)) {
                updateApp();
            } else if (iTag.equals(TAG_ERROR)) {
                mViewModel.fetchAccountInfo();
            }
        } else {
            finish();
        }
    }

    @Override
    public void onStart() {
        super.onStart();
        Branch branch = Branch.getInstance();

        // Branch init
        branch.initSession((referringParams, error) -> {
            if (error == null) {
                // params are the deep linked params associated with the link that the user clicked -> was re-directed to this app
                // params will be empty if no data found
                // ... insert custom logic here ...
                Logger.logInfo("BRANCH SDK", referringParams.toString());

                try {
                    if (referringParams.has(AppConstants.BRANCH_REFERRAL_ID)) {
                        String aReferrerID = referringParams.getString(AppConstants.BRANCH_REFERRAL_ID);
                        AppPreferences.getInstance().saveString(AppConstants.PREFS_BRANCH_REFERRER_ID, aReferrerID);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }

            } else {
                Logger.logInfo("BRANCH SDK", error.getMessage());
            }
        }, this.getIntent().getData(), this);
    }

    @Override
    public void onNewIntent(Intent intent) {
        this.setIntent(intent);
    }
}