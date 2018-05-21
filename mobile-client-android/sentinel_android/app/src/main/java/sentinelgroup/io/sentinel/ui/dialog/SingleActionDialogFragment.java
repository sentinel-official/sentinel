package sentinelgroup.io.sentinel.ui.dialog;

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

import sentinelgroup.io.sentinel.R;

/**
 * A simple {@link Fragment} subclass.
 * <p>
 * Use the {@link SingleActionDialogFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class SingleActionDialogFragment extends DialogFragment {
    private static final String ARG_TITLE = "title";
    private static final String ARG_MESSAGE = "message";
    private static final String ARG_POSITIVE_OPTION = "positive_option";

    private String mTitle, mMessage, mPositiveOption;

    public SingleActionDialogFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param iTitle   Parameter 1.
     * @param iMessage Parameter 2.
     * @return A new instance of fragment SingleActionDialogFragment.
     */
    public static SingleActionDialogFragment newInstance(String iTitle, String iMessage, String iPositiveOption) {
        SingleActionDialogFragment fragment = new SingleActionDialogFragment();
        Bundle args = new Bundle();
        args.putString(ARG_TITLE, iTitle);
        args.putString(ARG_MESSAGE, iMessage);
        args.putString(ARG_POSITIVE_OPTION, iPositiveOption);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mTitle = getArguments().getString(ARG_TITLE);
            mMessage = getArguments().getString(ARG_MESSAGE);
            mPositiveOption = getArguments().getString(ARG_POSITIVE_OPTION);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_single_action_dialog, container, false);
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

    private void resizeDialog() {
        WindowManager.LayoutParams params = getDialog().getWindow().getAttributes();
        params.width = WindowManager.LayoutParams.MATCH_PARENT;
        getDialog().getWindow().setAttributes(params);
    }

    private void initDialog() {
        getDialog().getWindow().requestFeature(Window.FEATURE_NO_TITLE);
        getDialog().setCanceledOnTouchOutside(false);
        getDialog().setCancelable(false);
    }

    private void initView(View iView) {
        TextView aTvDialogTitle = iView.findViewById(R.id.tv_dialog_title);
        TextView aTvDialogBody = iView.findViewById(R.id.tv_dialog_body);
        Button aBtnPositive = iView.findViewById(R.id.btn_dialog_positive);
        aTvDialogTitle.setText(mTitle);
        aTvDialogBody.setText(mMessage);
        aBtnPositive.setText(mPositiveOption);
        aBtnPositive.setOnClickListener(v -> getDialog().dismiss());
    }
}
