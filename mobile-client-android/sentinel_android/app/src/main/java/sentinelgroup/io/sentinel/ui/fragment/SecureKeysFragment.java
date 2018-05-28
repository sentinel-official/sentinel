package sentinelgroup.io.sentinel.ui.fragment;

import android.content.Context;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.ImageButton;
import android.widget.RadioButton;
import android.widget.TextView;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnGenericFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link SecureKeysFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class SecureKeysFragment extends Fragment implements View.OnClickListener, CompoundButton.OnCheckedChangeListener {

    private static final String ARG_ACC_ADDRESS = "account_address";
    private static final String ARG_PRIVATE_KEY = "private key";
    private static final String ARG_KEYSTORE_FILE_PATH = "keystore_file_path";

    private String mAccountAddress, mPrivateKey, mKeyStoreFilePath;

    private OnGenericFragmentInteractionListener mListener;

    private Button mBtnNext;
    private TextView mTvPrivateKey;

    public SecureKeysFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param iAccountAddress   Account Address.
     * @param iPrivateKey       Private Key.
     * @param iKeystoreFilePath Keystore File Path.
     * @return A new instance of fragment SecureKeysFragment.
     */
    public static SecureKeysFragment newInstance(String iAccountAddress, String iPrivateKey, String iKeystoreFilePath) {
        SecureKeysFragment fragment = new SecureKeysFragment();
        Bundle args = new Bundle();
        args.putString(ARG_ACC_ADDRESS, iAccountAddress);
        args.putString(ARG_PRIVATE_KEY, iPrivateKey);
        args.putString(ARG_KEYSTORE_FILE_PATH, iKeystoreFilePath);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mAccountAddress = getArguments().getString(ARG_ACC_ADDRESS);
            mPrivateKey = getArguments().getString(ARG_PRIVATE_KEY);
            mKeyStoreFilePath = getArguments().getString(ARG_KEYSTORE_FILE_PATH);
        }
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_secure_keys, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.secure_keys));
    }

    private void initView(View iView) {
        TextView aTvAddress = iView.findViewById(R.id.tv_address);
        mTvPrivateKey = iView.findViewById(R.id.tv_private_key);
        TextView aTvKeystore = iView.findViewById(R.id.tv_keystore);
        ImageButton aIbCopyKey = iView.findViewById(R.id.ib_copy_key);
        RadioButton aRbKeyCopied = iView.findViewById(R.id.rb_key_copied);
        mBtnNext = iView.findViewById(R.id.btn_next);
        // set view initial value
        aTvAddress.setText(mAccountAddress);
        mTvPrivateKey.setText(mPrivateKey);
        aTvKeystore.setText(mKeyStoreFilePath);
        // set listeners
        aRbKeyCopied.setOnCheckedChangeListener(this);
        aIbCopyKey.setOnClickListener(this);
        mBtnNext.setOnClickListener(this);
    }

    // Interface interaction methods
    public void fragmentLoaded(String iTitle) {
        if (mListener != null) {
            mListener.onFragmentLoaded(iTitle);
        }
    }

    public void copyToClipboard(String iCopyString) {
        if (mListener != null) {
            mListener.onCopyToClipboardClicked(iCopyString);
        }
    }

    public void loadNextFragment() {
        if (mListener != null) {
            mListener.onLoadNextFragment(SetPinFragment.newInstance(mAccountAddress));
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
            case R.id.btn_next:
                loadNextFragment();
                break;
            case R.id.ib_copy_key:
                copyToClipboard(mTvPrivateKey.getText().toString());
        }
    }

    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        if (buttonView.getId() == R.id.rb_key_copied) {
            mBtnNext.setEnabled(isChecked);
        }
    }
}