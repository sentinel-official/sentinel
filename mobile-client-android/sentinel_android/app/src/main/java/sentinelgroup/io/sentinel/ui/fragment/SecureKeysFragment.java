package sentinelgroup.io.sentinel.ui.fragment;


import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import sentinelgroup.io.sentinel.R;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link SecureKeysFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class SecureKeysFragment extends Fragment {
    private static final String ARG_ACC_ADDRESS = "account_address";
    private static final String ARG_PRIVATE_KEY = "private key";
    private static final String ARG_KEYSTORE_FILE_PATH = "keystore_file_path";

    private String mAccountAddress, mPrivateKey, mKeyStoreFilePath;

    private CreateAuidFragment.OnFragmentInteractionListener mListener;

    public SecureKeysFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param iAccountAddress   Parameter 1.
     * @param iPrivateKey       Parameter 2.
     * @param iKeystoreFilePath Parameter 3.
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

    public void onFragmentLoaded(String iTitle) {
        if (mListener != null) {
            mListener.onFragmentLoaded(iTitle);
        }
    }

    public void onLoadNextFragmentClicked(String iAccountAddress) {
        if (mListener != null) {
            mListener.onLoadNextFragmentClicked(SetPinFragment.newInstance(iAccountAddress));
        }
    }
}
