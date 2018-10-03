package co.sentinel.sentinellite.ui.dialog;

import android.content.Context;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.design.widget.TextInputEditText;
import android.support.v4.app.DialogFragment;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;

import java.util.Objects;

import co.sentinel.sentinellite.R;
import co.sentinel.sentinellite.ui.custom.OnGenericFragmentInteractionListener;
import co.sentinel.sentinellite.viewmodel.ReferralViewModel;

public class AddressToClaimDialogFragment extends DialogFragment {

    private ReferralViewModel mViewModel;
    private OnGenericFragmentInteractionListener mListener;
    private OnAddressSubmitListener mAddressSubmitListener;
    private TextInputEditText mTetAddress;

    public static AddressToClaimDialogFragment newInstance() {
        return new AddressToClaimDialogFragment();
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_address_to_claim, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initDialog();
        initView(view);
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
        mTetAddress = iView.findViewById(R.id.tet_address);
        Button aBtnNegative = iView.findViewById(R.id.btn_dialog_negative);
        aBtnNegative.setOnClickListener(v -> getDialog().dismiss());
        Button aBtnPositive = iView.findViewById(R.id.btn_dialog_positive);
        aBtnPositive.setOnClickListener(v -> {
            if (mTetAddress.getText() != null && !TextUtils.isEmpty(mTetAddress.getText().toString().trim())) {
                mAddressSubmitListener.onAddressSubmitted(mTetAddress.getText().toString().trim());
            }
        });
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnGenericFragmentInteractionListener) {
            mListener = (OnGenericFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString() + " must implement OnGenericFragmentInteractionListener");
        }
        if (context instanceof OnAddressSubmitListener) {
            mAddressSubmitListener = (OnAddressSubmitListener) context;
        } else {
            throw new RuntimeException(context.toString() + " must implement OnAddressSubmitListener");
        }
    }

    public interface OnAddressSubmitListener {
        void onAddressSubmitted(String iAddress);
    }

}
