package sentinelgroup.io.sentinel.ui.fragment;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.adapter.VpnSelectPagerAdapter;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnGenericFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link VpnSelectFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class VpnSelectFragment extends Fragment {
    private OnGenericFragmentInteractionListener mListener;

    private ViewPager mVpVpnSelect;
    private TabLayout mTabLayout;

    public VpnSelectFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment VpnSelectFragment.
     */
    public static VpnSelectFragment newInstance() {
        return new VpnSelectFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_vpn_select, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        initViewModel();
    }

    private void initView(View iView) {
        mVpVpnSelect = iView.findViewById(R.id.vp_vpn_select);
        mTabLayout = iView.findViewById(R.id.tab_layout);
        // Setup ViewPager
        VpnSelectPagerAdapter aAdapter = new VpnSelectPagerAdapter(getFragmentManager(), getContext());
        mVpVpnSelect.setAdapter(aAdapter);
        // Setup TabLayout
        mTabLayout.setupWithViewPager(mVpVpnSelect);
        // Iterate over all tabs and set the custom view
        for (int i = 0; i < mTabLayout.getTabCount(); i++) {
            TabLayout.Tab aTabItem = mTabLayout.getTabAt(i);
            if (aTabItem != null) {
                aTabItem.setCustomView(aAdapter.getTabView(i));
            }
        }
    }

    private void initViewModel() {

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
