package co.sentinel.lite.ui.dialog;

import android.annotation.SuppressLint;
import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.os.Bundle;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.DialogFragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.RatingBar;
import android.widget.Toast;

import java.util.Objects;

import co.sentinel.lite.R;
import co.sentinel.lite.di.InjectorModule;
import co.sentinel.lite.ui.custom.OnGenericFragmentInteractionListener;
import co.sentinel.lite.util.AppConstants;
import co.sentinel.lite.util.Status;
import co.sentinel.lite.viewmodel.RatingViewModel;
import co.sentinel.lite.viewmodel.RatingViewModelFactory;

public class RatingDialogFragment extends DialogFragment {

    private RatingViewModel mViewModel;
    private RatingBar mRatingBar;
    private OnGenericFragmentInteractionListener mListener;

    public RatingDialogFragment() {

    }

    public static RatingDialogFragment newInstance() {
        RatingDialogFragment aRatingDialogFragment = new RatingDialogFragment();
        return aRatingDialogFragment;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_rating, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initDialog();
        initView(view);
        initViewModel();
    }

    @Override
    public void onResume() {
        super.onResume();
        getDialog().setOnKeyListener((dialog, keyCode, event) -> {
            // do nothing when back is pressed
            return (keyCode == android.view.KeyEvent.KEYCODE_BACK);
        });
        resizeDialog();
    }

    /*
     * Resize the dialog's width
     */
    private void resizeDialog() {
        WindowManager.LayoutParams params = Objects.requireNonNull(getDialog().getWindow()).getAttributes();
        params.width = WindowManager.LayoutParams.MATCH_PARENT;
        getDialog().getWindow().setAttributes(params);
    }

    /*
     * Initialize the dialog's properties
     */
    private void initDialog() {
        Objects.requireNonNull(getDialog().getWindow()).requestFeature(Window.FEATURE_NO_TITLE);
        getDialog().setCanceledOnTouchOutside(false);
        getDialog().setCancelable(false);
    }

    /*
     * Instantiate all the views used in the XML, perform other instantiation steps (if needed)
     * and initialize these views
     */
    private void initView(View iView) {
        mRatingBar = iView.findViewById(R.id.rbRating);
        Button aBtnNegative = iView.findViewById(R.id.btn_dialog_negative);
        aBtnNegative.setOnClickListener(v -> getDialog().dismiss());
        Button aBtnPositive = iView.findViewById(R.id.btn_dialog_positive);
        aBtnPositive.setOnClickListener(v -> submitRating());
    }

    private void initViewModel() {
        // init Device ID
        @SuppressLint("HardwareIds") String aDeviceId = Settings.Secure.getString(Objects.requireNonNull(getActivity()).getContentResolver(), Settings.Secure.ANDROID_ID);

        RatingViewModelFactory aFactory = InjectorModule.provideRatingViewModelFactory(getContext(), aDeviceId);
        mViewModel = ViewModelProviders.of(this, aFactory).get(RatingViewModel.class);

        mViewModel.getRatingLiveEvent().observe(this, genericResponseResource -> {
            if (genericResponseResource != null) {
                if (genericResponseResource.status.equals((Status.LOADING))) {
                    showProgressDialog(true, getString(R.string.generic_loading_message));
                } else if (genericResponseResource.data != null && genericResponseResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    getDialog().dismiss();
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

    private void submitRating() {
        if (validRating()) {
            mViewModel.rateVpnSession((int) mRatingBar.getRating());
        }
    }

    private boolean validRating() {
        if ((int) mRatingBar.getRating() <= 0) {
            Toast.makeText(getActivity(), getString(R.string.error_select_rating), Toast.LENGTH_SHORT).show();
            return false;
        }
        return true;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnGenericFragmentInteractionListener) {
            mListener = (OnGenericFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString() + " must implement OnGenericFragmentInteractionListener");
        }
    }
}
