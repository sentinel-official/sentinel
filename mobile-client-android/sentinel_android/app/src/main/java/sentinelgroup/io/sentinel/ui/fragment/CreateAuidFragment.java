package sentinelgroup.io.sentinel.ui.fragment;

import android.Manifest;
import android.annotation.SuppressLint;
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
import android.widget.Toast;

import java.util.Objects;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Status;
import sentinelgroup.io.sentinel.viewmodel.CreateAuidViewModel;
import sentinelgroup.io.sentinel.viewmodel.CreateAuidViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnGenericFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link CreateAuidFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class CreateAuidFragment extends Fragment implements View.OnClickListener, TextWatcher {

    private CreateAuidViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private TextInputEditText mTetPassword, mTetConfirmPassword, mTetReferral;
    private Button mBtnNext;

    private boolean mIsRequested;
    private String mAccountAddress, mPrivateKey, mKeystoreFilePath;

    public CreateAuidFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment CreateAuidFragment.
     */
    public static CreateAuidFragment newInstance() {
        return new CreateAuidFragment();
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_create_auid, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.create_auid));
        initViewModel();
    }

    private void initView(View iView) {
        mTetPassword = iView.findViewById(R.id.tet_password);
        mTetConfirmPassword = iView.findViewById(R.id.tet_confirm_password);
        mTetReferral = iView.findViewById(R.id.tet_referral);
        mBtnNext = iView.findViewById(R.id.btn_next);
        // Set listeners
        mTetPassword.addTextChangedListener(this);
        mTetConfirmPassword.addTextChangedListener(this);
        mBtnNext.setOnClickListener(this);
    }

    private void initViewModel() {
        mTetReferral.setText(AppPreferences.getInstance().getString(AppConstants.PREFS_BRANCH_REFERRER_ID));

        // init Device ID
        @SuppressLint("HardwareIds") String aDeviceId = Settings.Secure.getString(Objects.requireNonNull(getActivity()).getContentResolver(), Settings.Secure.ANDROID_ID);

        CreateAuidViewModelFactory aFactory = InjectorModule.provideCreateAccountViewModelFactory(getContext(), aDeviceId);
        mViewModel = ViewModelProviders.of(this, aFactory).get(CreateAuidViewModel.class);

        mViewModel.getSessionClearedLiveEvent().observe(this, sessionCleared -> {
            if (sessionCleared != null && sessionCleared) {
                AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_CLEAR_DB, false);
            }
        });

        mViewModel.getAccountLiveEvent().observe(this, accountResource -> {
            if (accountResource != null) {
                if (accountResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.creating_account));
                } else if (accountResource.data != null && accountResource.status.equals(Status.SUCCESS)) {
                    mViewModel.saveAccount(accountResource.data);
                } else if (accountResource.message != null && accountResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    if (accountResource.message.equals(AppConstants.GENERIC_ERROR))
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), AppConstants.VALUE_DEFAULT);
                    else
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, accountResource.message, AppConstants.VALUE_DEFAULT);
                }
            }
        });

        mViewModel.getKeystoreFileLiveEvent().observe(this, accountResource -> {
            if (accountResource != null) {
                hideProgressDialog();
                if (accountResource.data != null && accountResource.status.equals(Status.SUCCESS)) {
                    AppPreferences.getInstance().saveString(AppConstants.PREFS_ACCOUNT_ADDRESS, accountResource.data.accountAddress);
                    mAccountAddress = accountResource.data.accountAddress;
                    mPrivateKey = accountResource.data.privateKey;
                    mKeystoreFilePath = accountResource.data.keystoreFilePath;
                    String aReferralAddress = mTetReferral.getText().toString().trim();
                    if (validateReferral(aReferralAddress)) {
                        mViewModel.addAccountInfo(mAccountAddress, aReferralAddress);
                    }
                } else if (accountResource.message != null && accountResource.status.equals(Status.ERROR)) {
                    if (accountResource.message.equals(AppConstants.STORAGE_ERROR))
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.storage_error), AppConstants.VALUE_DEFAULT);
                    else if (accountResource.message.equals(AppConstants.GENERIC_ERROR))
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), AppConstants.VALUE_DEFAULT);
                    else
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, accountResource.message, AppConstants.VALUE_DEFAULT);
                }
            }
        });

        mViewModel.getAddAccountLiveEvent().observe(this, genericResponseResource -> {
            if (genericResponseResource != null) {
                if (genericResponseResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.adding_referral));
                } else if (genericResponseResource.data != null && genericResponseResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    loadNextFragment();
                } else if (genericResponseResource.message != null && genericResponseResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    if (genericResponseResource.message.equals(AppConstants.ERROR_GENERIC))
                        showDoubleActionDialog(AppConstants.TAG_ADD_REFERRAL, AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), R.string.retry, R.string.cancel);
                    else if (genericResponseResource.message.equals(getString(R.string.no_internet)))
                        showDoubleActionDialog(AppConstants.TAG_ADD_REFERRAL, AppConstants.VALUE_DEFAULT, genericResponseResource.message, R.string.retry, R.string.cancel);
                    else {
                        if (genericResponseResource.message.equals("Device is already registered.")) {
                            mViewModel.updateAccountInfo(AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS));
                        } else {
                            mTetReferral.setText("");
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
                    loadNextFragment();
                } else if (genericResponseResource.message != null && genericResponseResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    if (genericResponseResource.message.equals(AppConstants.ERROR_GENERIC))
                        showDoubleActionDialog(AppConstants.TAG_ADD_REFERRAL, AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), R.string.retry, R.string.cancel);
                    else if (genericResponseResource.message.equals(getString(R.string.no_internet)))
                        showDoubleActionDialog(AppConstants.TAG_ADD_REFERRAL, AppConstants.VALUE_DEFAULT, genericResponseResource.message, R.string.retry, R.string.cancel);
                    else {
                        mTetReferral.setText("");
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, genericResponseResource.message, AppConstants.VALUE_DEFAULT);
                    }
                }
            }
        });
    }

    private void createNewAccount() {
        String aPassword = mTetPassword.getText().toString().trim();
        String aPassword2 = mTetConfirmPassword.getText().toString().trim();
        String aReferral = mTetReferral.getText().toString().trim();

        if (TextUtils.isEmpty(mAccountAddress)) {
            if (validatePassword(aPassword, aPassword2)) {
                mViewModel.createNewAccount(aPassword);
            }
        } else {
            if (validateReferral(aReferral)) {
                mViewModel.addAccountInfo(mAccountAddress, aReferral);
            }
        }

    }

    private boolean validatePassword(String iPassword, String iConfirmPassword) {
        if (!iPassword.equals(iConfirmPassword)) {
            mTetConfirmPassword.setText("");
            mTetConfirmPassword.requestFocus();
            showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.password_mismatch), AppConstants.VALUE_DEFAULT);
            return false;
        } else {
            return true;
        }
    }

    private boolean validateReferral(String iReferralAddress) {
        if (TextUtils.isEmpty(iReferralAddress)) {
            showDoubleActionDialog(AppConstants.TAG_ADD_REFERRAL, AppConstants.VALUE_DEFAULT, getString(R.string.referral_address_missing), R.string.yes, R.string.no);
            return false;
        } else {
            return true;
        }
    }

    private boolean isStoragePermissionGranted() {
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

    private void clearReferralField() {
        mTetReferral.setText("");
        // disable the password and confirm password field
        mTetPassword.setFocusable(false);
        mTetPassword.setFocusableInTouchMode(false);
        mTetConfirmPassword.setFocusable(false);
        mTetConfirmPassword.setFocusableInTouchMode(false);
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

    public void loadNextFragment() {
        if (mListener != null) {
            AppPreferences.getInstance().saveString(AppConstants.PREFS_BRANCH_REFERRER_ID, "");
            AppPreferences.getInstance().saveString(AppConstants.PREFS_ACCOUNT_ADDRESS, mAccountAddress);
            mListener.onLoadNextFragment(SecureKeysFragment.newInstance(mAccountAddress, mPrivateKey, mKeystoreFilePath));
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
        mBtnNext.setEnabled(!mTetPassword.getText().toString().trim().isEmpty()
                && !mTetConfirmPassword.getText().toString().trim().isEmpty());
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.btn_next) {
            if (isStoragePermissionGranted())
                createNewAccount();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            createNewAccount();
        } else {
            mIsRequested = false;
            Toast.makeText(getContext(), R.string.storage_permission_denied, Toast.LENGTH_SHORT).show();
        }
    }
}
