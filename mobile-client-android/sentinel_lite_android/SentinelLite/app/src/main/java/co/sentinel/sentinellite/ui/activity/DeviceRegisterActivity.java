package co.sentinel.sentinellite.ui.activity;

import android.annotation.SuppressLint;
import android.app.Dialog;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings;
import android.support.design.widget.TextInputEditText;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.text.Editable;
import android.text.InputFilter;
import android.text.TextWatcher;
import android.view.View;

import java.io.File;

import co.sentinel.sentinellite.R;
import co.sentinel.sentinellite.SentinelLiteApp;
import co.sentinel.sentinellite.di.InjectorModule;
import co.sentinel.sentinellite.ui.dialog.DoubleActionDialogFragment;
import co.sentinel.sentinellite.ui.dialog.ProgressDialogFragment;
import co.sentinel.sentinellite.ui.dialog.SingleActionDialogFragment;
import co.sentinel.sentinellite.util.AppConstants;
import co.sentinel.sentinellite.util.AppPreferences;
import co.sentinel.sentinellite.util.Status;
import co.sentinel.sentinellite.viewmodel.DeviceRegisterViewModel;
import co.sentinel.sentinellite.viewmodel.DeviceRegisterViewModelFactory;

import static co.sentinel.sentinellite.util.AppConstants.TAG_DOUBLE_ACTION_DIALOG;
import static co.sentinel.sentinellite.util.AppConstants.TAG_ERROR;
import static co.sentinel.sentinellite.util.AppConstants.TAG_PROGRESS_DIALOG;
import static co.sentinel.sentinellite.util.AppConstants.TAG_SINGLE_ACTION_DIALOG;

public class DeviceRegisterActivity extends AppCompatActivity implements View.OnClickListener,
        DoubleActionDialogFragment.OnDialogActionListener, TextWatcher {
    private DeviceRegisterViewModel mViewModel;

    private TextInputEditText mTetReferral;

    private ProgressDialogFragment mPrgDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setInfoShownBoolean();
        setupAppLanguage();
        setContentView(R.layout.activity_device_register);
        initializePathIfNeeded();
        checkDeviceRegistrationState();
        initView();
        initViewModel();
    }

    /*
     * Set the info shown boolean in the preferences to true indicating the Info screen is already
     * shown
     */
    private void setInfoShownBoolean() {
        AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_INFO_SHOWN, true);
    }

    /*
     * Set the default Language for the App to "English" if language is not set by the user
     */
    private void setupAppLanguage() {
        if (SentinelLiteApp.getSelectedLanguage().isEmpty())
            AppPreferences.getInstance().saveString(AppConstants.PREFS_SELECTED_LANGUAGE_CODE, getString(R.string.default_language));
        SentinelLiteApp.changeLanguage(this, SentinelLiteApp.getSelectedLanguage());
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
        mTetReferral = findViewById(R.id.tet_referral);
        mTetReferral.setFilters(new InputFilter[]{new InputFilter.AllCaps()});
        findViewById(R.id.btn_next).setOnClickListener(this);
        mTetReferral.addTextChangedListener(this);
    }

    private void initViewModel() {
        // init Device ID
        @SuppressLint("HardwareIds") String aDeviceId = Settings.Secure.getString(this.getContentResolver(), Settings.Secure.ANDROID_ID);

        DeviceRegisterViewModelFactory aFactory = InjectorModule.provDeviceRegisterViewModelFactory(this, aDeviceId);
        mViewModel = ViewModelProviders.of(this, aFactory).get(DeviceRegisterViewModel.class);

        mViewModel.getRegisterDeviceIdLiveEvent().observe(this, genericResponseResource -> {
            if (genericResponseResource != null) {
                if (genericResponseResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.registering_device));
                } else if (genericResponseResource.data != null && genericResponseResource.status.equals(Status.SUCCESS)) {
                    mViewModel.fetchAccountInfo();
                } else if (genericResponseResource.message != null && genericResponseResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    if (genericResponseResource.message.equals(AppConstants.ERROR_GENERIC))
                        showDoubleActionError(TAG_ERROR, AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), R.string.retry, R.string.cancel);
                    else if (genericResponseResource.message.equals(getString(R.string.no_internet)))
                        showDoubleActionError(TAG_ERROR, AppConstants.VALUE_DEFAULT, genericResponseResource.message, R.string.retry, R.string.cancel);
                    else {
                        mTetReferral.setText("");
                        showSingleActionError(AppConstants.VALUE_DEFAULT, genericResponseResource.message, AppConstants.VALUE_DEFAULT);
                    }
                }
            }
        });

        mViewModel.getAccountInfoLiveEvent().observe(this, genericResponseResource -> {
            if (genericResponseResource != null) {
                if (genericResponseResource.data != null && genericResponseResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_NEW_DEVICE, false);
                    loadDashboardActivity();
                } else if (genericResponseResource.message != null && genericResponseResource.status.equals(Status.ERROR)) {
                    if (genericResponseResource.message.equals(AppConstants.ERROR_GENERIC))
                        showDoubleActionError(TAG_ERROR, AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), R.string.retry, R.string.cancel);
                    else {
                        showDoubleActionError(TAG_ERROR, AppConstants.VALUE_DEFAULT, genericResponseResource.message, R.string.retry, R.string.cancel);
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
            if (aFragment != null)
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

    // Listener implementations
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_next:
                showDoubleActionError(AppConstants.TAG_ERROR, AppConstants.VALUE_DEFAULT, getString(R.string.referral_address_missing), R.string.yes, R.string.no);
                break;
        }
    }

    @Override
    public void onActionButtonClicked(String iTag, Dialog iDialog, boolean isPositiveButton) {
        iDialog.dismiss();
        if (isPositiveButton) {
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

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {

    }

    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {
    }

    @Override
    public void afterTextChanged(Editable s) {
        String aRefId = s.toString().trim();
        if (aRefId.length() == AppConstants.REFERRAL_CODE_LENGHT) {
            mViewModel.registerDeviceId(aRefId);
        }
    }
}