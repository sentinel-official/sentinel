package sentinelgroup.io.sentinel.ui.fragment;


import android.content.Context;
import android.content.Intent;
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

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link ReferralFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ReferralFragment extends Fragment implements View.OnClickListener {

    private OnGenericFragmentInteractionListener mListener;

    private TextView mTvReferralCode, mtvReferralCount, mTvRewardsEarned;
    private ImageButton mIbCopyReferral;
    private Button mBtnInviteFriends;

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
        setValue();
    }

    private void initView(View iView) {
        mTvReferralCode = iView.findViewById(R.id.tv_referral_code);
        mtvReferralCount = iView.findViewById(R.id.tv_referral_count);
        mTvRewardsEarned = iView.findViewById(R.id.tv_rewards_earned);
        mIbCopyReferral = iView.findViewById(R.id.ib_copy_referral);
        mBtnInviteFriends = iView.findViewById(R.id.btn_share_code);
        // Set listeners
        mIbCopyReferral.setOnClickListener(this);
        mBtnInviteFriends.setOnClickListener(this);
    }

    private void setValue() {
        String aReferralCode = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        mTvReferralCode.setText(aReferralCode);
        mtvReferralCount.setText("0");
        mTvRewardsEarned.setText("0");
        mShareString = getString(R.string.share_string, aReferralCode);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_share_code:
                Intent aIntent = new Intent();
                aIntent.setAction(Intent.ACTION_SEND);
                aIntent.putExtra(Intent.EXTRA_TEXT, mShareString);
                aIntent.setType("text/plain");
                startShareActivity(aIntent);
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
        super.onDetach();
        mListener = null;
    }
}