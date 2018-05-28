package sentinelgroup.io.sentinel.ui.fragment;

import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
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
import sentinelgroup.io.sentinel.ui.activity.DashboardActivity;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Status;
import sentinelgroup.io.sentinel.viewmodel.SetPinViewModel;
import sentinelgroup.io.sentinel.viewmodel.SetPinViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnGenericFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link SetPinFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class SetPinFragment extends Fragment implements View.OnClickListener, PinEntryEditText.OnPinEnteredListener, TextWatcher {
    private static final String ARG_ACC_ADDRESS = "account_address";

    private String mAccountAddress;

    private SetPinViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private PinEntryEditText mEtEnterPin, mEtReEnterPin;
    private TextView mTvPin, mTvPin2;
    private Button mBtnSave;

    public SetPinFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param iAccountAddress Account Address.
     * @return A new instance of fragment SetPinFragment.
     */
    public static SetPinFragment newInstance(String iAccountAddress) {
        SetPinFragment fragment = new SetPinFragment();
        Bundle args = new Bundle();
        args.putString(ARG_ACC_ADDRESS, iAccountAddress);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mAccountAddress = getArguments().getString(ARG_ACC_ADDRESS);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_set_pin, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.set_app_pin));
        initViewModel();
    }

    private void initView(View iView) {
        mEtEnterPin = iView.findViewById(R.id.et_enter_pin);
        mEtReEnterPin = iView.findViewById(R.id.et_re_enter_pin);
        mTvPin = iView.findViewById(R.id.tv_enter_pin);
        mTvPin2 = iView.findViewById(R.id.tv_re_enter_pin);
        mBtnSave = iView.findViewById(R.id.btn_save);
        // Set listeners
        mEtEnterPin.setOnPinEnteredListener(this);
        mEtReEnterPin.setOnPinEnteredListener(this);
        mEtEnterPin.addTextChangedListener(this);
        mEtReEnterPin.addTextChangedListener(this);
        mBtnSave.setOnClickListener(this);
    }

    private void initViewModel() {
        SetPinViewModelFactory aFactory = InjectorModule.provideSetPinViewModelFactory(getContext());
        mViewModel = ViewModelProviders.of(this, aFactory).get(SetPinViewModel.class);

        mViewModel.getIsPinSetLiveEvent().observe(this, isPinSetResource -> {
            if (isPinSetResource != null) {
                if (isPinSetResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.setting_pin));
                } else if (isPinSetResource.data != null && isPinSetResource.status.equals(Status.SUCCESS)) {
                    AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_APP_PIN_SET, isPinSetResource.data);
                    hideProgressDialog();
                    if (isPinSetResource.data) {
                        loadNextActivity(DashboardActivity.class);
                    } else {
                        clearInput();
                        Toast.makeText(getContext(), R.string.generic_error_message, Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });
    }

    private void clearInput() {
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

    public void loadNextActivity(Class<?> iActivity) {
        if (mListener != null) {
            mListener.onLoadNextActivity(iActivity);
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
        mBtnSave.setEnabled(!mEtEnterPin.getText().toString().isEmpty()
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
        mTvPin.setVisibility(mEtEnterPin.getText().toString().isEmpty() ? View.VISIBLE : View.INVISIBLE);
        mTvPin2.setVisibility(mEtReEnterPin.getText().toString().isEmpty() ? View.VISIBLE : View.INVISIBLE);
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.btn_save) {
            int aPin = Integer.parseInt(mEtEnterPin.getText().toString().trim());
            int aPin2 = Integer.parseInt(mEtReEnterPin.getText().toString().trim());
            if (validatePin(aPin, aPin2)) {
                mViewModel.setAppPin(aPin, mAccountAddress);
            }
        }
    }
}