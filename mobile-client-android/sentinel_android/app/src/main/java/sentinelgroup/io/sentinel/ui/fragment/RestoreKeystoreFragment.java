package sentinelgroup.io.sentinel.ui.fragment;

import android.Manifest;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.AsyncTask;
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
import android.widget.ImageButton;
import android.widget.Toast;

import com.github.angads25.filepicker.model.DialogConfigs;
import com.github.angads25.filepicker.model.DialogProperties;
import com.github.angads25.filepicker.view.FilePickerDialog;

import org.web3j.crypto.CipherException;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.WalletUtils;

import java.io.File;
import java.io.IOException;
import java.lang.ref.WeakReference;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Logger;
import sentinelgroup.io.sentinel.util.Status;
import sentinelgroup.io.sentinel.viewmodel.RestoreKeystoreViewModel;
import sentinelgroup.io.sentinel.viewmodel.RestoreKeystoreViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link RestoreKeystoreFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link RestoreKeystoreFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class RestoreKeystoreFragment extends Fragment implements TextWatcher, View.OnClickListener {

    private RestoreKeystoreViewModel mViewModel;

    private OnFragmentInteractionListener mListener;

    private TextInputEditText mTetPassword;
    private ImageButton mIbUploadFile;
    private Button mBtnRestore;

    private String mKeystorePath = "";
    private int mButtonId;

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
        mIbUploadFile = iView.findViewById(R.id.ib_upload_file);
        mBtnRestore = iView.findViewById(R.id.btn_restore);
        // Set Listeners
        mTetPassword.addTextChangedListener(this);
        mIbUploadFile.setOnClickListener(this);
        mBtnRestore.setOnClickListener(this);
    }

    private void initViewModel() {
        RestoreKeystoreViewModelFactory aFactory = InjectorModule.provideRestoreKeystoreViewModelFactory();
        mViewModel = ViewModelProviders.of(this, aFactory).get(RestoreKeystoreViewModel.class);

        mViewModel.getRestoreLiveEvent().observe(this, accountResource -> {
            if (accountResource != null) {
                if (accountResource.status.equals(Status.LOADING)) {
                    toggleProgressDialog(true);
                } else if (accountResource.data != null && accountResource.status.equals(Status.SUCCESS)) {
                    toggleProgressDialog(false);
                    loadNextFragment(accountResource.data);
                } else if (accountResource.message != null && accountResource.status.equals(Status.ERROR)) {
                    toggleProgressDialog(false);
                    showErrorDialog(accountResource.message);
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
                    requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
                    return false;
                }
        }
        return true;
    }

    private void performAction(int iButtonId) {
        switch (iButtonId) {
            case R.id.ib_upload_file:
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
                Toast.makeText(getContext(), R.string.uploaded_success, Toast.LENGTH_SHORT).show();
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

    public void fragmentLoaded(String iTitle) {
        if (mListener != null) {
            mListener.onFragmentLoaded(iTitle);
        }
    }

    public void toggleProgressDialog(boolean isDialogShown) {
        if (mListener != null) {
            mListener.onToggleProgressDialog(isDialogShown);
        }
    }

    public void showErrorDialog(String iError) {
        if (mListener != null) {
            mTetPassword.setText("");
            mListener.onShowErrorDialog(iError);
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
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
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
            Toast.makeText(getContext(), R.string.storage_permission_denied, Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        void onFragmentLoaded(String iTitle);

        void onToggleProgressDialog(boolean isDialogShown);

        void onShowErrorDialog(String iError);

        void onLoadNextFragment(Fragment iNextFragment);

        void onLoadNextActivity();
    }
//
//    private static class ValidateAccountTask extends AsyncTask<Void, Void, Boolean> {
//        private WeakReference<RestoreKeystoreFragment> mWeakReference;
//        private String mPassword, mKeystorePath, mAccountAddress, mErrorMessage;
//
//        ValidateAccountTask(RestoreKeystoreFragment iFragment, String iPassword, String iKeystorePath) {
//            mWeakReference = new WeakReference<>(iFragment);
//            mPassword = iPassword;
//            mKeystorePath = iKeystorePath;
//        }
//
//        @Override
//        protected void onPreExecute() {
//            super.onPreExecute();
//            if (mWeakReference.get() != null) {
//                mWeakReference.get().toggleProgressDialog(true);
//            }
//        }
//
//        @Override
//        protected Boolean doInBackground(Void... voids) {
//            try {
//                Credentials aCredentials = WalletUtils.loadCredentials(mPassword, new File(mKeystorePath));
//                Logger.logDebug("ACC_ADDRESS", aCredentials.getAddress());
//                mAccountAddress = aCredentials.getAddress();
//                AppPreferences.getInstance().saveString(AppConstants.PREFS_ACCOUNT_ADDRESS, mAccountAddress);
//                return true;
//            } catch (IOException e) {
//                mErrorMessage = e.getLocalizedMessage();
//            } catch (CipherException e) {
//                mErrorMessage = e.getLocalizedMessage();
//            }
//            return false;
//        }
//
//        @Override
//        protected void onPostExecute(Boolean aIsRestored) {
//            super.onPostExecute(aIsRestored);
//            if (mWeakReference.get() != null) {
//                mWeakReference.get().toggleProgressDialog(false);
//                if (aIsRestored) {
//                    mWeakReference.get().loadNextFragment(mAccountAddress);
//                } else {
//                    mWeakReference.get().showErrorDialog(mErrorMessage);
//                }
//            }
//        }
//    }
}
