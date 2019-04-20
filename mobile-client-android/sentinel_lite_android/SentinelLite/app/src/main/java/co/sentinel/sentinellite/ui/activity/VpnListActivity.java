package co.sentinel.sentinellite.ui.activity;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.AppCompatEditText;
import android.support.v7.widget.AppCompatImageButton;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.LinearLayout;

import co.sentinel.sentinellite.R;
import co.sentinel.sentinellite.network.model.VpnListEntity;
import co.sentinel.sentinellite.ui.custom.OnVpnConnectionListener;
import co.sentinel.sentinellite.ui.custom.VpnListSearchListener;
import co.sentinel.sentinellite.ui.dialog.SortFilterByDialogFragment;
import co.sentinel.sentinellite.ui.fragment.VpnDetailsFragment;
import co.sentinel.sentinellite.ui.fragment.VpnListFragment;
import co.sentinel.sentinellite.util.AppConstants;
import co.sentinel.sentinellite.util.DoneOnEditorActionListener;

public class VpnListActivity extends BaseActivity implements OnVpnConnectionListener, View.OnClickListener {
    private VpnListEntity mVpnListData;
    private AppCompatImageButton mIbCloseSearch, mIbClearSearch;
    private LinearLayout mLlSearch;
    private AppCompatEditText mEtSearch;
    private SortFilterByDialogFragment.OnSortFilterDialogActionListener mSortDialogActionListener;
    private VpnListSearchListener mVpnListSearchListener;
    private MenuItem mMenuSearch, mMenuSort;

    private boolean toShowOptionsMenu = true;

    private boolean toFilterByBookmark;
    private String mCurrentSortType = AppConstants.SORT_BY_DEFAULT;
    private StringBuilder mCurrentSearchString = new StringBuilder();
    private TextWatcher mSearchWatcher = new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {

        }

        @Override
        public void afterTextChanged(Editable s) {
            mIbClearSearch.setVisibility(TextUtils.isEmpty(s) ? View.GONE : View.VISIBLE);
            if (s.length() >= 3) {
                setCurrentSearchString(s.toString());
                VpnListActivity.this.triggerSearch();
            } else if (TextUtils.isEmpty(s)) {
                clearCurrentSearchString();
                VpnListActivity.this.triggerSearch();
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getIntentExtras();
        initView();
        initListeners();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_dashboard, menu);
        mMenuSearch = menu.findItem(R.id.action_search);
        mMenuSort = menu.findItem(R.id.action_sort);
        mMenuSearch.setVisible(toShowOptionsMenu);
        mMenuSort.setVisible(toShowOptionsMenu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                onBackPressed();
                return true;

            case R.id.action_search:
                openSearch();
                return true;

            case R.id.action_sort:
                openSortDialog();
                return true;

            default:
                return super.onOptionsItemSelected(item);
        }
    }

    /*
     * Update the Options Menu icon
     */
    public void toggleItemState() {
        mMenuSort.setIcon((!getCurrentSortType().equals(AppConstants.SORT_BY_DEFAULT) || toFilterByBookmark()) ? R.drawable.ic_sorted : R.drawable.ic_sort);
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    public void onBackPressed() {
        if (mLlSearch.getVisibility() == View.VISIBLE)
            closeSearch();
        else {
            setResult(RESULT_CANCELED);
            super.onBackPressed();
            toShowOptionsMenu = getCurrentFragment() instanceof VpnListFragment;
            invalidateOptionsMenu();
            overridePendingTransition(R.anim.enter_left_to_right, R.anim.exit_right_to_left);
        }
    }

    /*
     * Get intent extras passed to it from the calling activity
     */
    private void getIntentExtras() {
        if (getIntent().getExtras() != null) {
            mVpnListData = (VpnListEntity) getIntent().getSerializableExtra(AppConstants.EXTRA_VPN_LIST);
            toShowOptionsMenu = false;
            loadFragment(VpnDetailsFragment.newInstance(mVpnListData));
        } else {
            toShowOptionsMenu = true;
            loadFragment(VpnListFragment.newInstance());
        }
    }

    /*
     * Instantiate all the views used in the XML and perform other instantiation steps (if needed)
     */
    private void initView() {
        mLlSearch = findViewById(R.id.ll_search);
        mEtSearch = findViewById(R.id.et_search);
        mIbCloseSearch = findViewById(R.id.ib_close_search);
        mIbClearSearch = findViewById(R.id.ib_clear_search);
    }

    /**
     * Setup Listeners for all views
     */
    private void initListeners() {
        mEtSearch.addTextChangedListener(mSearchWatcher);
        mEtSearch.setOnEditorActionListener(new DoneOnEditorActionListener());
        mIbCloseSearch.setOnClickListener(this);
        mIbClearSearch.setOnClickListener(this);
    }

    /**
     * Add the fragment to the container which is passed in this method's parameters
     *
     * @param iFragment [Fragment] The fragment which needs to be displayed
     */
    private void addFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().add(R.id.fl_container, iFragment).addToBackStack(null).commit();
        toShowOptionsMenu = iFragment instanceof VpnListFragment;
        invalidateOptionsMenu();
    }

    private Fragment getCurrentFragment() {
        return getSupportFragmentManager().findFragmentById(R.id.fl_container);
    }

    public void setCurrentSearchString(String iSearchQuery) {
        mCurrentSearchString.replace(0, mCurrentSearchString.length(), iSearchQuery);
    }

    public void clearCurrentSearchString() {
        mCurrentSearchString.delete(0, mCurrentSearchString.length());
    }

    public boolean toFilterByBookmark() {
        return toFilterByBookmark;
    }

    public void setFilterByBookmark(boolean toFilterByBookmark) {
        this.toFilterByBookmark = toFilterByBookmark;
    }

    public String getCurrentSearchString() {
        return "%" + mCurrentSearchString.toString() + "%";
    }

    public void setCurrentSortType(String iSortType) {
        mCurrentSortType = iSortType;
    }

    public String getCurrentSortType() {
        return mCurrentSortType;
    }

    public void setVpnListSearchListener(VpnListSearchListener iVpnListSearchListener) {
        mVpnListSearchListener = iVpnListSearchListener;
    }

    public void removeVpnListSearchListener() {
        mVpnListSearchListener = null;
    }

    public void setSortDialogActionListener(SortFilterByDialogFragment.OnSortFilterDialogActionListener iSortDialogActionListener) {
        mSortDialogActionListener = iSortDialogActionListener;
    }

    public void removeSortDialogActionListener() {
        mSortDialogActionListener = null;
    }

    private void triggerSearch() {
        if (mVpnListSearchListener != null) {
            mVpnListSearchListener.onSearchTriggered(getCurrentSearchString());
        }
    }

    private void openSearch() {
        mLlSearch.setVisibility(View.VISIBLE);
        mEtSearch.setFocusable(true);
        mEtSearch.setFocusableInTouchMode(true);
        mEtSearch.requestFocus();
        showKeyboard(mEtSearch);
    }

    private void openSortDialog() {
        if (mSortDialogActionListener != null) {
            SortFilterByDialogFragment.newInstance(AppConstants.TAG_SORT_BY, getCurrentSortType(), toFilterByBookmark(), mSortDialogActionListener).show(getSupportFragmentManager(), AppConstants.SORT_BY_DIALOG_TAG);
        }
    }

    private void closeSearch() {
        hideKeyboard();
        mLlSearch.setVisibility(View.GONE);
        mEtSearch.getText().clear();
        mEtSearch.clearFocus();
        mCurrentSearchString.delete(0, mCurrentSearchString.length());
    }

    private void showKeyboard(View iView) {
        InputMethodManager aInputMethodManager = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        assert aInputMethodManager != null;
        aInputMethodManager.showSoftInput(iView, InputMethodManager.SHOW_FORCED);
    }

    private void hideKeyboard() {
        InputMethodManager aInputMethodManager = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        //Find the currently focused view, so we can grab the correct window token from it.
        View view = getCurrentFocus();
        //If no view currently has focus, create a new one, just so we can grab a window token from it
        if (view == null) {
            view = new View(this);
        }
        if (aInputMethodManager != null) {
            aInputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
    }

    /**
     * Replace the existing fragment in the container with the new fragment passed in this method's
     * parameters
     *
     * @param iFragment [Fragment] The fragment which needs to be displayed
     */
    @Override
    public void loadFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, iFragment).commit();
        toShowOptionsMenu = iFragment instanceof VpnListFragment;
        invalidateOptionsMenu();
    }

    // Listener implementations
    @Override
    public void onFragmentLoaded(String iTitle) {
        setToolbarTitle(iTitle);
    }

    @Override
    public void onShowProgressDialog(boolean isHalfDim, String iMessage) {
        showProgressDialog(isHalfDim, iMessage);
    }

    @Override
    public void onHideProgressDialog() {
        hideProgressDialog();
    }

    @Override
    public void onShowSingleActionDialog(int iTitleId, String iMessage, int iPositiveOptionId) {
        showSingleActionError(iTitleId, iMessage, iPositiveOptionId);
    }

    @Override
    public void onShowDoubleActionDialog(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId) {
        showDoubleActionError(iTag, iTitleId, iMessage, iPositiveOptionId, iNegativeOptionId);
    }

    @Override
    public void onShowTripleActionDialog(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId, int iNeutralOptionId) {
        showTripleActionError(iTag, iTitleId, iMessage, iPositiveOptionId, iNegativeOptionId, iNeutralOptionId);
    }

    @Override
    public void onCopyToClipboardClicked(String iCopyString, int iToastTextId) {
        copyToClipboard(iCopyString, iToastTextId);
    }

    @Override
    public void onLoadNextFragment(Fragment iNextFragment) {
        addFragment(iNextFragment);
    }

    @Override
    public void onLoadNextActivity(Intent iIntent, int iReqCode) {
        if (iIntent != null)
            startActivityForResult(iIntent, iReqCode);
        else {
            setResult(RESULT_OK);
            finish();
        }
    }

    @Override
    public void onActionButtonClicked(String iTag, Dialog iDialog, int iButtonType) {
        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        iDialog.dismiss();
    }

    @Override
    public void onVpnConnectionInitiated(String iVpnConfigFilePath) {
        // Unimplemented interface method
    }

    @Override
    public void onVpnDisconnectionInitiated() {
        // Unimplemented interface method
    }

    /**
     * Called when a view has been clicked.
     *
     * @param v The view that was clicked.
     */
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.ib_close_search:
                closeSearch();
                break;
            case R.id.ib_clear_search:
                mEtSearch.getText().clear();
                break;
            default:
                break;
        }
    }
}