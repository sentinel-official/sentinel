package sentinelgroup.io.sentinel.ui.fragment;

import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.network.model.VpnList;
import sentinelgroup.io.sentinel.ui.activity.SendActivity;
import sentinelgroup.io.sentinel.ui.activity.VpnDetailsActivity;
import sentinelgroup.io.sentinel.ui.adapter.VpnListAdapter;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.Status;
import sentinelgroup.io.sentinel.viewmodel.VpnListViewModel;
import sentinelgroup.io.sentinel.viewmodel.VpnListViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link OnGenericFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link VpnListFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class VpnListFragment extends Fragment implements VpnListAdapter.OnItemClickListener {

    private VpnListViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

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
        VpnListViewModelFactory aFactory = InjectorModule.provideVpnListViewModelFactory();
        mViewModel = ViewModelProviders.of(this, aFactory).get(VpnListViewModel.class);

        mViewModel.getVpnListLiveData().observe(this, vpnResource -> {
            if (vpnResource != null) {
                if (vpnResource.data != null && vpnResource.status.equals(Status.SUCCESS)) {
                    hideProgressDialog();
                    if (vpnResource.data.list != null && vpnResource.data.list.size() > 0)
                        mAdapter.loadData(vpnResource.data.list);
                } else if (vpnResource.message != null && vpnResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    showErrorDialog(vpnResource.message);
                }
            }
        });
        mViewModel.getVpnGetServerCredentials().observe(this, vpnCredentialsResource -> {
            if (vpnCredentialsResource != null) {
                if (vpnCredentialsResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true, getString(R.string.fetching_server_details));
                } else if (vpnCredentialsResource.data != null && vpnCredentialsResource.status.equals(Status.SUCCESS)) {
                    // TODO get the OVPn config file and connect to VPN server & remove hideProgressDialog()
                    hideProgressDialog();
                } else if (vpnCredentialsResource.message != null && vpnCredentialsResource.status.equals(Status.ERROR)) {
                    hideProgressDialog();
                    if (vpnCredentialsResource.message.equals(AppConstants.INIT_PAY_ERROR))
                        loadNextActivity(constructSendActivityIntent(vpnCredentialsResource.message, true, getString(R.string.init_vpn_pay), null));
                    else
                        showErrorDialog(vpnCredentialsResource.message);

                }
            }
        });
    }

    private Intent constructSendActivityIntent(String iError, boolean isInit, String iAmount, String iSessionId) {
        Intent aIntent = new Intent(getActivity(), SendActivity.class);
        Bundle aBundle = new Bundle();
        aBundle.putBoolean(AppConstants.EXTRA_IS_VPN_PAY, true);
        aBundle.putBoolean(AppConstants.EXTRA_IS_INIT, isInit);
        aBundle.putString(AppConstants.EXTRA_AMOUNT, iAmount);
        if (iError != null)
            aBundle.putString(AppConstants.EXTRA_INIT_MESSAGE, iError);
        if (iSessionId != null)
            aBundle.putString(AppConstants.EXTRA_SESSION_ID, iSessionId);
        aIntent.putExtras(aBundle);
        return aIntent;
    }

    // Interface interaction methods
    public void showProgressDialog(boolean isHalfDim, String iMessage) {
        if (mListener != null) {
            mListener.onShowProgressDialog(isHalfDim, iMessage);
        }
    }

    public void hideProgressDialog() {
        if (mListener != null) {
            mListener.onHideProgressDialog();
        }
    }

    public void showErrorDialog(String iError) {
        if (mListener != null) {
            mListener.onShowErrorDialog(iError);
        }
    }

    public void loadNextActivity(Intent iIntent) {
        if (mListener != null) {
            mListener.onLoadNextActivity(iIntent);
        }
    }
//    public void loadNextFragment(String iAccountAddress, String iPrivateKey, String iKeystoreFilePath) {
//        if (mListener != null) {
//            AppPreferences.getInstance().saveString(AppConstants.PREFS_ACCOUNT_ADDRESS, iAccountAddress);
//            mListener.onLoadNextFragment(SecureKeysFragment.newInstance(iAccountAddress, iPrivateKey, iKeystoreFilePath));
//        }
//    }

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
    public void onRootViewClicked(VpnList iItemData) {
        Intent aIntent = new Intent(getActivity(), VpnDetailsActivity.class);
        aIntent.putExtra(AppConstants.EXTRA_VPN_LIST, iItemData);
        loadNextActivity(aIntent);
    }

    @Override
    public void onConnectClicked(String iVpnAddress) {
        mViewModel.getVpnServerCredentials(iVpnAddress);
    }
}
