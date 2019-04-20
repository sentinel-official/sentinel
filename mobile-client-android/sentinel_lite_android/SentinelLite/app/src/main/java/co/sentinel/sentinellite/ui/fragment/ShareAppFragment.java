package co.sentinel.sentinellite.ui.fragment;


import android.annotation.SuppressLint;
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
import co.sentinel.sentinellite.ui.custom.OnGenericFragmentInteractionListener;
import co.sentinel.sentinellite.util.AppConstants;
import co.sentinel.sentinellite.viewmodel.BonusViewModelFactory;
import co.sentinel.sentinellite.viewmodel.ShareAppViewModel;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link ShareAppFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ShareAppFragment extends Fragment implements View.OnClickListener, SwipeRefreshLayout.OnRefreshListener {

    private ShareAppViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private SwipeRefreshLayout mSrReload;
    private TextView mTvInvitationLink;
    private ImageButton mIbCopyReferralLink;
    private Button mBtnShareAddress;

    public ShareAppFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment ShareAppFragment.
     */
    public static ShareAppFragment newInstance() {
        return new ShareAppFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_share_app, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.share_app));
        initViewModel();
    }

    private void initView(View iView) {
        mSrReload = iView.findViewById(R.id.sr_reload);
        mTvInvitationLink = iView.findViewById(R.id.tv_invitation_link);
        mIbCopyReferralLink = iView.findViewById(R.id.ib_copy_invitation_link);
        mBtnShareAddress = iView.findViewById(R.id.btn_invite_friend);
        // Set listeners
        mSrReload.setOnRefreshListener(this);
        mIbCopyReferralLink.setOnClickListener(this);
        mBtnShareAddress.setOnClickListener(this);
    }

    @SuppressLint("HardwareIds")
    private void initViewModel() {
        // init Device ID
        String aDeviceId = Settings.Secure.getString(Objects.requireNonNull(getActivity()).getContentResolver(), Settings.Secure.ANDROID_ID);

        BonusViewModelFactory aFactory = InjectorModule.provideBonusViewModelFactory(getContext(), aDeviceId);
        mViewModel = ViewModelProviders.of(this, aFactory).get(ShareAppViewModel.class);

        generateLinkAndShare();
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_invite_friend:
                shareLink(getString(R.string.share_string, mViewModel.getReferralId(), mTvInvitationLink.getText().toString().trim()));
                break;

            case R.id.ib_copy_invitation_link:
                copyToClipboard(mTvInvitationLink.getText().toString().trim(), R.string.link_copied);
                break;
        }
    }

    private void generateLinkAndShare() {
        mTvInvitationLink.setText(getString(R.string.share_url));
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