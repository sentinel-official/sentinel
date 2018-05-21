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
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.viewmodel.SetPinViewModel;
import sentinelgroup.io.sentinel.viewmodel.SetPinViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link SetPinFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class SetPinFragment extends Fragment implements View.OnClickListener, PinEntryEditText.OnPinEnteredListener, TextWatcher {

    private SetPinViewModel mViewModel;

    private static final String ARG_ACC_ADDRESS = "account_address";

    private String mAccountAddress;

    private CreateAuidFragment.OnFragmentInteractionListener mListener;

    private PinEntryEditText mEtPin, mEtPin2;
    private TextView mTvPin, mTvPin2;
    private Button mBtnSave;

    public SetPinFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param iAccountAddress Parameter 1.
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
        mEtPin = iView.findViewById(R.id.et_enter_pin);
        mEtPin2 = iView.findViewById(R.id.et_re_enter_pin);
        mTvPin = iView.findViewById(R.id.tv_enter_pin);
        mTvPin2 = iView.findViewById(R.id.tv_re_enter_pin);
        mBtnSave = iView.findViewById(R.id.btn_save);
        // Set listeners
        mEtPin.setOnPinEnteredListener(this);
        mEtPin2.setOnPinEnteredListener(this);
        mEtPin.addTextChangedListener(this);
        mEtPin2.addTextChangedListener(this);
        mBtnSave.setOnClickListener(this);
    }

    private void initViewModel() {
        SetPinViewModelFactory aFactory = InjectorModule.provideSetPinViewModelFactory(getContext());
        mViewModel = ViewModelProviders.of(this, aFactory).get(SetPinViewModel.class);

        mViewModel.getIsPinSetLiveEvent().observe(this, isPinSet -> {
            if (isPinSet != null) {
                AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_APP_PIN_SET, isPinSet);
                if (isPinSet) {
                    loadNextActivity();
                } else {
                    Toast.makeText(getContext(), R.string.generic_error_message, Toast.LENGTH_SHORT).show();
                    toggleEnabledState(true);
                }
            }
        });
    }

    private boolean validatePin(int iPin, int iPin2) {
        if (iPin != iPin2) {
            showErrorDialog(getString(R.string.pin_mismatch));
            return false;
        } else {
            return true;
        }
    }

    private void toggleEnabledState(boolean iEnabled) {
        mBtnSave.setEnabled(iEnabled);
        mTvPin.setEnabled(iEnabled);
        mTvPin2.setEnabled(iEnabled);
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
        if (context instanceof CreateAuidFragment.OnFragmentInteractionListener) {
            mListener = (CreateAuidFragment.OnFragmentInteractionListener) context;
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
    public void onPinEntered(CharSequence str) {
        mBtnSave.setEnabled(!mEtPin.getText().toString().isEmpty() && !mEtPin2.getText().toString().isEmpty());
    }

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {

    }

    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {

    }

    @Override
    public void afterTextChanged(Editable s) {
        mTvPin.setVisibility(mEtPin.getText().toString().isEmpty() ? View.VISIBLE : View.INVISIBLE);
        mTvPin2.setVisibility(mEtPin2.getText().toString().isEmpty() ? View.VISIBLE : View.INVISIBLE);
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.btn_save) {
            toggleEnabledState(false);
            int aPin = Integer.parseInt(mEtPin.getText().toString().trim());
            int aPin2 = Integer.parseInt(mEtPin2.getText().toString().trim());
            if (validatePin(aPin, aPin2)) {
                mViewModel.setAppPin(aPin, mAccountAddress);
            }
        }
    }
}