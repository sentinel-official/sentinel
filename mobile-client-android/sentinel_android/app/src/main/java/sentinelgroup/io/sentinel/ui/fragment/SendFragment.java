package sentinelgroup.io.sentinel.ui.fragment;

import android.content.Context;
import android.os.AsyncTask;
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

import org.web3j.crypto.CipherException;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.WalletUtils;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.Web3jFactory;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGasPrice;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.protocol.http.HttpService;

import java.io.IOException;
import java.lang.ref.WeakReference;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ExecutionException;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.adapter.MaterialSpinnerAdapter;
import sentinelgroup.io.sentinel.ui.custom.CustomSpinner;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link SendFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link SendFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class SendFragment extends Fragment implements TextWatcher, SeekBar.OnSeekBarChangeListener, View.OnClickListener {

    private OnFragmentInteractionListener mListener;

    private CustomSpinner mCsTokens;
    private TextInputEditText mTetToAddress, mTetAmount, mTetGasLimit, mTetPassword;
    private SeekBar mSbGasPrice;
    private TextView mTvGasPrice;
    private Button mBtnSend;

    //    private ArrayAdapter<String> mAdapter;
    private MaterialSpinnerAdapter mAdapter;

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
        // set listeners
        mCsTokens.addTextChangedListener(this);
        mTetToAddress.addTextChangedListener(this);
        mTetAmount.addTextChangedListener(this);
        mTetGasLimit.addTextChangedListener(this);
        mTetPassword.addTextChangedListener(this);
        mSbGasPrice.setOnSeekBarChangeListener(this);
        mBtnSend.setOnClickListener(this);
    }

    private void setupAdapter(boolean iIsChecked) {
        mAdapter = new MaterialSpinnerAdapter(getContext(), generateStringList(iIsChecked));
        mCsTokens.setAdapter(mAdapter);
    }

    private List<String> generateStringList(boolean iIsChecked) {
        return Arrays.asList(Objects.requireNonNull(getContext()).getResources().getStringArray(iIsChecked ? R.array.spinner_test_list : R.array.spinner_list));
    }

    public void updateAdapterData(boolean iIsChecked) {
        mCsTokens.setText("");
        mCsTokens.setAdapter(null);
        setupAdapter(iIsChecked);
    }

    private void initViewModel() {

    }

    private void toggleEnabledState(boolean iEnabled) {
        mBtnSend.setEnabled(iEnabled);
    }

    private void offlineTransactionSigning() {
        String aTokens = mCsTokens.getText().toString();
        String aToAddress = mTetToAddress.getText().toString();
        String aTetAmount = mTetAmount.getText().toString();
        String aGasLimit = mTetGasLimit.getText().toString();
        String aPassword = mTetPassword.getText().toString();
        int aGasPrice = mSbGasPrice.getProgress() + 1;  // in GWei

        boolean aBoolean = AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE);
        new OfflineTransactionSigningTask(this, aBoolean).execute();
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
            mListener.onShowErrorDialog(iError);
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
//        toggleEnabledState(false);
        offlineTransactionSigning();
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

        void onLoadNextActivity();
    }

    private static class OfflineTransactionSigningTask extends AsyncTask<Void, Void, String> {
        WeakReference<SendFragment> mWeakReference;
        boolean mIsChecked;

        OfflineTransactionSigningTask(SendFragment iFragment, boolean isChecked) {
            mWeakReference = new WeakReference<>(iFragment);
            mIsChecked = isChecked;
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            mWeakReference.get().toggleProgressDialog(true);
        }

        @Override
        protected String doInBackground(Void... voids) {
            Web3j web3j = mIsChecked
                    ? Web3jFactory.build(new HttpService("https://mainnet.infura.io/aiAxnxbpJ4aG0zed1aMy"))
                    : Web3jFactory.build(new HttpService("https://rinkeby.infura.io/aiAxnxbpJ4aG0zed1aMy"));
            String message;
            try {
                // verify password and keystore file
                Credentials credentials = WalletUtils.loadCredentials("1234", AppPreferences.getInstance().getString(AppConstants.PREFS_FILE_PATH));
                // get nonce
                EthGetTransactionCount ethGetTransactionCount = web3j.ethGetTransactionCount(credentials.getAddress(), DefaultBlockParameterName.LATEST).sendAsync().get();
                BigInteger nonce = ethGetTransactionCount.getTransactionCount();
                // get gas price
                EthGasPrice ethGasPrice = web3j.ethGasPrice().sendAsync().get();
                BigInteger gasPrice = ethGasPrice.getGasPrice();
                //gas limit
                BigInteger gasLimit = BigInteger.valueOf(21000);
                // get to address
                String to = "0x4819b11c320f2ecd05cfc71e9a34bd24b6180bb1";
                // get value
//                BigInteger value = BigInteger.valueOf(0.001);
                // create raw transaction object
//                RawTransaction rawTransaction = RawTransaction.createEtherTransaction(nonce, gasPrice, gasLimit, to, value);

                message = String.valueOf(gasPrice);
            } catch (IOException | CipherException | InterruptedException | ExecutionException e) {
                message = e.getLocalizedMessage();
            }

            return message;
        }

        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);
            if (mWeakReference.get() != null) {
                mWeakReference.get().toggleProgressDialog(false);
                mWeakReference.get().showErrorDialog(s);
            }
        }
    }
}
