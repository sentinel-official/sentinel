package sentinelgroup.io.sentinel.ui.fragment;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.util.ArrayList;
import java.util.List;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.network.model.Location;
import sentinelgroup.io.sentinel.network.model.NetSpeed;
import sentinelgroup.io.sentinel.network.model.VpnList;
import sentinelgroup.io.sentinel.ui.adapter.VpnListAdapter;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link VpnListFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link VpnListFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class VpnListFragment extends Fragment implements VpnListAdapter.OnItemClickListener {

    private OnFragmentInteractionListener mListener;

    private RecyclerView mRvVpnList;
    private VpnListAdapter mAdapter;

    public VpnListFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment VpnListFragment.
     */
    public static VpnListFragment newInstance() {
        return new VpnListFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_list, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
//        fragmentLoaded(getString(R.string.create_auid));
        initViewModel();
    }

    private void initView(View iView) {
        mRvVpnList = iView.findViewById(R.id.rv_vpn_list);
        // Setup RecyclerView
        mRvVpnList.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.VERTICAL, false));
        mAdapter = new VpnListAdapter(this, getContext());
        mRvVpnList.setAdapter(mAdapter);
    }

    private void initViewModel() {
        List<VpnList> aData = new ArrayList<>();
        for (int i = 0; i < 8; i++) {
            VpnList aItem = new VpnList();
            aItem.accountAddress = "0xa6504af2160ae41d7a5111fd0204741491e426f5";
            aItem.ip = "103.208.85.63";
            aItem.latency = 244.984;
            Location aLocation = new Location();
            aLocation.latitude = 1.2931;
            aLocation.longitude = 103.8558;
            aLocation.city = "Singapore";
            aLocation.country = "Singapore";
            aItem.location = aLocation;
            NetSpeed aNetSpeed = new NetSpeed();
            aNetSpeed.download = 2342173251.754693;
            aNetSpeed.upload = 2274237170.0476236;
            aItem.netSpeed = aNetSpeed;
            aItem.pricePerGb = 125;
            aData.add(aItem);
        }
        mAdapter.loadData(aData);
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    @Override
    public void onItemClick(int iItemId, int iItemStartTime) {

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
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
}
