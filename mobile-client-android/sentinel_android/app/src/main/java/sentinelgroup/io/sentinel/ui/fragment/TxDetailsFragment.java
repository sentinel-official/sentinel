package sentinelgroup.io.sentinel.ui.fragment;


import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

import java.util.Locale;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.network.model.TxResult;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Convert;
import sentinelgroup.io.sentinel.util.Converter;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link TxDetailsFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class TxDetailsFragment extends Fragment implements View.OnClickListener {
    private static final String ARG_TX_DATA = "tx_data";

    private TxResult mTxData;

    private OnGenericFragmentInteractionListener mListener;

    private TextView mTvSource, mTvDateTime, mTvTxStatus, mTvFrom, mTvTo, mTvTxHash, mTvAmount, mTvGasPrice;
    private ImageButton mIbCopyFrom, mIbCopyTo, mIbCopyTxHash;
    private Button mBtnOpenEtherscan;

    private String mAddress;

    public TxDetailsFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @return A new instance of fragment TxDetailsFragment.
     */
    public static TxDetailsFragment newInstance(TxResult param1) {
        TxDetailsFragment fragment = new TxDetailsFragment();
        Bundle args = new Bundle();
        args.putSerializable(ARG_TX_DATA, param1);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mTxData = (TxResult) getArguments().getSerializable(ARG_TX_DATA);
            mAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_tx_details, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.tx_details));
        loadData();
    }

    private void initView(View iView) {
        mTvSource = iView.findViewById(R.id.tv_source);
        mTvDateTime = iView.findViewById(R.id.tv_date_time);
        mTvTxStatus = iView.findViewById(R.id.tv_tx_status);
        mTvFrom = iView.findViewById(R.id.tv_from);
        mTvTo = iView.findViewById(R.id.tv_to);
        mTvTxHash = iView.findViewById(R.id.tv_tx_hash);
        mTvAmount = iView.findViewById(R.id.tv_amount);
        mTvGasPrice = iView.findViewById(R.id.tv_gas_price);
        mIbCopyFrom = iView.findViewById(R.id.ib_copy_from);
        mIbCopyTo = iView.findViewById(R.id.ib_copy_to);
        mIbCopyTxHash = iView.findViewById(R.id.ib_copy_tx_hash);
        mBtnOpenEtherscan = iView.findViewById(R.id.btn_open_etherscan);
        // set listeners
        mIbCopyFrom.setOnClickListener(this);
        mIbCopyTo.setOnClickListener(this);
        mIbCopyTxHash.setOnClickListener(this);
        mBtnOpenEtherscan.setOnClickListener(v -> {
            String aUriString = String.format(Locale.US, AppConstants.ETHERSCAN_URL_BUILDER, mTxData.isEth ? mTxData.hash : mTxData.transactionHash);
            try {
                startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(aUriString)));
            } catch (ActivityNotFoundException ignored) {
            }
        });
    }

    private void loadData() {
        if (mTxData.isEth) {
            boolean isReceivedTransaction = mTxData.to.equalsIgnoreCase(mAddress);
            mTvSource.setText(isReceivedTransaction ? R.string.receive_eth : R.string.send_eth);
            mTvDateTime.setText(Converter.convertEpochToDate(Long.parseLong(mTxData.timeStamp)));
            mTvTxStatus.setText(mTxData.txReceiptStatus.equals("1") ? R.string.status_success : R.string.status_fail);
            mTvFrom.setText(mTxData.from);
            mTvTo.setText(mTxData.to);
            mTvTxHash.setText(mTxData.hash);
            String aValue = Convert.fromWei(mTxData.value, Convert.EtherUnit.ETHER).toPlainString();
            mTvAmount.setText(getString(R.string.eths, aValue));
            double aGas = Double.parseDouble(Convert.fromWei(mTxData.gasPrice, Convert.EtherUnit.GWEI).toPlainString());
            mTvGasPrice.setText(getString(R.string.gwei, ((int) aGas)));
        } else {
            String aFromAddress = mTxData.topics.get(1);
            String aToAddress = mTxData.topics.get(2);
            String aMyAddress = Converter.get64bitAddress(mAddress.substring(2));
            boolean isReceivedTransaction = aToAddress.equalsIgnoreCase(aMyAddress);
            mTvSource.setText(isReceivedTransaction ? R.string.receive_sent : R.string.send_sent);
            String aTimeStamp = Converter.convertHexToString(mTxData.timeStamp);
            mTvDateTime.setText(Converter.convertEpochToDate(Long.parseLong(aTimeStamp)));
            mTvTxStatus.setText(R.string.status_success);
            String aFrom = aFromAddress.substring(2).replaceFirst("^0+(?!$)", "");
            mTvFrom.setText(String.format("0x%s", aFrom));
            String aTo = aToAddress.substring(2).replaceFirst("^0+(?!$)", "");
            mTvTo.setText(String.format("0x%s", aTo));
            mTvTxHash.setText(mTxData.transactionHash);
            String aValue = Converter.getFormattedSentBalance(Double.parseDouble(Converter.convertHexToString(mTxData.data)));
            mTvAmount.setText(getString(R.string.sents, aValue));
            String s = Converter.convertHexToString(mTxData.gasPrice);
            double aGas = Double.parseDouble(Convert.fromWei(s, Convert.EtherUnit.GWEI).toPlainString());
            mTvGasPrice.setText(getString(R.string.gwei, ((int) aGas)));
        }
    }

    // Interface interaction methods
    public void fragmentLoaded(String iTitle) {
        if (mListener != null) {
            mListener.onFragmentLoaded(iTitle);
        }
    }

    public void copyToClipboard(String iCopyString, int iToastTextId) {
        if (mListener != null) {
            mListener.onCopyToClipboardClicked(iCopyString, iToastTextId);
        }
    }

    public void hideProgressDialog() {
        if (mListener != null) {
            mListener.onHideProgressDialog();
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
    public void onClick(View v) {
        String aCopyString = "";
        int aToastId = 0;
        switch (v.getId()) {
            case R.id.ib_copy_from:
                aCopyString = mTvFrom.getText().toString().trim();
                aToastId = R.string.address_copied;
                break;
            case R.id.ib_copy_to:
                aCopyString = mTvTo.getText().toString().trim();
                aToastId = R.string.address_copied;
                break;
            case R.id.ib_copy_tx_hash:
                aCopyString = mTvTxHash.getText().toString().trim();
                aToastId = R.string.hash_copied;
                break;
        }
        copyToClipboard(aCopyString, aToastId);
    }
}
