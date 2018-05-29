package sentinelgroup.io.sentinel.ui.fragment;

import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
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
import android.widget.TextView;
import android.widget.Toast;

import com.alimuzaffar.lib.pin.PinEntryEditText;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.Status;
import sentinelgroup.io.sentinel.viewmodel.ForgotPinViewModel;
import sentinelgroup.io.sentinel.viewmodel.ForgotPinViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnGenericFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ForgotPinFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ForgotPinFragment extends Fragment implements TextWatcher, PinEntryEditText.OnPinEnteredListener, View.OnClickListener {

    private ForgotPinViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private TextInputEditText mTetPassword;
    private TextView mTvEnterPin, mTvReEnterPin;
    private PinEntryEditText mEtEnterPin, mEtReEnterPin;
    private Button mBtnReset;

    public ForgotPinFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment ForgotPinFragment.
     */
    public static ForgotPinFragment newInstance() {
        return new ForgotPinFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_forgot_pin, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.reset_pin));
        initViewModel();
    }

    private void initView(View iView) {
        mTetPassword = iView.findViewById(R.id.tet_password);
        mTvEnterPin = iView.findViewById(R.id.tv_enter_pin);
        mTvReEnterPin = iView.findViewById(R.id.tv_re_enter_pin);
        mEtEnterPin = iView.findViewById(R.id.et_enter_pin);
        mEtReEnterPin = iView.findViewById(R.id.et_re_enter_pin);
        mBtnReset = iView.findViewById(R.id.btn_reset);
        // Set listeners
        mTetPassword.addTextChangedListener(this);
        mEtEnterPin.addTextChangedListener(this);
        mEtReEnterPin.addTextChangedListener(this);
        mEtEnterPin.setOnPinEnteredListener(this);
        mEtReEnterPin.setOnPinEnteredListener(this);
        mBtnReset.setOnClickListener(this);
    }

    private void initViewModel() {
        ForgotPinViewModelFactory aFactory = InjectorModule.provideForgotPinViewModelFactory(getContext());
        mViewModel = ViewModelProviders.of(this, aFactory).get(ForgotPinViewModel.class);

        mViewModel.getIsPasswordCorrectLiveEvent().observe(this, passwordResource -> {
            if (passwordResource != null) {
                if (passwordResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.verifying_credentials));
                } else if (passwordResource.data != null && passwordResource.status.equals(Status.SUCCESS)) {
                    mViewModel.resetAppPin(Integer.parseInt(mEtEnterPin.getText().toString()));
                } else if (passwordResource.message != null && passwordResource.status.equals(Status.ERROR)) {
                    clearInput();
                    hideProgressDialog();
                    showErrorDialog(passwordResource.message);
                }
            }
        });

        mViewModel.getIsPinResetLiveEvent().observe(this, isPinSetResource -> {
            if (isPinSetResource != null) {
                if (isPinSetResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.resetting_pin));
                } else if (isPinSetResource.data != null && isPinSetResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    if (isPinSetResource.data) {
                        loadNextActivity();
                    } else {
                        clearInput();
                        Toast.makeText(getContext(), AppConstants.GENERIC_ERROR, Toast.LENGTH_SHORT).show();
                    }

                }
            }
        });
    }

    private void clearInput() {
        mTetPassword.setText("");
        mEtEnterPin.setText("");
        mEtReEnterPin.setText("");
    }

    private boolean validatePin(int iPin, int iPin2) {
        if (iPin != iPin2) {
            mEtReEnterPin.setText("");
            showErrorDialog(getString(R.string.pin_mismatch));
            return false;
        } else {
            return true;
        }
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

    public void loadNextActivity() {
        if (mListener != null) {
            mListener.onLoadNextActivity(null);
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
    public void onPinEntered(CharSequence str) {
        mBtnReset.setEnabled(!mTetPassword.getText().toString().isEmpty()
                && !mEtEnterPin.getText().toString().isEmpty()
                && !mEtReEnterPin.getText().toString().isEmpty());
    }

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {

    }

    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {

    }

    @Override
    public void afterTextChanged(Editable s) {
        mTvEnterPin.setVisibility(mEtEnterPin.getText().toString().isEmpty() ? View.VISIBLE : View.INVISIBLE);
        mTvReEnterPin.setVisibility(mEtReEnterPin.getText().toString().isEmpty() ? View.VISIBLE : View.INVISIBLE);
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.btn_reset) {
            String aPassword = mTetPassword.getText().toString().trim();
            int aPin = Integer.parseInt(mEtEnterPin.getText().toString().trim());
            int aPin2 = Integer.parseInt(mEtReEnterPin.getText().toString().trim());
            if (validatePin(aPin, aPin2)) {
                mViewModel.verifyKeystorePassword(aPassword);
            }
        }
    }
}
