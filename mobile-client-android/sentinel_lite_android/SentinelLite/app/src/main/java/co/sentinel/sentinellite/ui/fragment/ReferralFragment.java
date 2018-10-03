package co.sentinel.sentinellite.ui.fragment;


import android.annotation.SuppressLint;
import android.app.Dialog;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings;
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

import java.util.Objects;

import co.sentinel.sentinellite.R;
import co.sentinel.sentinellite.di.InjectorModule;
import co.sentinel.sentinellite.network.model.Account;
import co.sentinel.sentinellite.ui.custom.OnGenericFragmentInteractionListener;
import co.sentinel.sentinellite.ui.dialog.AddressToClaimDialogFragment;
import co.sentinel.sentinellite.util.AppConstants;
import co.sentinel.sentinellite.util.AppPreferences;
import co.sentinel.sentinellite.util.BranchUrlHelper;
import co.sentinel.sentinellite.util.Converter;
import co.sentinel.sentinellite.util.Status;
import co.sentinel.sentinellite.viewmodel.BonusViewModelFactory;
import co.sentinel.sentinellite.viewmodel.ReferralViewModel;

import static co.sentinel.sentinellite.util.AppConstants.TAG_ADDRESS_TO_CLAIM;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link ReferralFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ReferralFragment extends Fragment implements View.OnClickListener, SwipeRefreshLayout.OnRefreshListener {

    private ReferralViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private SwipeRefreshLayout mSrReload;
    private TextView mTvReferralCode, mTvReferralLink, mtvReferralCount, mTvRewardsEarned, mTvCanClaimAfter, mTvReadMore;
    private ImageButton mIbCopyReferral, mIbCopyReferralLink;
    private Button mBtnShareAddress, mBtnClaimBonus;

    private AddressToClaimDialogFragment mAddressToClaimDialogFragment;

    private Account mAccountFromAddress;

    private String mShareString;

    private String mDeviceId;

    private Dialog mLinkAccountConfirmationDialog;

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
        mTvReferralLink = iView.findViewById(R.id.tv_referral_link);
        mtvReferralCount = iView.findViewById(R.id.tv_referral_count);
        mTvRewardsEarned = iView.findViewById(R.id.tv_rewards_earned);
        mTvCanClaimAfter = iView.findViewById(R.id.tv_can_claim_after);
        mIbCopyReferral = iView.findViewById(R.id.ib_copy_referral);
        mIbCopyReferralLink = iView.findViewById(R.id.ib_copy_referral_link);
        mBtnShareAddress = iView.findViewById(R.id.btn_share_referral_id);
        mBtnClaimBonus = iView.findViewById(R.id.btn_claim_bonus);
        mTvReadMore = iView.findViewById(R.id.tv_read_more);
        // Set listeners
        mSrReload.setOnRefreshListener(this);
        mIbCopyReferral.setOnClickListener(this);
        mIbCopyReferralLink.setOnClickListener(this);
        mBtnShareAddress.setOnClickListener(this);
        mBtnClaimBonus.setOnClickListener(this);
        mTvReadMore.setOnClickListener(this);
    }

    @SuppressLint("HardwareIds")
    private void initViewModel() {
        // init Device ID
        mDeviceId = Settings.Secure.getString(Objects.requireNonNull(getActivity()).getContentResolver(), Settings.Secure.ANDROID_ID);

        BonusViewModelFactory aFactory = InjectorModule.provideBonusViewModelFactory(getContext(), mDeviceId);
        mViewModel = ViewModelProviders.of(this, aFactory).get(ReferralViewModel.class);

        mTvReferralCode.setText(mViewModel.getReferralId());
        generateLinkAndShare();

        mViewModel.getBonusInfoLiveData().observe(this, bonusInfoEntity -> {
            if (bonusInfoEntity != null) {
                mtvReferralCount.setText(String.valueOf(bonusInfoEntity.getRefCount()));
                mTvRewardsEarned.setText(Converter.getFormattedTokenString(bonusInfoEntity.getBonuses().getTotalTokens()));
//                mBtnClaimBonus.setVisibility(bonusInfoEntity.isCanClaim() ? View.VISIBLE : View.GONE);
                if (bonusInfoEntity.getCanClaimAfter() != null) {
                    String aFormattedTime = Converter.getFormattedTimeInUTC(bonusInfoEntity.getCanClaimAfter());
                    if (aFormattedTime != null)
                        mTvCanClaimAfter.setText(getString(R.string.can_claim_after, aFormattedTime));
                }
            }
        });

        mViewModel.getSncVersionInfoLiveEvent().observe(this, versionInfoResource -> {
            if (versionInfoResource != null) {
                if (versionInfoResource.data != null && versionInfoResource.status.equals(Status.SUCCESS)) {
                    AppPreferences.getInstance().saveString(AppConstants.PREFS_FILE_URL, versionInfoResource.data.fileUrl);
                    AppPreferences.getInstance().saveString(AppConstants.PREFS_FILE_NAME, versionInfoResource.data.fileName);
                    showTripleActionDialog(AppConstants.TAG_DOWNLOAD, AppConstants.VALUE_DEFAULT, getString(R.string.download_desc), R.string.action_enter_address, R.string.action_cancel, R.string.action_download);
                } else if (versionInfoResource.message != null && versionInfoResource.status.equals(Status.ERROR)) {
                    if (versionInfoResource.message.equals(AppConstants.ERROR_GENERIC))
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), AppConstants.VALUE_DEFAULT);
                    else
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, versionInfoResource.message, AppConstants.VALUE_DEFAULT);
                }
            }
        });

        mViewModel.getAccountInfoByAddressLiveEvent().observe(this, genericResponseResource -> {
            if (genericResponseResource != null) {
                if (genericResponseResource.status.equals((Status.LOADING))) {
                    showProgressDialog(true, getString(R.string.generic_loading_message));
                } else if (genericResponseResource.data != null && genericResponseResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    mAddressToClaimDialogFragment.dismiss();
                    mAccountFromAddress = genericResponseResource.data.account;
                    if (mAccountFromAddress.linked) {
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.label_already_linked, mAccountFromAddress.address, mAccountFromAddress.referralId, mTvReferralCode.getText().toString().trim()), AppConstants.VALUE_DEFAULT);
                    } else {
                        showDoubleActionDialog(AppConstants.TAG_LINK_ACCOUNT_CONFIRMATION, AppConstants.VALUE_DEFAULT, getString(R.string.label_confirm_link_account, mAccountFromAddress.referralId), R.string.action_confirm, R.string.action_cancel);
                    }
                } else if (genericResponseResource.message != null && genericResponseResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    if (genericResponseResource.message.equals(AppConstants.ERROR_GENERIC))
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), AppConstants.VALUE_DEFAULT);
                    else
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, genericResponseResource.message, AppConstants.VALUE_DEFAULT);
                }
            }
        });

        mViewModel.getLinkAccountLiveEvent().observe(this, genericResponseResource -> {
            if (genericResponseResource != null) {
                if (genericResponseResource.status.equals((Status.LOADING))) {
                    showProgressDialog(true, getString(R.string.generic_loading_message));
                } else if (genericResponseResource.data != null && genericResponseResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    mLinkAccountConfirmationDialog.dismiss();
                    mLinkAccountConfirmationDialog = null;
                    showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.label_link_account_success), AppConstants.VALUE_DEFAULT);
                } else if (genericResponseResource.message != null && genericResponseResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    if (genericResponseResource.message.equals(AppConstants.ERROR_GENERIC))
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.generic_error), AppConstants.VALUE_DEFAULT);
                    else
                        showSingleActionDialog(AppConstants.VALUE_DEFAULT, genericResponseResource.message, AppConstants.VALUE_DEFAULT);
                }
            }
        });
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_share_referral_id:
                shareLink(getString(R.string.share_string, mViewModel.getReferralId(), mTvReferralLink.getText().toString().trim()));
                break;

            case R.id.btn_claim_bonus:
                mViewModel.fetchSncVersionInfo();
                break;

            case R.id.ib_copy_referral:
                copyToClipboard(mTvReferralCode.getText().toString().trim(), R.string.referral_id_copied);
                break;
            case R.id.ib_copy_referral_link:
                copyToClipboard(mTvReferralLink.getText().toString().trim(), R.string.link_copied);
                break;

            case R.id.tv_read_more:
                showSingleActionDialog(AppConstants.VALUE_DEFAULT, getString(R.string.referral_desc), AppConstants.VALUE_DEFAULT);
                break;
        }
    }

    public void showEnterAddressDialog() {
        mAddressToClaimDialogFragment = AddressToClaimDialogFragment.newInstance();
        mAddressToClaimDialogFragment.show(getFragmentManager(), TAG_ADDRESS_TO_CLAIM);
    }

    public void linkSncSlcAccounts(Dialog iDialogFragment) {
        mLinkAccountConfirmationDialog = iDialogFragment;
        mViewModel.linkSncSlcAccounts(mAccountFromAddress.referralId, mTvReferralCode.getText().toString().trim(), mAccountFromAddress.address, mDeviceId);
    }

    private void generateLinkAndShare() {
        new BranchUrlHelper(getActivity()).createLink(mViewModel.getReferralId(), iUrl -> {
            mTvReferralLink.setText(iUrl);
        });
    }

    private void shareLink(String iShareString) {
        Intent aIntent = new Intent();
        aIntent.setAction(Intent.ACTION_SEND);
        aIntent.putExtra(Intent.EXTRA_TEXT, iShareString);
        aIntent.setType("text/plain");
        startShareActivity(aIntent);
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

    public void showDoubleActionDialog(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId) {
        if (mListener != null) {
            mListener.onShowDoubleActionDialog(iTag, iTitleId, iMessage, iPositiveOptionId, iNegativeOptionId);
        }
    }

    public void showTripleActionDialog(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId, int iNeutralOptionId) {
        if (mListener != null) {
            mListener.onShowTripleActionDialog(iTag, iTitleId, iMessage, iPositiveOptionId, iNegativeOptionId, iNeutralOptionId);
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

    public void onAddressSubmitted(String iAddress) {
        mViewModel.getAccountInfoByAddress(iAddress);
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