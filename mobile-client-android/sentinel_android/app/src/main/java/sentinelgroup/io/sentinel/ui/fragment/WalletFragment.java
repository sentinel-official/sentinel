package sentinelgroup.io.sentinel.ui.fragment;

import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.network.model.Chains;
import sentinelgroup.io.sentinel.ui.activity.ReceiveActivity;
import sentinelgroup.io.sentinel.ui.activity.SendActivity;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
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

    private SwipeRefreshLayout mSrReload;
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
        mSrReload = iView.findViewById(R.id.sr_reload);
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
        // setup swipe to refresh layout
        mSrReload.setOnRefreshListener(() -> {
            mViewModel.reloadBalance();
            mSrReload.setRefreshing(false);
        });
    }

    private void initViewModel() {
        WalletViewModelFactory aFactory = InjectorModule.provideWalletViewModelFactory(getContext());
        mViewModel = ViewModelProviders.of(this, aFactory).get(WalletViewModel.class);

        mViewModel.getBalanceLiveData().observe(this, balance -> {
            if (balance != null) {
                setBalanceValue(balance);
            }
        });

        mViewModel.getBalanceErrorLiveEvent().observe(this, balanceError -> {
            if (balanceError != null) {
                showSingleActionDialog(AppConstants.VALUE_DEFAULT, balanceError, AppConstants.VALUE_DEFAULT);
            }
        });
    }

    private void setBalanceValue(Chains iData) {
        if (iData != null) {
            boolean aIsChecked = AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE);
            mTvTotalEther.setText(mViewModel.getFormattedEthBalance(aIsChecked ? iData.getRinkeby().eths : iData.getMain().eths));
            mTvTotalSent.setText(mViewModel.getFormattedSentBalance(aIsChecked ? iData.getRinkeby().sents : iData.getMain().sents));
            setTextDesc(aIsChecked);
        }
    }

    private void setTextDesc(boolean iIsChecked) {
        mTvTotalSentDesc.setText(iIsChecked ? R.string.test_sent_desc : R.string.sent_desc);
        mTvTotalEtherDesc.setText(iIsChecked ? R.string.test_eth_desc : R.string.eth_desc);
    }

    public void updateBalance() {
        setBalanceValue(mViewModel.updateBalance());
    }

    public void reloadBalance() {
        mViewModel.reloadBalance();
    }

    // Interface interaction methods
    public void showSingleActionDialog(int iTitleId, String iMessage, int iPositiveOptionId) {
        if (mListener != null) {
            mListener.onShowSingleActionDialog(iTitleId, iMessage, iPositiveOptionId);
        }
    }

    public void copyToClipboard(String iCopyString, int iToastTextId) {
        if (mListener != null) {
            mListener.onCopyToClipboardClicked(iCopyString, iToastTextId);
        }
    }

    public void loadNextActivity(Intent iIntent, int iReqCode) {
        if (mListener != null) {
            mListener.onLoadNextActivity(iIntent, iReqCode);
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
                    copyToClipboard(mTvAddress.getText().toString(), R.string.address_copied);
                break;

            case R.id.btn_send:
                loadNextActivity(new Intent(getActivity(), SendActivity.class), AppConstants.REQ_CODE_NULL);
                break;

            case R.id.btn_receive:
                loadNextActivity(new Intent(getActivity(), ReceiveActivity.class), AppConstants.REQ_CODE_NULL);
                break;
        }
    }
}
