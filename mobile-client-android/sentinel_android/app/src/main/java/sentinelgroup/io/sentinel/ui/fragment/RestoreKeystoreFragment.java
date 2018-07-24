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
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.github.angads25.filepicker.model.DialogConfigs;
import com.github.angads25.filepicker.model.DialogProperties;
import com.github.angads25.filepicker.view.FilePickerDialog;

import java.io.File;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
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
public class RestoreKeystoreFragment extends Fragment implements TextWatcher, View.OnClickListener {

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
        RestoreKeystoreViewModelFactory aFactory = InjectorModule.provideRestoreKeystoreViewModelFactory();
        mViewModel = ViewModelProviders.of(this, aFactory).get(RestoreKeystoreViewModel.class);

        mViewModel.getRestoreLiveEvent().observe(this, keystoreResource -> {
            if (keystoreResource != null) {
                if (keystoreResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.restoring_accunt));
                } else if (keystoreResource.data != null && keystoreResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    loadNextFragment(keystoreResource.data);
                } else if (keystoreResource.message != null && keystoreResource.status.equals(Status.ERROR)) {
                    mTetPassword.setText("");
                    hideProgressDialog();
                    clearPassword();
                    showSingleActionDialog(AppConstants.VALUE_DEFAULT, keystoreResource.message, AppConstants.VALUE_DEFAULT);
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
}