package sentinelgroup.io.sentinel.ui.fragment;

import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.network.model.Balance;
import sentinelgroup.io.sentinel.ui.activity.ReceiveActivity;
import sentinelgroup.io.sentinel.ui.activity.SendActivity;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Status;
import sentinelgroup.io.sentinel.viewmodel.WalletViewModel;
import sentinelgroup.io.sentinel.viewmodel.WalletViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnGenericFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link WalletFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class WalletFragment extends Fragment implements View.OnClickListener {

    private WalletViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private TextView mTvAddress, mTvTotalSent, mTvTotalEther, mTvTotalSentDesc, mTvTotalEtherDesc;

    public WalletFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment WalletFragment.
     */
    public static WalletFragment newInstance() {
        return new WalletFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_wallet, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        setTextDesc(AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE));
        initViewModel();
    }

    private void initView(View iView) {
        mTvAddress = iView.findViewById(R.id.tv_address);
        mTvTotalSent = iView.findViewById(R.id.tv_total_sent);
        mTvTotalEther = iView.findViewById(R.id.tv_total_ether);
        mTvTotalSentDesc = iView.findViewById(R.id.tv_total_sent_desc);
        mTvTotalEtherDesc = iView.findViewById(R.id.tv_total_ether_desc);
        // set address
        mTvAddress.setText(AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS));
        // Set listeners
        iView.findViewById(R.id.ib_copy_address).setOnClickListener(this);
        iView.findViewById(R.id.btn_send).setOnClickListener(this);
        iView.findViewById(R.id.btn_receive).setOnClickListener(this);
    }

    private void initViewModel() {
        WalletViewModelFactory aFactory = InjectorModule.provideWalletViewModelFactory();
        mViewModel = ViewModelProviders.of(this, aFactory).get(WalletViewModel.class);

        mViewModel.getBalanceLiveData().observe(this, balanceResource -> {
            if (balanceResource != null) {
                if (balanceResource.data != null && balanceResource.status.equals(Status.SUCCESS)) {
                    setBalanceValue(balanceResource.data);
                } else if (balanceResource.status.equals(Status.ERROR) && balanceResource.message != null) {
                    Toast.makeText(getContext(), balanceResource.message, Toast.LENGTH_SHORT).show();
                }
            }
        });

        mViewModel.getTokenAlertLiveEvent().observe(this, isTokenRequested -> {
            if (isTokenRequested != null && isTokenRequested) {
                showErrorDialog(getString(R.string.free_token_requested));
            }
        });
    }

    private void setBalanceValue(Balance iData) {
        boolean aIsChecked = AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE);
        mTvTotalEther.setText(mViewModel.getFormattedEthBalance(aIsChecked ? iData.balances.rinkeby.eths : iData.balances.main.eths));
        mTvTotalSent.setText(mViewModel.getFormattedSentBalance(aIsChecked ? iData.balances.rinkeby.sents : iData.balances.main.sents));
        setTextDesc(aIsChecked);
    }

    private void setTextDesc(boolean iIsChecked) {
        mTvTotalSentDesc.setText(iIsChecked ? R.string.test_sent_desc : R.string.sent_desc);
        mTvTotalEtherDesc.setText(iIsChecked ? R.string.test_eth_desc : R.string.eth_desc);
    }

    public void updateBalance() {
        mViewModel.updateBalance();
    }

    // Interface interaction methods
    public void showErrorDialog(String iError) {
        if (mListener != null) {
            mListener.onShowErrorDialog(iError);
        }
    }

    public void copyToClipboard(String iCopyString) {
        if (mListener != null) {
            mListener.onCopyToClipboardClicked(iCopyString);
        }
    }

    public void loadNextActivity(Intent iIntent) {
        if (mListener != null) {
            mListener.onLoadNextActivity(iIntent);
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
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.ib_copy_address:
                if (!mTvAddress.getText().toString().isEmpty())
                    copyToClipboard(mTvAddress.getText().toString());
                break;

            case R.id.btn_send:
                loadNextActivity(new Intent(getActivity(),SendActivity.class));
                break;

            case R.id.btn_receive:
                loadNextActivity(new Intent(getActivity(),ReceiveActivity.class));
                break;
        }
    }
}
