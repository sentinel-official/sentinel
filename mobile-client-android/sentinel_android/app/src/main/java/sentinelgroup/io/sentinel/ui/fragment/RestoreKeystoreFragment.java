package sentinelgroup.io.sentinel.ui.fragment;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Dialog;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.design.widget.TextInputEditText;
import android.support.v4.app.Fragment;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.github.angads25.filepicker.model.DialogConfigs;
import com.github.angads25.filepicker.model.DialogProperties;
import com.github.angads25.filepicker.view.FilePickerDialog;

import java.io.File;
import java.util.Objects;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.ui.dialog.DoubleActionDialogFragment;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Logger;
import sentinelgroup.io.sentinel.util.Status;
import sentinelgroup.io.sentinel.viewmodel.RestoreKeystoreViewModel;
import sentinelgroup.io.sentinel.viewmodel.RestoreKeystoreViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnGenericFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link RestoreKeystoreFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class RestoreKeystoreFragment extends Fragment implements TextWatcher, View.OnClickListener, DoubleActionDialogFragment.OnDialogActionListener {

    private RestoreKeystoreViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private TextInputEditText mTetPassword;
    private Button mBtnRestore;
    private TextView mTvUpload;
    private ImageView mIvUpload, mIvUploaded;

    private String mKeystorePath = "";
    private int mButtonId;
    private boolean mIsRequested;

    public RestoreKeystoreFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment RestoreKeystoreFragment.
     */
    public static RestoreKeystoreFragment newInstance() {
        return new RestoreKeystoreFragment();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_restore_keystore, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.restore_keystore));
        initViewModel();
    }

    private void initView(View iView) {
        mTetPassword = iView.findViewById(R.id.tet_password);
        mBtnRestore = iView.findViewById(R.id.btn_restore);
        mTvUpload = iView.findViewById(R.id.tv_upload_file);
        mIvUpload = iView.findViewById(R.id.iv_upload_file);
        mIvUploaded = iView.findViewById(R.id.iv_uploaded);
        // Set Listeners
        mTetPassword.addTextChangedListener(this);
        mIvUpload.setOnClickListener(this);
        mBtnRestore.setOnClickListener(this);
    }

    private void initViewModel() {
        // init Device ID
        @SuppressLint("HardwareIds") String aDeviceId = Settings.Secure.getString(Objects.requireNonNull(getActivity()).getContentResolver(), Settings.Secure.ANDROID_ID);

        RestoreKeystoreViewModelFactory aFactory = InjectorModule.provideRestoreKeystoreViewModelFactory(getActivity(), aDeviceId);
        mViewModel = ViewModelProviders.of(this, aFactory).get(RestoreKeystoreViewModel.class);

        mViewModel.getRestoreLiveEvent().observe(this, keystoreResource -> {
            if (keystoreResource != null) {
                if (keystoreResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.restoring_accunt));
                } else if (keystoreResource.data != null && keystoreResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    mViewModel.fetchAccountInfo();
                } else if (keystoreResource.message != null && keystoreResource.status.equals(Status.ERROR)) {
                    mTetPassword.setText("");
                    hideProgressDialog();
                    clearPassword();
                    showSingleActionDialog(AppConstants.VALUE_DEFAULT, keystoreResource.message, AppConstants.VALUE_DEFAULT);
                }
            }
        });

        mViewModel.getAccountInfoLiveEvent().observe(this, genericResponseResource -> {
            if (genericResponseResource != null) {
                if (genericResponseResource.data != null && genericResponseResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    if (genericResponseResource.data.account != null && genericResponseResource.data.account.referralId != null) {
                        AppPreferences.getInstance().saveString(AppConstants.PREFS_REF_ID, genericResponseResource.data.account.referralId);
                    }
                    if (genericResponseResource.data.account != null && genericResponseResource.data.account.address != null && !TextUtils.isEmpty(genericResponseResource.data.account.address) && !TextUtils.isEmpty(genericResponseResource.data.account.deviceId) && AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS).equals(genericResponseResource.data.account.address) && aDeviceId.equals(genericResponseResource.data.account.deviceId)) {
                        loadNextFragment(AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS));
                    } else {
                        mViewModel.addAccountInfo(AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS), null);
                    }
                } else if (genericResponseResource.message != null && genericResponseResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    if (genericResponseResource.message.equals(AppConstants.ERROR_GENERIC)) {
                        Logger.logDebug("RestoreKeystoreFragment", "getUpdateAccountLiveEvent: ERROR_GENERIC");
                        showDoubleActionDialog(AppConstants.TAG_GET_ACCOUNT, AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), R.string.retry, R.string.cancel);
                    } else if (genericResponseResource.message.equals(getString(R.string.no_internet))) {
                        Logger.logDebug("RestoreKeystoreFragment", "getUpdateAccountLiveEvent: NO INTERNET");
                        showDoubleActionDialog(AppConstants.TAG_GET_ACCOUNT, AppConstants.VALUE_DEFAULT, genericResponseResource.message, R.string.retry, R.string.cancel);
                    } else {
                        Logger.logDebug("RestoreKeystoreFragment", "getUpdateAccountLiveEvent: ELSE");
                        mViewModel.addAccountInfo(AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS), null);
                    }
                }
            }
        });

        mViewModel.getAddAccountLiveEvent().observe(this, genericResponseResource -> {
            if (genericResponseResource != null) {
                if (genericResponseResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.adding_referral));
                } else if (genericResponseResource.data != null && genericResponseResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    loadNextFragment(AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS));
                } else if (genericResponseResource.message != null && genericResponseResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    if (genericResponseResource.message.equals(AppConstants.ERROR_GENERIC))
                        showDoubleActionDialog(AppConstants.TAG_ADD_ACCOUNT, AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), R.string.retry, R.string.cancel);
                    else if (genericResponseResource.message.equals(getString(R.string.no_internet)))
                        showDoubleActionDialog(AppConstants.TAG_ADD_ACCOUNT, AppConstants.VALUE_DEFAULT, genericResponseResource.message, R.string.retry, R.string.cancel);
                    else {
                        if (genericResponseResource.message.equals("Device is already registered.")) {
                            mViewModel.updateAccountInfo(AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS));
                        } else {
                            showSingleActionDialog(AppConstants.VALUE_DEFAULT, genericResponseResource.message, AppConstants.VALUE_DEFAULT);
                        }
                    }
                }
            }
        });

        mViewModel.getUpdateAccountLiveEvent().observe(this, genericResponseResource -> {
            if (genericResponseResource != null) {
                if (genericResponseResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.adding_referral));
                } else if (genericResponseResource.data != null && genericResponseResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    loadNextFragment(AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS));
                } else if (genericResponseResource.message != null && genericResponseResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    if (genericResponseResource.message.equals(AppConstants.ERROR_GENERIC)) {
                        Logger.logDebug("RestoreKeystoreFragment", "getUpdateAccountLiveEvent: ERROR_GENERIC");
                        showDoubleActionDialog(AppConstants.TAG_UPDATE_ACCOUNT, AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), R.string.retry, R.string.cancel);
                    } else if (genericResponseResource.message.equals(getString(R.string.no_internet))) {
                        Logger.logDebug("RestoreKeystoreFragment", "getUpdateAccountLiveEvent: NO INTERNET");
                        showDoubleActionDialog(AppConstants.TAG_UPDATE_ACCOUNT, AppConstants.VALUE_DEFAULT, genericResponseResource.message, R.string.retry, R.string.cancel);
                    } else {
                        Logger.logDebug("RestoreKeystoreFragment", "getUpdateAccountLiveEvent: ELSE");
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, genericResponseResource.message, AppConstants.VALUE_DEFAULT);
                    }
                }
            }
        });

    }

    private boolean isStoragePermissionGranted(int iClickedId) {
        mButtonId = iClickedId;
        if (Build.VERSION.SDK_INT >= 23) {
            if (getActivity() != null)
                if (getActivity().checkSelfPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
                    return true;
                } else {
                    if (!mIsRequested) {
                        mIsRequested = true;
                        requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
                    }
                    return false;
                }
        }
        return true;
    }

    private void performAction(int iButtonId) {
        switch (iButtonId) {
            case R.id.iv_upload_file:
                uploadFile();
                break;
            case R.id.btn_restore:
                restoreFile();
                break;
        }
    }

    private void uploadFile() {
        DialogProperties aProperties = new DialogProperties();
        aProperties.selection_mode = DialogConfigs.SINGLE_MODE;
        aProperties.selection_type = DialogConfigs.FILE_SELECT;
        aProperties.root = new File(DialogConfigs.DEFAULT_DIR);
        aProperties.error_dir = new File(DialogConfigs.DEFAULT_DIR);
        aProperties.offset = new File(DialogConfigs.DEFAULT_DIR);
        aProperties.extensions = null;

        FilePickerDialog aDialog = new FilePickerDialog(getContext(), aProperties);
        aDialog.setTitle(getString(R.string.select_file));

        aDialog.setDialogSelectionListener(files -> {
            // files is an array of the paths of files selected by the Application User.
            if (files.length == 1) {
                mKeystorePath = files[0];
                mIvUploaded.setVisibility(View.VISIBLE);
                mTvUpload.setText(R.string.uploaded_keystore_desc);
                Logger.logDebug("KEYSTOREPATH", mKeystorePath);
                mBtnRestore.setEnabled(!mTetPassword.getText().toString().isEmpty() && !mKeystorePath.isEmpty());
                aDialog.dismiss();
            }
        });
        aDialog.show();
    }

    private void restoreFile() {
        String aPassword = mTetPassword.getText().toString().trim();
        mViewModel.restoreKeystoreFile(aPassword, mKeystorePath);
    }

    private void clearPassword() {
        mTetPassword.setText("");
    }

    // Interface interaction methods
    public void fragmentLoaded(String iTitle) {
        if (mListener != null) {
            mListener.onFragmentLoaded(iTitle);
        }
    }

    public void showProgressDialog(boolean isHalfDim, String iMessage) {
        if (mListener != null) {
            mListener.onShowProgressDialog(isHalfDim, iMessage);
        }
    }

    public void hideProgressDialog() {
        if (mListener != null) {
            mListener.onHideProgressDialog();
        }
    }

    public void showSingleActionDialog(int iTitleId, String iMessage, int iPositiveOptionId) {
        if (mListener != null) {
            mListener.onShowSingleActionDialog(iTitleId, iMessage, iPositiveOptionId);
        }
    }

    private void showDoubleActionDialog(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId) {
        if (mListener != null) {
            mListener.onShowDoubleActionDialog(iTag, iTitleId, iMessage, iPositiveOptionId, iNegativeOptionId);
        }
    }

    public void loadNextFragment(String iAccountAddress) {
        if (mListener != null) {
            mListener.onLoadNextFragment(SetPinFragment.newInstance(iAccountAddress));
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnGenericFragmentInteractionListener) {
            mListener = (OnGenericFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnGenericFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        hideProgressDialog();
        super.onDetach();
        mListener = null;
    }

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {

    }

    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {

    }

    @Override
    public void afterTextChanged(Editable s) {
        mBtnRestore.setEnabled(!mTetPassword.getText().toString().isEmpty() && !mKeystorePath.isEmpty());
    }

    @Override
    public void onClick(View v) {
        if (isStoragePermissionGranted(v.getId())) {
            performAction(v.getId());
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            performAction(mButtonId);
        } else {
            mIsRequested = false;
            Toast.makeText(getContext(), R.string.storage_permission_denied, Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onActionButtonClicked(String iTag, Dialog iDialog, boolean isPositiveButton) {
        iDialog.dismiss();
        if (isPositiveButton) {
            switch (iTag) {
                case AppConstants.TAG_GET_ACCOUNT:
                    mViewModel.fetchAccountInfo();
                    break;
                case AppConstants.TAG_ADD_ACCOUNT:
                    mViewModel.addAccountInfo(AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS), null);
                    break;
                case AppConstants.TAG_UPDATE_ACCOUNT:
                    mViewModel.updateAccountInfo(AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS));
                    break;
            }
        }
    }
}