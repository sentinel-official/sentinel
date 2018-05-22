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
import sentinelgroup.io.sentinel.viewmodel.ResetPinViewModel;
import sentinelgroup.io.sentinel.viewmodel.ResetPinViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link ResetPinFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link ResetPinFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ResetPinFragment extends Fragment implements TextWatcher, PinEntryEditText.OnPinEnteredListener, View.OnClickListener {

    private ResetPinViewModel mViewModel;

    private OnFragmentInteractionListener mListener;

    private TextView mTvOldPin, mTvEnterPin, mTvReEnterPin;
    private PinEntryEditText mEtOldPin, mEtEnterPin, mEtReEnterPin;
    private Button mBtnReset;

    public ResetPinFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment ResetPinFragment.
     */
    public static ResetPinFragment newInstance() {
        return new ResetPinFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_reset_pin, container, false);
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
        mTvOldPin = iView.findViewById(R.id.tv_old_pin);
        mTvEnterPin = iView.findViewById(R.id.tv_enter_pin);
        mTvReEnterPin = iView.findViewById(R.id.tv_re_enter_pin);
        mEtOldPin = iView.findViewById(R.id.et_old_pin);
        mEtEnterPin = iView.findViewById(R.id.et_enter_pin);
        mEtReEnterPin = iView.findViewById(R.id.et_re_enter_pin);
        mBtnReset = iView.findViewById(R.id.btn_reset);
        // Set listeners
        mEtOldPin.addTextChangedListener(this);
        mEtEnterPin.addTextChangedListener(this);
        mEtReEnterPin.addTextChangedListener(this);
        mEtEnterPin.setOnPinEnteredListener(this);
        mEtReEnterPin.setOnPinEnteredListener(this);
        mBtnReset.setOnClickListener(this);
    }

    private void initViewModel() {
        ResetPinViewModelFactory aFactory = InjectorModule.provideResetPinViewModelFactory(getContext());
        mViewModel = ViewModelProviders.of(this, aFactory).get(ResetPinViewModel.class);

        mViewModel.getIsPinCorrectLiveEvent().observe(this, isPinCorrect -> {
            if (isPinCorrect != null) {
                if (isPinCorrect) {
                    resetAppPin();
                } else {
                    clearInput();
                    toggleEnabledState(true);
                    showErrorDialog(getString(R.string.wrong_old_pin));
                }
            }
        });

        mViewModel.getIsPinResetLiveEvent().observe(this, isPinSet -> {
            if (isPinSet != null) {
                if (isPinSet) {
                    loadNextActivity();
                } else {
                    clearInput();
                    toggleEnabledState(true);
                    Toast.makeText(getContext(), R.string.generic_error_message, Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    private void resetAppPin() {
        int aOldPin = Integer.parseInt(mEtOldPin.getText().toString());
        int aNewPin = Integer.parseInt(mEtEnterPin.getText().toString());
        mViewModel.resetAppPin(aOldPin, aNewPin);
    }

    private void clearInput() {
        mEtOldPin.setText("");
        mEtEnterPin.setText("");
        mEtReEnterPin.setText("");
    }

    private void toggleEnabledState(boolean iEnabled) {
        mBtnReset.setEnabled(iEnabled);
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

    public void fragmentLoaded(String iTitle) {
        if (mListener != null) {
            mListener.onFragmentLoaded(iTitle);
        }
    }

    public void showErrorDialog(String iError) {
        if (mListener != null) {
            mListener.onShowErrorDialog(iError);
        }
    }

    public void loadNextActivity() {
        if (mListener != null) {
            mListener.onLoadNextActivity();
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
        mTvOldPin.setVisibility(mEtOldPin.getText().toString().isEmpty() ? View.VISIBLE : View.INVISIBLE);
        mTvEnterPin.setVisibility(mEtEnterPin.getText().toString().isEmpty() ? View.VISIBLE : View.INVISIBLE);
        mTvReEnterPin.setVisibility(mEtReEnterPin.getText().toString().isEmpty() ? View.VISIBLE : View.INVISIBLE);
    }

    @Override
    public void onPinEntered(CharSequence str) {
        mBtnReset.setEnabled(!mEtOldPin.getText().toString().isEmpty() && !mEtEnterPin.getText().toString().isEmpty() && !mEtReEnterPin.getText().toString().isEmpty());
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.btn_reset) {
            toggleEnabledState(false);
            int aOldPin = Integer.parseInt(mEtOldPin.getText().toString().trim());
            int aPin = Integer.parseInt(mEtEnterPin.getText().toString().trim());
            int aPin2 = Integer.parseInt(mEtReEnterPin.getText().toString().trim());
            if (validatePin(aPin, aPin2)) {
                mViewModel.verifyOldPin(aOldPin);
            }
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

        void onShowErrorDialog(String iError);

        void onLoadNextActivity();
    }
}
