package co.sentinel.sentinellite.ui.fragment;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import co.sentinel.sentinellite.R;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link Socks5ListFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class Socks5ListFragment extends Fragment {

    public Socks5ListFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment Socks5ListFragment.
     */
    public static Socks5ListFragment newInstance() {
        return new Socks5ListFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_socks5_list, container, false);
    }
}