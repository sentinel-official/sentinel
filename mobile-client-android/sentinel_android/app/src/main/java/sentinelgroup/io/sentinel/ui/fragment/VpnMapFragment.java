package sentinelgroup.io.sentinel.ui.fragment;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import sentinelgroup.io.sentinel.R;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link VpnMapFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class VpnMapFragment extends Fragment {

    public VpnMapFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment VpnMapFragment.
     */
    public static VpnMapFragment newInstance(String param1, String param2) {
        return new VpnMapFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_map, container, false);
    }
}