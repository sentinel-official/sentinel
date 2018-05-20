package sentinelgroup.io.sentinel.ui.fragment;


import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import sentinelgroup.io.sentinel.R;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link SetPinFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class SetPinFragment extends Fragment {
    private static final String ARG_ACC_ADDRESS = "account_address";

    private String mAccountAddress;

    private CreateAuidFragment.OnFragmentInteractionListener mListener;

    public SetPinFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param iAccountAddress Parameter 1.
     * @return A new instance of fragment SetPinFragment.
     */
    public static SetPinFragment newInstance(String iAccountAddress) {
        SetPinFragment fragment = new SetPinFragment();
        Bundle args = new Bundle();
        args.putString(ARG_ACC_ADDRESS, iAccountAddress);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mAccountAddress = getArguments().getString(ARG_ACC_ADDRESS);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_set_pin, container, false);
    }

    public void onFragmentLoaded(String iTitle) {
        if (mListener != null) {
            mListener.onFragmentLoaded(iTitle);
        }
    }
}
