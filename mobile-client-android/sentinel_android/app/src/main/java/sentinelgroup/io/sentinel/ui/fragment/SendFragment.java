package sentinelgroup.io.sentinel.ui.fragment;

import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
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
import android.widget.SeekBar;
import android.widget.TextView;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.ui.adapter.MaterialSpinnerAdapter;
import sentinelgroup.io.sentinel.ui.custom.CustomSpinner;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Status;
import sentinelgroup.io.sentinel.viewmodel.SendViewModel;
import sentinelgroup.io.sentinel.viewmodel.SendViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnGenericFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link SendFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class SendFragment extends Fragment implements TextWatcher, SeekBar.OnSeekBarChangeListener, View.OnClickListener {

    private SendViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private CustomSpinner mCsTokens;
    private TextInputEditText mTetToAddress, mTetAmount, mTetGasLimit, mTetPassword;
    private SeekBar mSbGasPrice;
    private TextView mTvGasPrice;
    private Button mBtnSend;

    public SendFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment SendFragment.
     */
    public static SendFragment newInstance() {
        return new SendFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_send, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.send));
        setupAdapter(AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE));
        initViewModel();
    }

    private void initView(View iView) {
        mCsTokens = iView.findViewById(R.id.cs_tokens);
        mTetToAddress = iView.findViewById(R.id.tet_to_address);
        mTetAmount = iView.findViewById(R.id.tet_amount);
        mTetGasLimit = iView.findViewById(R.id.tet_gas_limit);
        mTetPassword = iView.findViewById(R.id.tet_password);
        mSbGasPrice = iView.findViewById(R.id.sb_gas_price);
        mTvGasPrice = iView.findViewById(R.id.tv_gas_price);
        mBtnSend = iView.findViewById(R.id.btn_send);
        // set default values
        mSbGasPrice.setProgress(19);
        mTetGasLimit.setTransformationMethod(null);
        // set listeners
        mCsTokens.addTextChangedListener(this);
        mTetToAddress.addTextChangedListener(this);
        mTetAmount.addTextChangedListener(this);
        mTetPassword.addTextChangedListener(this);
        mSbGasPrice.setOnSeekBarChangeListener(this);
        mBtnSend.setOnClickListener(this);
    }

    private void initViewModel() {
        SendViewModelFactory aFactory = InjectorModule.provideSendViewModelFactory();
        mViewModel = ViewModelProviders.of(this, aFactory).get(SendViewModel.class);

        mViewModel.getTxDataCreationLiveEvent().observe(this, txDataResource -> {
            if (txDataResource != null) {
                if (txDataResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.signing_transaction));
                } else if (txDataResource.data != null && txDataResource.status.equals(Status.SUCCESS)) {
                    mViewModel.sendAmount(txDataResource.data);
                } else if (txDataResource.message != null && txDataResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    showErrorDialog(txDataResource.message);
                }
            }
        });
        mViewModel.getTransactionLiveEvent().observe(this, payResponseResource -> {
            if (payResponseResource != null) {
                if (payResponseResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.sending));
                } else if (payResponseResource.data != null && payResponseResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    showTransactionStatus(mViewModel.getTransactionStatusUrl(payResponseResource.data.tx_hash));
                } else if (payResponseResource.message != null && payResponseResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    showErrorDialog(payResponseResource.message);
                }
            }
        });
    }

    private void showTransactionStatus(Uri iUri) {
        Intent intent = new Intent(Intent.ACTION_VIEW, iUri);
        startActivity(intent);
    }

    public void updateAdapterData(boolean iIsChecked) {
        mCsTokens.setText("");
        mCsTokens.setAdapter(null);
        setupAdapter(iIsChecked);
    }

    private List<String> generateStringList(boolean iIsChecked) {
        return Arrays.asList(Objects.requireNonNull(getContext()).getResources().getStringArray(iIsChecked ? R.array.spinner_test_list : R.array.spinner_list));
    }

    private void setupAdapter(boolean iIsChecked) {
        MaterialSpinnerAdapter aAdapter = new MaterialSpinnerAdapter(getContext(), generateStringList(iIsChecked));
        mCsTokens.setAdapter(aAdapter);
    }

    private boolean validateGasLimit() {
        String aGasLimit = mTetGasLimit.getText().toString().trim();
        String aToken = mCsTokens.getText().toString().trim();
        if (aToken.contains("SENT") &&
                (!aGasLimit.isEmpty() && Integer.parseInt(aGasLimit) < Integer.parseInt(getString(R.string.gas_limit_sents))) || aGasLimit.isEmpty()) {
            mTetGasLimit.setText(getString(R.string.gas_limit_sents));
        }
        if (aToken.contains("ETH") &&
                (!aGasLimit.isEmpty() && Integer.parseInt(aGasLimit) < Integer.parseInt(getString(R.string.gas_limit_eth))) || aGasLimit.isEmpty()) {
            mTetGasLimit.setText(getString(R.string.gas_limit_eth));
        }
        return true;
    }

    private void offlineTransactionSigning() {
        String aTokens = mCsTokens.getText().toString().trim();
        String aToAddress = mTetToAddress.getText().toString().trim();
        String aTetAmount = mTetAmount.getText().toString().trim();
        String aGasLimit = mTetGasLimit.getText().toString().trim();
        String aPassword = mTetPassword.getText().toString().trim();
        String aGasPrice = String.valueOf(mSbGasPrice.getProgress() + 1);  // in GWei

        if (aTokens.contains("SENT")) {
            mViewModel.createTokenTransaction(aToAddress, aTetAmount, aGasLimit, aPassword, aGasPrice);
        } else if (aTokens.contains("eth")) {
            mViewModel.createEthTransaction(aToAddress, aTetAmount, aGasLimit, aPassword, aGasPrice);
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
        String aToken = mCsTokens.getText().toString().trim();
        if (!aToken.isEmpty()) {
            if (aToken.contains("SENT")) {
                mTetGasLimit.setText(getString(R.string.gas_limit_sents));
            } else if (aToken.contains("ETH")) {
                mTetGasLimit.setText(getString(R.string.gas_limit_eth));
            }
        }
        mBtnSend.setEnabled(!mCsTokens.getText().toString().trim().isEmpty()
                && !mTetToAddress.getText().toString().trim().isEmpty()
                && !mTetAmount.getText().toString().trim().isEmpty()
                && !mTetGasLimit.getText().toString().trim().isEmpty()
                && !mTetPassword.getText().toString().trim().isEmpty());
    }

    @Override
    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
        mTvGasPrice.setText(getString(R.string.gwei, progress + 1));
    }

    @Override
    public void onStartTrackingTouch(SeekBar seekBar) {

    }

    @Override
    public void onStopTrackingTouch(SeekBar seekBar) {

    }

    @Override
    public void onClick(View v) {
        if (validateGasLimit())
            offlineTransactionSigning();
    }
}