package co.sentinel.lite.ui.fragment;


import android.content.Context;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import co.sentinel.lite.R;
import co.sentinel.lite.ui.custom.OnGenericFragmentInteractionListener;
import co.sentinel.lite.util.NetworkUtil;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link NoNetworkFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class NoNetworkFragment extends Fragment {

    private OnGenericFragmentInteractionListener mListener;

    public NoNetworkFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment NoNetworkFragment.
     */
    public static NoNetworkFragment newInstance() {
        return new NoNetworkFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_no_network, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    private void initView(View iView) {
        iView.findViewById(R.id.btn_retry).setOnClickListener(v -> checkForConnectivity());
    }

    private void checkForConnectivity() {
        if (NetworkUtil.isOnline())
            loadNextFragment(VpnSelectFragment.newInstance(null));
    }
    
    // Interface interaction methods
    public void loadNextFragment(Fragment iFragment) {
        if (mListener != null) {
            mListener.onLoadNextFragment(iFragment);
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