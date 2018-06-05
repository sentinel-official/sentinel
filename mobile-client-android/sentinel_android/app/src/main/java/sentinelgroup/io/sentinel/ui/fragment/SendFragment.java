package sentinelgroup.io.sentinel.ui.fragment;

import android.annotation.SuppressLint;
import android.arch.lifecycle.ViewModelProviders;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.design.widget.CoordinatorLayout;
import android.support.design.widget.Snackbar;
import android.support.design.widget.TextInputEditText;
import android.support.v4.app.Fragment;
import android.support.v4.content.ContextCompat;
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

    private static final String ARG_IS_VPN_PAY = "is_vpn_pay";
    private static final String ARG_IS_INIT = "is_init";
    private static final String ARG_AMOUNT = "arg_amount";
    private static final String ARG_SESSION_ID = "session_id";

    private boolean mIsVpnPay, mIsInit;
    private String mAmount, mSessionId;

    private SendViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private CoordinatorLayout mRootLayout;
    private CustomSpinner mCsTokens;
    private TextInputEditText mTetToAddress, mTetAmount, mTetGasLimit, mTetPassword;
    private SeekBar mSbGasPrice;
    private TextView mTvGasPrice, mTvGasEstimate;
    private Button mBtnSend;
    private MaterialSpinnerAdapter mAdapter;
    private int mNormal, mFast, mFastest;
    private boolean mTransactionSuccess = false;

    public SendFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @param isVpnPay
     * @param isInit
     * @param iAmount
     * @param iSessionId
     * @return A new instance of fragment SendFragment.
     */
    public static SendFragment newInstance(boolean isVpnPay, boolean isInit, String iAmount, String iSessionId) {
        SendFragment aFragment = new SendFragment();
        Bundle args = new Bundle();
        args.putBoolean(ARG_IS_VPN_PAY, isVpnPay);
        args.putBoolean(ARG_IS_INIT, isInit);
        args.putString(ARG_AMOUNT, iAmount);
        args.putString(ARG_SESSION_ID, iSessionId);
        aFragment.setArguments(args);
        return aFragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mIsVpnPay = getArguments().getBoolean(ARG_IS_VPN_PAY);
            mIsInit = getArguments().getBoolean(ARG_IS_INIT);
            mAmount = getArguments().getString(ARG_AMOUNT);
            mSessionId = getArguments().getString(ARG_SESSION_ID);
        }
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
        setupExtraValue();
    }

    private void initView(View iView) {
        mRootLayout = iView.findViewById(R.id.root_layout);
        mCsTokens = iView.findViewById(R.id.cs_tokens);
        mTetToAddress = iView.findViewById(R.id.tet_to_address);
        mTetAmount = iView.findViewById(R.id.tet_amount);
        mTetGasLimit = iView.findViewById(R.id.tet_gas_limit);
        mTetPassword = iView.findViewById(R.id.tet_password);
        mSbGasPrice = iView.findViewById(R.id.sb_gas_price);
        mTvGasPrice = iView.findViewById(R.id.tv_gas_price);
        mTvGasEstimate = iView.findViewById(R.id.tv_gas_estimate);
        mBtnSend = iView.findViewById(R.id.btn_send);
        // set default values
        mTetGasLimit.setTransformationMethod(null);
        // set listeners
        mCsTokens.addTextChangedListener(this);
        mTetToAddress.addTextChangedListener(this);
        mTetAmount.addTextChangedListener(this);
        mTetPassword.addTextChangedListener(this);
        mSbGasPrice.setOnSeekBarChangeListener(this);
        mBtnSend.setOnClickListener(this);
    }

    private void setGasPrice(int iGasPrice) {
        mSbGasPrice.setProgress(iGasPrice - 1);
        mTvGasPrice.setText(getString(R.string.gwei, iGasPrice));
    }

    private void setupAdapter(boolean iIsChecked) {
        if (getContext() != null) {
            mAdapter = new MaterialSpinnerAdapter(getContext(), generateStringList(iIsChecked));
            mCsTokens.setAdapter(mAdapter);
        }
    }

    private void initViewModel() {
        SendViewModelFactory aFactory = InjectorModule.provideSendViewModelFactory(getContext());
        mViewModel = ViewModelProviders.of(this, aFactory).get(SendViewModel.class);

        mViewModel.getGasEstimateLiveData().observe(this, gasEstimateEntity -> {
            if (gasEstimateEntity != null) {
                mNormal = (int) Float.parseFloat(gasEstimateEntity.getStandard());
                mFast = (int) Float.parseFloat(gasEstimateEntity.getFast());
                mFastest = (int) Float.parseFloat(gasEstimateEntity.getFastest());
            } else {
                mNormal = 10;
                mFast = 15;
                mFastest = 20;
            }
            AppPreferences.getInstance().saveInteger(AppConstants.PREFS_GAS_NORMAL, mNormal);
            AppPreferences.getInstance().saveInteger(AppConstants.PREFS_GAS_FAST, mFast);
            AppPreferences.getInstance().saveInteger(AppConstants.PREFS_GAS_FASTEST, mFastest);
            setGasPrice(mNormal);
            mTvGasEstimate.setText(getGasEstimateText(mNormal));
        });
        mViewModel.getTxDataCreationLiveEvent().observe(this, txDataResource -> {
            if (txDataResource != null) {
                if (txDataResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.signing_transaction));
                } else if (txDataResource.data != null && txDataResource.status.equals(Status.SUCCESS)) {
                    if (mIsVpnPay)
                        mViewModel.makeVpnPay(mIsInit, txDataResource.data, mAmount, mSessionId);
                    else
                        mViewModel.sendAmount(txDataResource.data);
                } else if (txDataResource.message != null && txDataResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    clearForm(false);
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
                    clearForm(true);
                    if (payResponseResource.data.txHashes != null && payResponseResource.data.txHashes.size() > 0)
                        showTransactionStatus(mViewModel.getTransactionStatusUrl(payResponseResource.data.txHashes.get(0)));
                    else if (payResponseResource.data.txHash != null)
                        showTransactionStatus(mViewModel.getTransactionStatusUrl(payResponseResource.data.txHash));
                } else if (payResponseResource.message != null && payResponseResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    showErrorDialog(payResponseResource.message);
                }
            }
        });
    }

    @SuppressLint("ClickableViewAccessibility")
    private void setupExtraValue() {
        mCsTokens.setSelectedPosition(0);
        mCsTokens.setText(mAdapter.getItem(mCsTokens.getSelectedPosition()));
        if (mIsVpnPay) {
            // disable touch listener
            mCsTokens.setOnTouchListener((v, event) -> true);
            // set to address
            mTetToAddress.setText(mViewModel.getSentinelAddress());
            mTetToAddress.setEnabled(false);
            // set amount
            mTetAmount.setText(mAmount);
            mTetAmount.setEnabled(false);
        }
    }

    private void clearForm(boolean iAllContent) {
        mTetPassword.setText("");
        if (iAllContent) {
            mCsTokens.setText("");
            mTetToAddress.setText("");
            mTetAmount.setText("");
            mTetGasLimit.setText("");
        }
    }

    private void showTransactionStatus(Uri iUri) {
        mTransactionSuccess = true;
        Snackbar aSnackbar = Snackbar.make(mRootLayout, R.string.transaction_placed, Snackbar.LENGTH_LONG)
                .setAction(R.string.check_status, v -> {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, iUri));
                    } catch (ActivityNotFoundException ignored) {
                    }
                });
        aSnackbar.setActionTextColor(ContextCompat.getColor(getContext(), R.color.colorButtonOrange));
        aSnackbar.show();
    }


    public void updateAdapterData(boolean iIsChecked) {
        mCsTokens.setAdapter(null);
        setupAdapter(iIsChecked);
        setupExtraValue();
        mCsTokens.setAdapter(null);
        setupAdapter(iIsChecked);
    }

    private List<String> generateStringList(boolean iIsChecked) {
        return Arrays.asList(Objects.requireNonNull(getContext()).getResources().getStringArray(iIsChecked ? R.array.spinner_test_list : R.array.spinner_list));
    }

    private boolean validateGasLimit() {
        String aGasLimit = mTetGasLimit.getText().toString().trim();
        String aToken = mCsTokens.getText().toString().trim();
        if (aToken.contains(AppConstants.SENT) &&
                (!aGasLimit.isEmpty() && Integer.parseInt(aGasLimit) < Integer.parseInt(getString(R.string.gas_limit_sents))) || aGasLimit.isEmpty()) {
            mTetGasLimit.setText(getString(R.string.gas_limit_sents));
        }
        if (aToken.contains(AppConstants.ETH) &&
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
        String aGasPrice = String.valueOf(mSbGasPrice.getProgress() + mNormal);  // in GWei

        if (aTokens.contains("SENT")) {
            mViewModel.createTokenTransaction(aToAddress, aTetAmount, aGasLimit, aPassword, aGasPrice);
        } else if (aTokens.contains("ETH")) {
            mViewModel.createEthTransaction(aToAddress, aTetAmount, aGasLimit, aPassword, aGasPrice);
        }
    }

    private int getGasEstimateText(int iValue) {
        if (iValue >= mFastest)
            return R.string.estimate_fastest;
        else if (iValue >= mFast)
            return R.string.estimate_fast;
        else if (iValue >= mNormal)
            return R.string.estimate_normal;
        else
            return R.string.estimate_low;
    }

    public boolean getTransactionState() {
        return mTransactionSuccess;
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
            mListener.onShowSingleActionDialog(iError);
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
        String aToken = mCsTokens.getText().toString().trim();
        if (!aToken.isEmpty()) {
            if (aToken.contains(AppConstants.SENT)) {
                mTetGasLimit.setText(getString(R.string.gas_limit_sents));
            } else if (aToken.contains(AppConstants.ETH)) {
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
        mTvGasEstimate.setText(getGasEstimateText(progress + 1));
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