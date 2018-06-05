package sentinelgroup.io.sentinel.ui.fragment;


import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.network.model.TxResult;
import sentinelgroup.io.sentinel.ui.adapter.MaterialSpinnerAdapter;
import sentinelgroup.io.sentinel.ui.adapter.TxHistoryListAdapter;
import sentinelgroup.io.sentinel.ui.custom.CustomSpinner;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.Status;
import sentinelgroup.io.sentinel.viewmodel.TxHistoryViewModel;
import sentinelgroup.io.sentinel.viewmodel.TxHistoryViewModelFactory;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link TxHistoryFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class TxHistoryFragment extends Fragment implements TxHistoryListAdapter.OnItemClickListener, TextWatcher {

    private TxHistoryViewModel mViewModel;

    private OnGenericFragmentInteractionListener mListener;

    private CustomSpinner mCsTokens;
    private SwipeRefreshLayout mSrReload;
    private RecyclerView mRvTransactionList;

    private TxHistoryListAdapter mAdapter;
    private MaterialSpinnerAdapter mSpinnerAdapter;
    private boolean mIsEthHistory;

    public TxHistoryFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment TxHistoryFragment.
     */
    public static TxHistoryFragment newInstance() {
        return new TxHistoryFragment();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_tx_history, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        fragmentLoaded(getString(R.string.transaction_history));
        initViewModel();
    }

    private void initView(View iView) {
        mCsTokens = iView.findViewById(R.id.cs_tokens);
        mSrReload = iView.findViewById(R.id.sr_reload);
        mRvTransactionList = iView.findViewById(R.id.rv_list);
        // Setup RecyclerView
        mRvTransactionList.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.VERTICAL, false));
        mAdapter = new TxHistoryListAdapter(this, getContext());
        mRvTransactionList.setAdapter(mAdapter);
        // setup swipe to refresh layout
        mSrReload.setOnRefreshListener(() -> {
            mViewModel.reloadTxHistory(mIsEthHistory);
            mSrReload.setRefreshing(false);
        });
        // setup adapter for custom spinner
        List<String> input = Arrays.asList(Objects.requireNonNull(getContext()).getResources().getStringArray(R.array.spinner_list));
        mSpinnerAdapter = new MaterialSpinnerAdapter(getContext(), input);
        mCsTokens.setAdapter(mSpinnerAdapter);
        mCsTokens.setSelectedPosition(0);
        mCsTokens.setText(mSpinnerAdapter.getItem(mCsTokens.getSelectedPosition()));
        // set listeners
        mCsTokens.addTextChangedListener(this);
    }

    private void initViewModel() {
        TxHistoryViewModelFactory aFactory = InjectorModule.provideTxHistoryViewModelFactory(getContext());
        mViewModel = ViewModelProviders.of(this, aFactory).get(TxHistoryViewModel.class);

        mViewModel.getTxHistoryLiveEvent().observe(this, txListResource -> {
            if (txListResource != null) {
                if (txListResource.status.equals(Status.LOADING)) {
                    showProgressDialog(true,getString(R.string.loading_tx_history));
                } else if (txListResource.data != null && txListResource.data.size() > 0 && txListResource.status.equals(Status.SUCCESS)) {
                    mAdapter.loadData(txListResource.data);
                    hideProgressDialog();
                } else if (txListResource.message != null && txListResource.status.equals(Status.ERROR)) {
                    showErrorDialog(txListResource.message);
                    hideProgressDialog();
                }
            }
        });
    }

    // Interface interaction methods
    public void fragmentLoaded(String iTitle) {
        if (mListener != null) {
            mListener.onFragmentLoaded(iTitle);
        }
    }

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
            mListener.onShowSingleActionDialog(iError);
        }
    }

    public void loadNextFragment(Fragment iNextFragment) {
        if (mListener != null) {
            mListener.onLoadNextFragment(iNextFragment);
        }
    }

    public void loadNextActivity(Intent iIntent, int iReqCode) {
        if (mListener != null) {
            mListener.onLoadNextActivity(iIntent, iReqCode);
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
    public void onRootViewClicked(TxResult iTxData) {
        loadNextFragment(TxDetailsFragment.newInstance(iTxData));
    }

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {
    }

    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {
    }

    @Override
    public void afterTextChanged(Editable s) {
        mIsEthHistory = s.toString().equalsIgnoreCase("eth");
        mViewModel.reloadTxHistory(mIsEthHistory);
    }
}