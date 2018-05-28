package sentinelgroup.io.sentinel.ui.fragment;

import android.Manifest;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.design.widget.TextInputEditText;
import android.support.v4.app.Fragment;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

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

    private TextInputEditText mTetPassword, mTetConfirmPassword;
    private Button mBtnNext;
    private boolean mIsRequested;

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
        mBtnNext = iView.findViewById(R.id.btn_next);
        // Set listeners
        mTetPassword.addTextChangedListener(this);
        mTetConfirmPassword.addTextChangedListener(this);
        mBtnNext.setOnClickListener(this);
    }

    private void initViewModel() {
        CreateAuidViewModelFactory aFactory = InjectorModule.provideCreateAccountViewModelFactory();
        mViewModel = ViewModelProviders.of(this, aFactory).get(CreateAuidViewModel.class);

        mViewModel.getAccountLiveEvent().observe(this, accountResource -> {
            if (accountResource != null) {
                if (accountResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.creating_account));
                } else if (accountResource.data != null && accountResource.status.equals(Status.SUCCESS)) {
                    mViewModel.saveAccount(accountResource.data);
                } else if (accountResource.message != null && accountResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    showErrorDialog(accountResource.message);
                }
            }
        });

        mViewModel.getKeystoreFileLiveEvent().observe(this, accountResource -> {
            if (accountResource != null) {
                hideProgressDialog();
                if (accountResource.data != null && accountResource.status.equals(Status.SUCCESS)) {
                    loadNextFragment(accountResource.data.accountAddress, accountResource.data.privateKey, accountResource.data.keystoreFilePath);
                } else if (accountResource.message != null && accountResource.status.equals(Status.ERROR)) {
                    showErrorDialog(accountResource.message);
                }
            }
        });
    }

    private void createNewAccount() {
        String aPassword = mTetPassword.getText().toString().trim();
        String aPassword2 = mTetConfirmPassword.getText().toString().trim();
        if (validatePassword(aPassword, aPassword2))
            mViewModel.createNewAccount(aPassword);
    }

    private boolean validatePassword(String iPassword, String iConfirmPassword) {
        if (!iPassword.equals(iConfirmPassword)) {
            showErrorDialog(getString(R.string.password_mismatch));
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

    public void showErrorDialog(String iError) {
        if (mListener != null) {
            mListener.onShowErrorDialog(iError);
        }
    }

    public void loadNextFragment(String iAccountAddress, String iPrivateKey, String iKeystoreFilePath) {
        if (mListener != null) {
            AppPreferences.getInstance().saveString(AppConstants.PREFS_ACCOUNT_ADDRESS, iAccountAddress);
            mListener.onLoadNextFragment(SecureKeysFragment.newInstance(iAccountAddress, iPrivateKey, iKeystoreFilePath));
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
