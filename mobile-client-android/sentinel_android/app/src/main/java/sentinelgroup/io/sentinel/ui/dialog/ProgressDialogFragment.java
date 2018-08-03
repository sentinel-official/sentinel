package sentinelgroup.io.sentinel.ui.dialog;


import android.app.Dialog;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.DialogFragment;
import android.support.v4.app.Fragment;
import android.support.v7.view.ContextThemeWrapper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.TextView;

import com.wang.avi.AVLoadingIndicatorView;

import sentinelgroup.io.sentinel.R;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link ProgressDialogFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ProgressDialogFragment extends DialogFragment {
    private static final float HALF_DIM = 0.7f;
    private static final float NO_DIM = 0f;
    private static final String ARG_IS_HALF_DIM = "arg_is_half_dim";

    private float mDimAmount;
    private String mLoadingMessage;

    private AVLoadingIndicatorView mAvlLoader;
    private TextView mTvLoadingMessage;

    public ProgressDialogFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment ProgressDialogFragment.
     */
    public static ProgressDialogFragment newInstance(boolean iIsHalfDim) {
        ProgressDialogFragment aFragment = new ProgressDialogFragment();
        Bundle args = new Bundle();
        args.putBoolean(ARG_IS_HALF_DIM, iIsHalfDim);
        aFragment.setArguments(args);
        return aFragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mDimAmount = getArguments().getBoolean(ARG_IS_HALF_DIM) ? HALF_DIM : NO_DIM;
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        final Context aContext = new ContextThemeWrapper(getActivity(), R.style.CustomDialogFragmentNoDimTheme);
        LayoutInflater aLayoutInflater = inflater.cloneInContext(aContext);
        return aLayoutInflater.inflate(R.layout.fragment_progress_dialog, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initDialog();
        initView(view);
    }

    @Override
    public void onStart() {
        super.onStart();
        setBackgroundDim();
    }

    @Override
    public void onResume() {
        super.onResume();
        setLoadingText();
        showLoader();
        getDialog().setOnKeyListener((dialog, keyCode, event) -> {
            // do nothing when back is pressed
            return (keyCode == android.view.KeyEvent.KEYCODE_BACK);
        });
        resizeDialog();
    }

    /*
     * Set the text which is to be displayed by this dialog
     */
    private void setLoadingText() {
        mTvLoadingMessage.setText(mLoadingMessage);
    }

    /*
     * Show the Custom loader
     */
    private void showLoader() {
        if (mAvlLoader != null)
            mAvlLoader.show();
    }

    /*
     * Hide the Custom loader
     */
    private void hideLoader() {
        if (mAvlLoader != null)
            mAvlLoader.hide();
    }

    /*
     * Resize the dialog's width
     */
    private void resizeDialog() {
        WindowManager.LayoutParams params = getDialog().getWindow().getAttributes();
        params.width = WindowManager.LayoutParams.MATCH_PARENT;
        getDialog().getWindow().setAttributes(params);
    }

    /*
     * Initialize/Update the dialog's window paramaters
     */
    private void setBackgroundDim() {
        Window aWindow = getDialog().getWindow();
        WindowManager.LayoutParams windowParams;
        if (aWindow != null) {
            windowParams = aWindow.getAttributes();
            windowParams.dimAmount = mDimAmount;
            windowParams.flags |= WindowManager.LayoutParams.FLAG_DIM_BEHIND;
            aWindow.setAttributes(windowParams);
        }
    }

    /*
     * Initialize the dialog's properties
     */
    private void initDialog() {
        Drawable aDrawable = new ColorDrawable(Color.TRANSPARENT);
        Window aWindow = getDialog().getWindow();
        if (aWindow != null) {
            aWindow.setBackgroundDrawable(aDrawable);
            aWindow.requestFeature(Window.FEATURE_NO_TITLE);
        }
        getDialog().setCanceledOnTouchOutside(false);
        getDialog().setCancelable(false);
    }

    /*
     * Instantiate all the views used in the XML and perform other instantiation steps (if needed)
     */
    private void initView(View iView) {
        mAvlLoader = iView.findViewById(R.id.avl_loader);
        mTvLoadingMessage = iView.findViewById(R.id.tv_loading_message);
    }

    /**
     * Setter method: To set the dim amount
     */
    public void setNoDim() {
        mDimAmount = NO_DIM;
    }

    /**
     * Setter method: To set the loading message
     *
     * @param iMessage [String] The loading message to be displayed
     */
    public void setLoadingMessage(String iMessage) {
        mLoadingMessage = iMessage;
    }

    /**
     * To update the existing loading message
     *
     * @param iMessage [String] The new loading message to be displayed
     */
    public void updateLoadingMessage(String iMessage) {
        setLoadingMessage(iMessage);
        setLoadingText();
    }

    @Override
    public void onDestroyView() {
        hideLoader();
        Dialog dialog = getDialog();
        if (dialog != null && getRetainInstance()) {
            dialog.setDismissMessage(null);
        }
        super.onDestroyView();
    }
}