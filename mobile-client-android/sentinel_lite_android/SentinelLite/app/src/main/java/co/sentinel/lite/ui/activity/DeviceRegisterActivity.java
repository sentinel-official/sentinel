package co.sentinel.lite.ui.activity;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;

import java.io.File;

import co.sentinel.lite.R;
import co.sentinel.lite.di.InjectorModule;
import co.sentinel.lite.ui.dialog.DoubleActionDialogFragment;
import co.sentinel.lite.ui.dialog.ProgressDialogFragment;
import co.sentinel.lite.ui.dialog.SingleActionDialogFragment;
import co.sentinel.lite.util.AppConstants;
import co.sentinel.lite.util.AppPreferences;
import co.sentinel.lite.util.Status;
import co.sentinel.lite.viewmodel.DeviceRegisterViewModel;
import co.sentinel.lite.viewmodel.DeviceRegisterViewModelFactory;

import static co.sentinel.lite.util.AppConstants.POSITIVE_BUTTON;
import static co.sentinel.lite.util.AppConstants.TAG_DOUBLE_ACTION_DIALOG;
import static co.sentinel.lite.util.AppConstants.TAG_ERROR;
import static co.sentinel.lite.util.AppConstants.TAG_PROGRESS_DIALOG;
import static co.sentinel.lite.util.AppConstants.TAG_SINGLE_ACTION_DIALOG;

public class DeviceRegisterActivity extends AppCompatActivity implements DoubleActionDialogFragment.OnDialogActionListener {
    private DeviceRegisterViewModel mViewModel;

    private ProgressDialogFragment mPrgDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setInfoShownBoolean();
        setContentView(R.layout.activity_device_register);
        initializePathIfNeeded();
        checkDeviceRegistrationState();
        initView();
        initViewModel();
        mViewModel.registerDeviceId(null);
    }

    /*
     * Set the info shown boolean in the preferences to true indicating the Info screen is already
     * shown
     */
    private void setInfoShownBoolean() {
        AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_INFO_SHOWN, true);
    }

    /*
     * Set the default path to be used in the app for storing files
     */
    private void initializePathIfNeeded() {
        if (AppPreferences.getInstance().getString(AppConstants.PREFS_CONFIG_PATH).isEmpty()) {
            String aConfigPath = new File(getFilesDir(), AppConstants.CONFIG_NAME).getAbsolutePath();
            AppPreferences.getInstance().saveString(AppConstants.PREFS_CONFIG_PATH, aConfigPath);
        }
    }

    /*
     * Check the user's login state and navigate the user to the appropriate next screen depending
     * on his logged in state
     */
    private void checkDeviceRegistrationState() {
        boolean aIsNewDevice = AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_NEW_DEVICE);
        if (!aIsNewDevice) {
            loadDashboardActivity();
        }
    }

    /*
     * Instantiate all the views used in the XML and perform other instantiation steps (if needed)
     */
    private void initView() {
        mPrgDialog = ProgressDialogFragment.newInstance(true);
    }

    private void initViewModel() {

        // init Device ID
        @SuppressLint("HardwareIds") String aDeviceId = Settings.Secure.getString(this.getContentResolver(), Settings.Secure.ANDROID_ID);

        DeviceRegisterViewModelFactory aFactory = InjectorModule.provDeviceRegisterViewModelFactory(this, aDeviceId);
        mViewModel = ViewModelProviders.of(this, aFactory).get(DeviceRegisterViewModel.class);

        mViewModel.getRegisterDeviceIdLiveEvent().observe(this, genericResponseResource -> {
            if (genericResponseResource != null) {
                if (genericResponseResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.generic_loading_message));
                } else if (genericResponseResource.data != null && genericResponseResource.status.equals(Status.SUCCESS)) {
                    mViewModel.fetchAccountInfo();
                } else if (genericResponseResource.message != null && genericResponseResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    if (genericResponseResource.message.equals(AppConstants.ERROR_GENERIC))
                        showDoubleActionError(TAG_ERROR, AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), R.string.retry, R.string.action_cancel);
                    else if (genericResponseResource.message.equals(getString(R.string.no_internet)))
                        showDoubleActionError(TAG_ERROR, AppConstants.VALUE_DEFAULT, genericResponseResource.message, R.string.retry, R.string.action_cancel);
                    else {
                        showSingleActionError(AppConstants.VALUE_DEFAULT, genericResponseResource.message, AppConstants.VALUE_DEFAULT);
                    }
                }
            }
        });

        mViewModel.getAccountInfoByDeviceIdLiveEvent().observe(this, genericResponseResource -> {
            if (genericResponseResource != null) {
                if (genericResponseResource.data != null && genericResponseResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    AppPreferences.getInstance().saveString(AppConstants.PREFS_BRANCH_REFERRER_ID, "");
                    AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_NEW_DEVICE, false);
                    loadDashboardActivity();
                } else if (genericResponseResource.message != null && genericResponseResource.status.equals(Status.ERROR)) {
                    if (genericResponseResource.message.equals(AppConstants.ERROR_GENERIC))
                        showDoubleActionError(TAG_ERROR, AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), R.string.retry, R.string.action_cancel);
                    else {
                        showDoubleActionError(TAG_ERROR, AppConstants.VALUE_DEFAULT, genericResponseResource.message, R.string.retry, R.string.action_cancel);
                    }
                }
            }
        });
    }

    /**
     * Shows an Error dialog with a Single button
     *
     * @param iTitleId          [int] The resource id of the title to be displayed
     * @param iMessage          [String] The error message to be displayed
     * @param iPositiveOptionId [int] The resource id of the button text
     */
    protected void showSingleActionError(int iTitleId, String iMessage, int iPositiveOptionId) {
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(TAG_SINGLE_ACTION_DIALOG);
        int aTitleId = iTitleId != -1 ? iTitleId : R.string.please_note;
        int aPositiveOptionText = iPositiveOptionId != -1 ? iPositiveOptionId : R.string.ok;
        if (aFragment == null)
            SingleActionDialogFragment.newInstance(aTitleId, iMessage, aPositiveOptionText)
                    .show(getSupportFragmentManager(), TAG_SINGLE_ACTION_DIALOG);
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

    /*
     * Helper method to initialize & update the attributes of the Progress Dialog and to toggle
     * it's visibility
     */
    private void toggleProgressDialogState(boolean isShow, boolean isHalfDim, String iMessage) {
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(TAG_PROGRESS_DIALOG);
        if (isShow) {
            if (aFragment == null) {
                if (!isHalfDim)
                    mPrgDialog.setNoDim();
                mPrgDialog.setLoadingMessage(iMessage);
                mPrgDialog.show(getSupportFragmentManager(), TAG_PROGRESS_DIALOG);
            } else {
                mPrgDialog.updateLoadingMessage(iMessage);
            }
        } else {
            if (aFragment != null && mPrgDialog != null)
                mPrgDialog.dismissAllowingStateLoss();
        }
    }

    /**
     * Initialize the Progress Dialog which needs to be shown while loading a screen
     *
     * @param isHalfDim [boolean] Denotes whether the dialog's background should be transparent or
     *                  dimmed
     * @param iMessage  [String] The message text which needs to be shown as Loading message
     */
    private void showProgressDialog(boolean isHalfDim, String iMessage) {
        toggleProgressDialogState(true, isHalfDim, iMessage == null ? getString(R.string.generic_loading_message) : iMessage);
    }

    /**
     * Hide the Progress Dialog window if it is currently being displayed
     */
    private void hideProgressDialog() {
        toggleProgressDialogState(false, false, null);
    }

    /*
     * Launch the DashboardActivity
     */
    private void loadDashboardActivity() {
        startActivity(new Intent(this, DashboardActivity.class));
        finish();
    }

    @Override
    public void onActionButtonClicked(String iTag, Dialog iDialog, int iButtonType) {
        iDialog.dismiss();
        if (iButtonType == POSITIVE_BUTTON) {
            if (iTag.equals(TAG_ERROR)) {
                mViewModel.registerDeviceId(null);
            }
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        hideProgressDialog();
    }

}