package sentinelgroup.io.sentinel.ui.dialog;

import android.app.Dialog;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.DialogFragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import java.util.ArrayList;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.network.model.GenericListItem;
import sentinelgroup.io.sentinel.ui.adapter.GenericListAdapter;
import sentinelgroup.io.sentinel.util.AppConstants;

public class SortByDialogFragment extends DialogFragment {
    public static final String ARG_TAG = "tag";
    public static final String ARG_CURRENT_SORT_TYPE = "currentSortType";

    private String mTag;
    private String mCurrentSortType;

    private GenericListAdapter mAdapter;
    private ArrayList<GenericListItem> mSortTypeList = new ArrayList<>();

    private int mPreviousSortIndex = 0;

    private OnSortDialogActionListener mListener;

    private GenericListAdapter.OnItemClickListener mItemClickListener = new GenericListAdapter.OnItemClickListener() {
        @Override
        public void onRootViewClicked(GenericListItem iItem) {
            mSortTypeList.get(mPreviousSortIndex).setSelected(false);
            iItem.setSelected(true);
            mPreviousSortIndex = mSortTypeList.indexOf(iItem);
            mAdapter.notifyDataSetChanged();
        }
    };

    public SortByDialogFragment() {

    }

    public static SortByDialogFragment newInstance(String iTag, String iCurrentSortType, OnSortDialogActionListener iListener) {
        SortByDialogFragment aSortByDialogFragment = new SortByDialogFragment();
        Bundle args = new Bundle();
        args.putString(ARG_TAG, iTag);
        args.putString(ARG_CURRENT_SORT_TYPE, iCurrentSortType);
        aSortByDialogFragment.mListener = iListener;
        aSortByDialogFragment.setArguments(args);
        return aSortByDialogFragment;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mTag = getArguments().getString(ARG_TAG);
            mCurrentSortType = getArguments().getString(ARG_CURRENT_SORT_TYPE);
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_sort_by_dialog, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        initView(view);
        initSortTypeList();
    }

    private void initView(View iView) {
        Button aBtnNegative = iView.findViewById(R.id.btn_dialog_negative);
        aBtnNegative.setOnClickListener(v -> onActionButtonClicked(false));
        Button aBtnPositive = iView.findViewById(R.id.btn_dialog_positive);
        aBtnPositive.setOnClickListener(v -> onActionButtonClicked(true));

        RecyclerView aRvSortTypeList = iView.findViewById(R.id.rv_sort_type_list);
        aRvSortTypeList.setLayoutManager(new LinearLayoutManager(getActivity()));

        mAdapter = new GenericListAdapter(mItemClickListener, getActivity());
        mAdapter.loadData(mSortTypeList);

        aRvSortTypeList.setAdapter(mAdapter);
    }

    private void initSortTypeList() {
        mSortTypeList.add(new GenericListItem(getString(R.string.sort_by_default), AppConstants.SORT_BY_DEFAULT, mCurrentSortType.equals(AppConstants.SORT_BY_DEFAULT)));
        mSortTypeList.add(new GenericListItem(getString(R.string.sort_by_latency_d), AppConstants.SORT_BY_LATENCY_D, mCurrentSortType.equals(AppConstants.SORT_BY_LATENCY_D)));
        mSortTypeList.add(new GenericListItem(getString(R.string.sort_by_bandwidth_d), AppConstants.SORT_BY_BANDWIDTH_D, mCurrentSortType.equals(AppConstants.SORT_BY_BANDWIDTH_D)));
        mSortTypeList.add(new GenericListItem(getString(R.string.sort_by_rating_d), AppConstants.SORT_BY_RATING_D, mCurrentSortType.equals(AppConstants.SORT_BY_RATING_D)));
        mSortTypeList.add(new GenericListItem(getString(R.string.sort_by_country_a), AppConstants.SORT_BY_COUNTRY_A, mCurrentSortType.equals(AppConstants.SORT_BY_COUNTRY_A)));
        mSortTypeList.add(new GenericListItem(getString(R.string.sort_by_price_i), AppConstants.SORT_BY_PRICE_I, mCurrentSortType.equals(AppConstants.SORT_BY_PRICE_I)));
        mSortTypeList.add(new GenericListItem(getString(R.string.sort_by_price_d), AppConstants.SORT_BY_PRICE_D, mCurrentSortType.equals(AppConstants.SORT_BY_PRICE_D)));
    }

    private void onActionButtonClicked(boolean isPositiveButton) {
        if (mListener != null) {
            mListener.onSortTypeSelected(mTag, getDialog(), isPositiveButton, isPositiveButton ? mSortTypeList.get(mPreviousSortIndex) : null);
        }
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
    public interface OnSortDialogActionListener {
        /**
         * Notifies the observer when the dialog's button is clicked
         *
         * @param iTag             [String] The Tag assigned to the fragment when it's added to the
         *                         container
         * @param iDialog          [Dialog] The instance of this dialog
         * @param isPositiveButton [boolean] Indicates if the button pressed in positive button or
         *                         negative button
         */
        void onSortTypeSelected(String iTag, Dialog iDialog, boolean isPositiveButton, GenericListItem iSelectedSortType);
    }

}
