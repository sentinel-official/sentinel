package co.sentinel.sentinellite.ui.activity;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Settings;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.widget.TextView;

import co.sentinel.sentinellite.BuildConfig;
import co.sentinel.sentinellite.R;
import co.sentinel.sentinellite.di.InjectorModule;
import co.sentinel.sentinellite.ui.dialog.DoubleActionDialogFragment;
import co.sentinel.sentinellite.util.AppConstants;
import co.sentinel.sentinellite.util.AppPreferences;
import co.sentinel.sentinellite.util.Status;
import co.sentinel.sentinellite.viewmodel.SplashViewModel;
import co.sentinel.sentinellite.viewmodel.SplashViewModelFactory;

import static co.sentinel.sentinellite.util.AppConstants.TAG_DOUBLE_ACTION_DIALOG;
import static co.sentinel.sentinellite.util.AppConstants.TAG_ERROR;
import static co.sentinel.sentinellite.util.AppConstants.TAG_UPDATE;

public class SplashActivity extends AppCompatActivity implements DoubleActionDialogFragment.OnDialogActionListener {
    private SplashViewModel mViewModel;

    private Handler mHandler;
    private Runnable mRunnable;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        initViewModel();
    }

    private void initViewModel() {
        String aVersionName = getString(R.string.lite, BuildConfig.VERSION_NAME);
        ((TextView) findViewById(R.id.tv_app_version)).setText(aVersionName);


        // init Device ID
        @SuppressLint("HardwareIds") String aDeviceId = Settings.Secure.getString(this.getContentResolver(), Settings.Secure.ANDROID_ID);

        SplashViewModelFactory aFactory = InjectorModule.provideSplashViewModelFactory(this, aDeviceId);
        mViewModel = ViewModelProviders.of(this, aFactory).get(SplashViewModel.class);

        mViewModel.getAccountInfoLiveEvent().observe(this, genericResponseResource -> {
            if (genericResponseResource != null) {
                if (genericResponseResource.data != null && genericResponseResource.status.equals(Status.SUCCESS)) {
                    mViewModel.fetchSlcVersionInfo();
                } else if (genericResponseResource.message != null && genericResponseResource.status.equals(Status.ERROR)) {
                    if (genericResponseResource.message.equals(AppConstants.ERROR_GENERIC))
                        showDoubleActionError(TAG_ERROR, AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), R.string.retry, R.string.cancel);
                    else if (genericResponseResource.message.equals(getString(R.string.no_internet)))
                        showDoubleActionError(TAG_ERROR, AppConstants.VALUE_DEFAULT, genericResponseResource.message, R.string.retry, R.string.cancel);
                    else {
                        AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_NEW_DEVICE, true);
                        mViewModel.fetchSlcVersionInfo();
                    }
                }
            }
        });

        mViewModel.getSlcVersionInfoLiveEvent().observe(this, versionInfoResource -> {
            if (versionInfoResource != null) {
                if (versionInfoResource.data != null && versionInfoResource.status.equals(Status.SUCCESS)) {
                    int aLatestVersion = versionInfoResource.data.version;
                    int aAppVersion = BuildConfig.VERSION_CODE;
                    if (aAppVersion < aLatestVersion) {
                        showDoubleActionError(TAG_UPDATE, R.string.update_available, getString(R.string.update_desc), R.string.download, R.string.cancel);
                    } else {
                        loadNextActivityAfterDelay();
                    }
                } else if (versionInfoResource.message != null && versionInfoResource.status.equals(Status.ERROR)) {
                    if (versionInfoResource.message.equals(AppConstants.ERROR_GENERIC))
                        showDoubleActionError(TAG_ERROR, AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), R.string.retry, R.string.cancel);
                    else if (versionInfoResource.message.equals((AppConstants.ERROR_VERSION_FETCH)))
                        loadNextActivityAfterDelay();
                    else
                        showDoubleActionError(TAG_ERROR, AppConstants.VALUE_DEFAULT, versionInfoResource.message, R.string.retry, R.string.cancel);
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
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(TAG_DOUBLE_ACTION_DIALOG);
        int aTitleId = iTitleId != -1 ? iTitleId : R.string.please_note;
        int aPositiveOptionId = iPositiveOptionId != -1 ? iPositiveOptionId : android.R.string.ok;
        int aNegativeOptionId = iNegativeOptionId != -1 ? iNegativeOptionId : android.R.string.cancel;
        if (aFragment == null)
            DoubleActionDialogFragment.newInstance(iTag, aTitleId, iMessage, aPositiveOptionId, aNegativeOptionId)
                    .show(getSupportFragmentManager(), TAG_DOUBLE_ACTION_DIALOG);
    }

    private void loadNextActivityAfterDelay() {
        if (mHandler == null) {
            mHandler = new Handler();
            mRunnable = () -> {
                if (!AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_INFO_SHOWN)) {
                    openNextActivity(OnBoardingActivity.class);
                } else {
                    openNextActivity(DeviceRegisterActivity.class);
                }
            };
            mHandler.postDelayed(mRunnable, 1000);
        }
    }

    /*
     * Fire the next activity based on the condition
     */
    private void openNextActivity(Class<?> iClass) {
        startActivity(new Intent(this, iClass));
        finish();
    }

    private void updateApp() {
        final String appPackageName = getPackageName();
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + appPackageName)));
        } catch (android.content.ActivityNotFoundException anfe) {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=" + appPackageName)));
        }
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
}