package co.sentinel.sentinellite.ui.dialog;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.DialogFragment;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;

import java.util.Objects;

import co.sentinel.sentinellite.R;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnDialogActionListener} interface
 * to handle interaction events.
 * Use the {@link DoubleActionDialogFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class DoubleActionDialogFragment extends DialogFragment {
    public static final String ARG_TAG = "tag";
    private static final String ARG_TITLE = "title_id";
    private static final String ARG_MESSAGE = "message";
    private static final String ARG_POSITIVE_OPTION = "positive_option_id";
    private static final String ARG_NEGATIVE_OPTION = "negative_option_id";

    private int mTitleId, mPositiveOptionId, mNegativeOptionId;
    private String mTag, mMessage;

    private OnDialogActionListener mListener;

    public DoubleActionDialogFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param iTag              tag
     * @param iTitleId          title id
     * @param iMessage          message text
     * @param iPositiveOptionId positive option id
     * @param iNegativeOptionId negative option id
     * @return A new instance of fragment DoubleActionDialogFragment.
     */
    public static DoubleActionDialogFragment newInstance(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId) {
        DoubleActionDialogFragment fragment = new DoubleActionDialogFragment();
        Bundle args = new Bundle();
        args.putString(ARG_TAG, iTag);
        args.putInt(ARG_TITLE, iTitleId);
        args.putString(ARG_MESSAGE, iMessage);
        args.putInt(ARG_POSITIVE_OPTION, iPositiveOptionId);
        args.putInt(ARG_NEGATIVE_OPTION, iNegativeOptionId);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mTag = getArguments().getString(ARG_TAG);
            mTitleId = getArguments().getInt(ARG_TITLE);
            mMessage = getArguments().getString(ARG_MESSAGE);
            mPositiveOptionId = getArguments().getInt(ARG_POSITIVE_OPTION);
            mNegativeOptionId = getArguments().getInt(ARG_NEGATIVE_OPTION);
        }
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_double_action_dialog, container, false);
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
        TextView aTvDialogTitle = iView.findViewById(R.id.tv_dialog_title);
        TextView aTvDialogBody = iView.findViewById(R.id.tv_dialog_body);
        Button aBtnPositive = iView.findViewById(R.id.btn_dialog_positive);
        Button aBtnNegative = iView.findViewById(R.id.btn_dialog_negative);
        aTvDialogTitle.setText(mTitleId);
        aTvDialogBody.setText(mMessage);
        aBtnPositive.setText(mPositiveOptionId);
        aBtnNegative.setText(mNegativeOptionId);
        aBtnPositive.setOnClickListener(v -> onActionButtonClick(true));
        aBtnNegative.setOnClickListener(v -> onActionButtonClick(false));
    }

    // Interface interaction method
    public void onActionButtonClick(boolean iIsPositiveButton) {
        if (mListener != null) {
            mListener.onActionButtonClicked(mTag, getDialog(), iIsPositiveButton);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnDialogActionListener) {
            mListener = (OnDialogActionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnDialogActionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnDialogActionListener {
        /**
         * Notifies the observer when the dialog's button is clicked
         *
         * @param iTag             [String] The Tag assigned to the fragment when it's added to the
         *                         container
         * @param iDialog          [Dialog] The instance of this dialog
         * @param isPositiveButton [boolean] Indicates if the button pressed in positive button or
         *                         negative button
         */
        void onActionButtonClicked(String iTag, Dialog iDialog, boolean isPositiveButton);
    }
}
