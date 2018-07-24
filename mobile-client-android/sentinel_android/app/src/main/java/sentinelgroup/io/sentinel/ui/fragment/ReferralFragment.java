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
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.Converter;
import sentinelgroup.io.sentinel.util.Status;
import sentinelgroup.io.sentinel.viewmodel.ReferralViewModel;
import sentinelgroup.io.sentinel.viewmodel.ReferralViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link ReferralFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ReferralFragment extends Fragment implements View.OnClickListener, SwipeRefreshLayout.OnRefreshListener {

    private ReferralViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private SwipeRefreshLayout mSrReload;
    private TextView mTvReferralCode, mtvReferralCount, mTvRewardsEarned;
    private ImageButton mIbCopyReferral;
    private Button mBtnShareAddress, mBtnClaimBonus;

    private String mShareString;

    public ReferralFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment ReferralFragment.
     */
    public static ReferralFragment newInstance() {
        return new ReferralFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_referral, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.referrals));
        initViewModel();
    }

    private void initView(View iView) {
        mSrReload = iView.findViewById(R.id.sr_reload);
        mTvReferralCode = iView.findViewById(R.id.tv_referral_code);
        mtvReferralCount = iView.findViewById(R.id.tv_referral_count);
        mTvRewardsEarned = iView.findViewById(R.id.tv_rewards_earned);
        mIbCopyReferral = iView.findViewById(R.id.ib_copy_referral);
        mBtnShareAddress = iView.findViewById(R.id.btn_share_address);
        mBtnClaimBonus = iView.findViewById(R.id.btn_claim_bonus);
        // Set listeners
        mSrReload.setOnRefreshListener(this);
        mIbCopyReferral.setOnClickListener(this);
        mBtnShareAddress.setOnClickListener(this);
        mBtnClaimBonus.setOnClickListener(this);
    }

    private void initViewModel() {
        ReferralViewModelFactory aFactory = InjectorModule.provideReferralViewModelFactory(getContext());
        mViewModel = ViewModelProviders.of(this, aFactory).get(ReferralViewModel.class);

        mTvReferralCode.setText(mViewModel.getAccountAddress());
        mShareString = getString(R.string.share_string, mViewModel.getAccountAddress());

        mViewModel.getReferralInfoLiveData().observe(this, referralInfoEntity -> {
            if (referralInfoEntity != null) {
                if (referralInfoEntity.getReferral() != null) {
                    mtvReferralCount.setText(String.valueOf(referralInfoEntity.getReferral().count));
                    mTvRewardsEarned.setText(Converter.getFormattedTokenString(referralInfoEntity.getReferral().amount));
                }
            }
        });

        mViewModel.getReferralClaimLiveEvent().observe(this, genericResponseResource -> {
            if (genericResponseResource != null) {
                if (genericResponseResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.claiming_referral_bonus));
                } else if (genericResponseResource.data != null && genericResponseResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    showSingleActionDialog(R.string.yay, getString(R.string.referral_claimed), AppConstants.VALUE_DEFAULT);
                } else if (genericResponseResource.message != null && genericResponseResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    showSingleActionDialog(AppConstants.VALUE_DEFAULT, genericResponseResource.message, AppConstants.VALUE_DEFAULT);
                }
            }
        });
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_share_address:
                Intent aIntent = new Intent();
                aIntent.setAction(Intent.ACTION_SEND);
                aIntent.putExtra(Intent.EXTRA_TEXT, mShareString);
                aIntent.setType("text/plain");
                startShareActivity(aIntent);
                break;
            case R.id.btn_claim_bonus:
                mViewModel.claimReferralBonus();
                break;
            case R.id.ib_copy_referral:
                copyToClipboard(mTvReferralCode.getText().toString(), R.string.address_copied);
                break;
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

    public void startShareActivity(Intent iShareIntent) {
        if (mListener != null) {
            mListener.onLoadNextActivity(iShareIntent, AppConstants.REQ_CODE_NULL);
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
    public void onRefresh() {
        mViewModel.updateReferralInfo();
        mSrReload.setRefreshing(false);
    }
}