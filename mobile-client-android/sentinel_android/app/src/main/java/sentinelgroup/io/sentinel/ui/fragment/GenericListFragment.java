package sentinelgroup.io.sentinel.ui.fragment;


import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.util.ArrayList;
import java.util.List;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.network.model.GenericListItem;
import sentinelgroup.io.sentinel.ui.adapter.GenericListAdapter;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.util.AppConstants;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link GenericListFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class GenericListFragment extends Fragment implements GenericListAdapter.OnItemClickListener {
    private static final String ARG_REQ_CODE = "req_code";

    private int mReqCode;

    private OnGenericFragmentInteractionListener mListener;

    private SwipeRefreshLayout mSrReload;
    private RecyclerView mRvHelpList;
    private GenericListAdapter mAdapter;

    public GenericListFragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment.
     *
     * @return A new instance of fragment GenericListFragment.
     */
    public static GenericListFragment newInstance(int iReqCode) {
        GenericListFragment aFragment = new GenericListFragment();
        Bundle args = new Bundle();
        args.putInt(ARG_REQ_CODE, iReqCode);
        aFragment.setArguments(args);
        return aFragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mReqCode = getArguments().getInt(ARG_REQ_CODE);
        }
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
        fragmentLoaded(getString(mReqCode == AppConstants.REQ_HELP ? R.string.help : R.string.social_links));
        mAdapter.loadData(getListData());
    }

    private List<GenericListItem> getListData() {
        List<GenericListItem> aItem = new ArrayList<>();
        if (mReqCode == AppConstants.REQ_SOCIAL_LINKS) {
            aItem.add(new GenericListItem(R.drawable.ic_telegram, R.string.telegram, getString(R.string.telegram_url)));
            aItem.add(new GenericListItem(R.drawable.ic_medium, R.string.medium, getString(R.string.medium_url)));
            aItem.add(new GenericListItem(R.drawable.ic_twitter, R.string.twitter, getString(R.string.twitter_url)));
            aItem.add(new GenericListItem(R.drawable.ic_website, R.string.website, getString(R.string.website_url)));
        } else if (mReqCode == AppConstants.REQ_HELP) {
            aItem.add(new GenericListItem(R.drawable.ic_faq, R.string.faq, ""));
            aItem.add(new GenericListItem(R.drawable.ic_check_updates, R.string.check_for_updates, ""));
        }
        return aItem;
    }

    private void initView(View iView) {
        mSrReload = iView.findViewById(R.id.sr_reload);
        mRvHelpList = iView.findViewById(R.id.rv_list);
        // Setup RecyclerView
        mRvHelpList.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.VERTICAL, false));
        mAdapter = new GenericListAdapter(this, getContext());
        mRvHelpList.setAdapter(mAdapter);
        // disable swipe to refresh layout
        mSrReload.setEnabled(false);
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

    public void loadNextFragment(Fragment iFragment) {
        if (mListener != null) {
            mListener.onLoadNextFragment(iFragment);
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
        hideProgressDialog();
        super.onDetach();
        mListener = null;
    }

    @Override
    public void onRootViewClicked(String iUrl) {
        if (iUrl != null && !iUrl.isEmpty() && (iUrl.startsWith("http://") || iUrl.startsWith("https://"))) {
            Intent aIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(iUrl));
            loadNextActivity(aIntent, AppConstants.REQ_CODE_NULL);
        } else
            showErrorDialog(getString(R.string.link_coming_soon));
    }
}