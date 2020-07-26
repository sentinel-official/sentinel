package co.sentinel.lite.ui.activity;

import android.app.Dialog;
import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.IBinder;
import android.os.RemoteException;
import android.preference.PreferenceManager;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.AppCompatEditText;
import android.support.v7.widget.AppCompatImageButton;
import android.support.v7.widget.Toolbar;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import co.sentinel.lite.BuildConfig;
import co.sentinel.lite.R;
import co.sentinel.lite.SentinelLiteApp;
import co.sentinel.lite.ui.custom.OnGenericFragmentInteractionListener;
import co.sentinel.lite.ui.custom.OnVpnConnectionListener;
import co.sentinel.lite.ui.custom.ProfileAsync;
import co.sentinel.lite.ui.custom.VpnSearchListener;
import co.sentinel.lite.ui.dialog.DoubleActionDialogFragment;
import co.sentinel.lite.ui.dialog.ProgressDialogFragment;
import co.sentinel.lite.ui.dialog.RatingDialogFragment;
import co.sentinel.lite.ui.dialog.SingleActionDialogFragment;
import co.sentinel.lite.ui.dialog.SortFilterByDialogFragment;
import co.sentinel.lite.ui.dialog.TripleActionDialogFragment;
import co.sentinel.lite.ui.fragment.VpnConnectedFragment;
import co.sentinel.lite.ui.fragment.VpnSelectFragment;
import co.sentinel.lite.ui.rating.FiveStarsDialog;
import co.sentinel.lite.ui.rating.NegativeReviewListener;
import co.sentinel.lite.ui.rating.ReviewListener;
import co.sentinel.lite.util.AnalyticsHelper;
import co.sentinel.lite.util.AppConstants;
import co.sentinel.lite.util.AppPreferences;
import co.sentinel.lite.util.DoneOnEditorActionListener;
import co.sentinel.lite.util.Logger;
import de.blinkt.openvpn.LaunchVPN;
import de.blinkt.openvpn.VpnProfile;
import de.blinkt.openvpn.core.ConnectionStatus;
import de.blinkt.openvpn.core.IOpenVPNServiceInternal;
import de.blinkt.openvpn.core.OpenVPNManagement;
import de.blinkt.openvpn.core.OpenVPNService;
import de.blinkt.openvpn.core.ProfileManager;
import de.blinkt.openvpn.core.VpnStatus;

import static android.view.View.GONE;
import static co.sentinel.lite.util.AppConstants.TAG_DOUBLE_ACTION_DIALOG;
import static co.sentinel.lite.util.AppConstants.TAG_PROGRESS_DIALOG;
import static co.sentinel.lite.util.AppConstants.TAG_RATING_DIALOG;
import static co.sentinel.lite.util.AppConstants.TAG_SINGLE_ACTION_DIALOG;
import static co.sentinel.lite.util.AppConstants.TAG_TRIPLE_ACTION_DIALOG;
import static de.blinkt.openvpn.core.OpenVPNService.humanReadableByteCount;

public class DashboardActivity extends AppCompatActivity implements OnGenericFragmentInteractionListener,
        OnVpnConnectionListener, VpnStatus.StateListener, VpnStatus.ByteCountListener, DoubleActionDialogFragment.OnDialogActionListener, View.OnClickListener, NegativeReviewListener, ReviewListener {

    private boolean mHasActivityResult;
    private Toolbar mToolbar;
    private TextView mToolbarTitle;
    private AppCompatImageButton mIbCloseSearch, mIbClearSearch;
    private LinearLayout mLlSearch;
    private AppCompatEditText mEtSearch;
    private ProgressDialogFragment mPrgDialog;
    private ProfileAsync profileAsync;
    private IOpenVPNServiceInternal mService;
    private SharedPreferences mPreferences;
    private ImageView mSearch,mSort;
    private BroadcastReceiver toolbarGone,toolbarVisible;
    private static final String TAG = BaseActivity.class.getSimpleName();


    private ServiceConnection mConnection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName className, IBinder service) {
            mService = IOpenVPNServiceInternal.Stub.asInterface(service);
        }

        @Override
        public void onServiceDisconnected(ComponentName arg0) {
            mService = null;
        }
    };

    private SortFilterByDialogFragment.OnSortFilterDialogActionListener mSortDialogActionListener;
    private VpnSearchListener mVpnListSearchListener;

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
                triggerSearch();
            } else if (TextUtils.isEmpty(s)) {
                clearCurrentSearchString();
                triggerSearch();
            }
        }
    };

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);
        initView();
        initListeners();
        loadVpnFragment(null);

        FiveStarsDialog fiveStarsDialog = new FiveStarsDialog(this,"");
        fiveStarsDialog.setRateText("Your feedback helps us improve.")
                .setTitle("Please take a moment to rate us.")
                .setForceMode(false)
                .setUpperBound(4)
                .setReviewListener(this)
                .setNegativeReviewListener(this)
                .showAfter(3);

        if(mPreferences.getBoolean("autoMode",false)==true){
            new Handler().postDelayed(new Runnable() {
                @Override
                public void run() {
                    //Auto connect on app launch
                    Intent autoIntent = new Intent("auto");
                    sendBroadcast(autoIntent);
                }
            }, 1000);
        }

    }

    @Override
    public void onNegativeReview(int stars) {
        Log.d(TAG, "Negative review " + stars);
    }

    @Override
    public void onReview(int stars) {
        Log.d(TAG, "Review " + stars);
    }

    @Override
    protected void onStart() {
        super.onStart();
        // setup VPN listeners & services
        Intent intent = new Intent(this, OpenVPNService.class);
        intent.setAction(OpenVPNService.START_SERVICE);
        bindService(intent, mConnection, Context.BIND_AUTO_CREATE);
        registerReceivers();
    }

    @Override
    protected void onResume() {
        VpnStatus.addStateListener(this);
        VpnStatus.addByteCountListener(this);
        super.onResume();
    }

    @Override
    protected void onPause() {
        VpnStatus.removeStateListener(this);
        VpnStatus.removeByteCountListener(this);
        super.onPause();
    }

    @Override
    protected void onStop() {
        super.onStop();
        unbindService(mConnection);
        unregisterReceiver(toolbarGone);
        unregisterReceiver(toolbarVisible);
    }

    @Override
    public void onBackPressed() {
        if (mLlSearch.getVisibility() == View.VISIBLE)
            closeSearch();
        else if(mPreferences.getBoolean("regionvisibility",false)==true){
            Intent intent = new Intent("closelist");
            sendBroadcast(intent);
            mPreferences.edit().putBoolean("regionvisibility",false).apply();
            mSearch.setVisibility(GONE);
            mSort.setVisibility(GONE);
        }
        else
            super.onBackPressed();
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

    public void setVpnListSearchListener(VpnSearchListener iVpnListSearchListener) {
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

    /*
     *  Show the Helper screens when the user is opening the app for the first time
     */


    /*
     * Instantiate all the views used in the XML and perform other instantiation steps (if needed)
     */
    private void initView() {
        mPreferences = PreferenceManager.getDefaultSharedPreferences(this);
        mToolbar = findViewById(R.id.toolbar);
        mToolbarTitle = findViewById(R.id.toolbar_title);
        mPrgDialog = ProgressDialogFragment.newInstance(true);

        mLlSearch = findViewById(R.id.ll_search);
        mEtSearch = findViewById(R.id.et_search);
        mIbCloseSearch = findViewById(R.id.ib_close_search);
        mIbClearSearch = findViewById(R.id.ib_clear_search);
        mSearch = findViewById(R.id.searchBtn);
        mSort = findViewById(R.id.sortBtn);
        // instantiate toolbar
        setupToolbar();
        // add listeners
        mSearch.setOnClickListener(v -> openSearch());
        mSort.setOnClickListener(v -> {
            closeSearch();
            openSortDialog();
        });
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

    /*
     * Set the toolbar as the default actionbar and set the home indicator
     */
    private void setupToolbar() {
        setSupportActionBar(mToolbar);
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayShowTitleEnabled(false);
            actionBar.setDisplayHomeAsUpEnabled(false);
        }
        setToolbarTitle(getString(R.string.app_name));
    }

    /**
     * Set the toolbar title
     *
     * @param iTitle [String] The title to be shown in the toolbar
     */
    protected void setToolbarTitle(String iTitle) {
        findViewById(R.id.toolbar_icon).setVisibility(iTitle.equals(getString(R.string.app_name)) ? View.VISIBLE : View.GONE);
        mToolbarTitle.setText(iTitle);
    }

    /**
     * Shows dialog to give rating for previous dVPN session.
     */
    private void showRatingDialog() {
        RatingDialogFragment.newInstance().show(getSupportFragmentManager(), TAG_RATING_DIALOG);
    }

    /**
     * Initialize the Progress Dialog which needs to be shown while loading a screen
     *
     * @param isHalfDim [boolean] Denotes whether the dialog's background should be transparent or
     *                  dimmed
     * @param iMessage  [String] The message text which needs to be shown as Loading message
     */
    private void showProgressDialog(boolean isHalfDim, String iMessage) {
        toggleProgressDialogState(true, isHalfDim, iMessage == null ? getString(R.string.generic_loading_message) : iMessage);
    }

    /**
     * Hide the Progress Dialog window if it is currently being displayed
     */
    private void hideProgressDialog() {
        toggleProgressDialogState(false, false, null);
    }

    /*
     * Helper method to initialize & update the attributes of the Progress Dialog and to toggle
     * it's visibility
     */
    private void toggleProgressDialogState(boolean isShow, boolean isHalfDim, String iMessage) {
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(TAG_PROGRESS_DIALOG);
        if (isShow) {
            if (aFragment == null) {
                if (!isHalfDim)
                    mPrgDialog.setNoDim();
                mPrgDialog.setLoadingMessage(iMessage);
                mPrgDialog.show(getSupportFragmentManager(), TAG_PROGRESS_DIALOG);
            } else {
                mPrgDialog.updateLoadingMessage(iMessage);
            }
        } else {
            if (aFragment != null && mPrgDialog != null)
                mPrgDialog.dismissAllowingStateLoss();
        }
    }

    /**
     * Shows an Error dialog with a Single button
     *
     * @param iTitleId          [int] The resource id of the title to be displayed
     * @param iMessage          [String] The error message to be displayed
     * @param iPositiveOptionId [int] The resource id of the button text
     */
    protected void showSingleActionError(int iTitleId, String iMessage, int iPositiveOptionId) {
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(TAG_SINGLE_ACTION_DIALOG);
        int aTitleId = iTitleId != -1 ? iTitleId : R.string.please_note;
        int aPositiveOptionText = iPositiveOptionId != -1 ? iPositiveOptionId : android.R.string.ok;
        if (aFragment == null)
            SingleActionDialogFragment.newInstance(aTitleId, iMessage, aPositiveOptionText)
                    .show(getSupportFragmentManager(), TAG_SINGLE_ACTION_DIALOG);
    }

    /**
     * Shows an Error dialog with a Two buttons
     *
     * @param iTag              [String] The Tag assigned to the fragment when it's added to the container
     * @param iTitleId          [int] The resource id of the title to be displayed
     * @param iMessage          [String] The error message to be displayed
     * @param iPositiveOptionId [int] The resource id of the positive button text
     * @param iNegativeOptionId [int] The resource id of the negative button text
     */
    protected void showDoubleActionDialog(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId) {
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(TAG_DOUBLE_ACTION_DIALOG);
        int aTitleId = iTitleId != -1 ? iTitleId : R.string.please_note;
        int aPositiveOptionId = iPositiveOptionId != -1 ? iPositiveOptionId : android.R.string.ok;
        int aNegativeOptionId = iNegativeOptionId != -1 ? iNegativeOptionId : android.R.string.cancel;
        if (aFragment == null)
            DoubleActionDialogFragment.newInstance(iTag, aTitleId, iMessage, aPositiveOptionId, aNegativeOptionId)
                    .show(getSupportFragmentManager(), TAG_DOUBLE_ACTION_DIALOG);
    }

    /**
     * Shows a dialog with a Three buttons
     *
     * @param iTag              [String] The Tag assigned to the fragment when it's added to the container
     * @param iTitleId          [int] The resource id of the title to be displayed (default - "Please Note")
     * @param iMessage          [String] The error message to be displayed
     * @param iPositiveOptionId [int] The resource id of the positive button text (default - "Yes")
     * @param iNegativeOptionId [int] The resource id of the negative button text (default - "No")
     * @param iNeutralOptionId  [int] The resource id of the neutral button text (default - "Cancel")
     */
    protected void showTripleActionError(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId, int iNeutralOptionId) {
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(TAG_TRIPLE_ACTION_DIALOG);
        int aTitleId = iTitleId != -1 ? iTitleId : R.string.please_note;
        int aPositiveOptionId = iPositiveOptionId != -1 ? iPositiveOptionId : android.R.string.yes;
        int aNegativeOptionId = iNegativeOptionId != -1 ? iNegativeOptionId : android.R.string.no;
        int aNeutralOptionId = iNeutralOptionId != -1 ? iNeutralOptionId : android.R.string.cancel;
        if (aFragment == null)
            TripleActionDialogFragment.newInstance(iTag, aTitleId, iMessage, aPositiveOptionId, aNegativeOptionId, aNeutralOptionId)
                    .show(getSupportFragmentManager(), TAG_TRIPLE_ACTION_DIALOG);
    }

    /**
     * Replace the existing fragment in the container with the new fragment passed in this method's
     * parameters
     *
     * @param iFragment [Fragment] The fragment which needs to be displayed
     */
    private void loadFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, iFragment).commit();
        invalidateOptionsMenu();
        closeSearch();
    }

    /*
     * Replaces the existing fragment in the container with VpnSelectFragment
     */
    private void loadVpnFragment(String iMessage) {
        loadFragment(VpnSelectFragment.newInstance(iMessage));
    }
    /*
     * Load the VPN profile to which connection is to be established, observe it's load state and
     * perform the necessary action
     */
    private void setupProfile(String iPath) {
        if (!SentinelLiteApp.isVpnConnected) {
            profileAsync = new ProfileAsync(this, iPath, new ProfileAsync.OnProfileLoadListener() {
                @Override
                public void onProfileLoadSuccess() {
                    startVPN();
                }

                @Override
                public void onProfileLoadFailed(String iMessage) {
                    Toast.makeText(DashboardActivity.this, "Init Fail" + iMessage, Toast.LENGTH_SHORT).show();
                }
            });
            profileAsync.execute();
        }
    }

    /*
     * Start VPN connection after the VPN profile is loaded successfully
     */
    private void startVPN() {
        try {
            ProfileManager pm = ProfileManager.getInstance(this);
            VpnProfile profile = pm.getProfileByName(Build.MODEL);//
            startVPNConnection(profile);
        } catch (Exception ex) {
            SentinelLiteApp.isVpnConnected = false;
        }
    }

    /*
     * Launch the activity which handles the VPN connection by passing it the VPN profile
     */
    private void startVPNConnection(VpnProfile profile) {
        Intent intent = new Intent(getApplicationContext(), LaunchVPN.class);
        intent.putExtra(LaunchVPN.EXTRA_KEY, profile.getUUID().toString());
        intent.setAction(Intent.ACTION_MAIN);
        startActivity(intent);
    }

    /*
     * Stop the VPN service and delete the last used VPN profile
     */
    private void stopVPNConnection() {
        ProfileManager.setConntectedVpnProfileDisconnected(this);
        if (mService != null) {
            try {
                mService.stopVPN(false);
            } catch (RemoteException e) {
                VpnStatus.logException(e);
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case AppConstants.REQ_VPN_CONNECT:
                if (resultCode == RESULT_OK)
                    mHasActivityResult = true;
                break;

            case AppConstants.REQ_LANGUAGE:
                if (resultCode == RESULT_OK)
                    reloadApp();
                else
                    loadVpnFragment(null);
                break;
        }
    }

    /*
     * Reload the app after a new language is set
     */
    private void reloadApp() {
        Intent aIntent = new Intent(this, DashboardActivity.class);
        aIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        finish();
        startActivity(aIntent);
    }

    @Override
    public void onFragmentLoaded(String iTitle) {
        // Unimplemented interface method
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
        showDoubleActionDialog(iTag, iTitleId, iMessage, iPositiveOptionId, iNegativeOptionId);
    }

    @Override
    public void onShowTripleActionDialog(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId, int iNeutralOptionId) {
        showTripleActionError(iTag, iTitleId, iMessage, iPositiveOptionId, iNegativeOptionId, iNeutralOptionId);
    }

    @Override
    public void onCopyToClipboardClicked(String iCopyString, int iToastTextId) {

    }

    @Override
    public void onLoadNextFragment(Fragment iNextFragment) {
        loadFragment(iNextFragment);
        hideKeyboard();
    }

    @Override
    public void onLoadNextActivity(Intent iIntent, int iReqCode) {
        if (iIntent != null)
            if (iReqCode != AppConstants.REQ_CODE_NULL)
                startActivityForResult(iIntent, iReqCode);
            else
                startActivity(iIntent);
        hideKeyboard();
    }

    @Override
    public void onVpnConnectionInitiated(String iVpnConfigFilePath) {
        loadFragment(VpnConnectedFragment.newInstance());
        setupProfile(iVpnConfigFilePath);
    }

    @Override
    public void onVpnDisconnectionInitiated() {
        SentinelLiteApp.isVpnConnected = true;
        stopVPNConnection();
    }

    @Override
    public void onActionButtonClicked(String iTag, Dialog iDialog, int iButtonType) {
        // unimplemented interface method
    }

    @Override
    public void updateState(String state, String logMessage, int localizedResId, ConnectionStatus level) {
        Logger.logError("VPN_STATE", state + " - " + logMessage + " : " + getString(localizedResId), null);

        runOnUiThread(() -> {
            Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
            // Called when the VPN connection terminates
            if (state.equals("USER_VPN_PERMISSION_CANCELLED")
                    || (state.equals("CONNECTRETRY"))
                    || (state.equals("NOPROCESS") && SentinelLiteApp.isVpnConnected)) {
                AppPreferences.getInstance().saveLong(AppConstants.PREFS_CONNECTION_START_TIME, 0L);
                switch (state) {
                    case "USER_VPN_PERMISSION_CANCELLED":
                        loadVpnFragment(getString(localizedResId));
                        break;
                    case "CONNECTRETRY":
                        onVpnDisconnectionInitiated();
                        loadVpnFragment(getString(R.string.network_lost));
                        break;
                    default:
                        showRatingDialog();
                        loadVpnFragment(null);
                        AnalyticsHelper.triggerOVPNDisconnectDone();
                        break;
                }
                SentinelLiteApp.isVpnInitiated = false;
                SentinelLiteApp.isVpnConnected = false;
                SentinelLiteApp.isVpnReconnectFailed = false;
            } else {
                if (aFragment != null && aFragment instanceof VpnConnectedFragment) {
                    runOnUiThread(() -> {
                        ((VpnConnectedFragment) aFragment).updateStatus(getString(localizedResId));
                    });
                }
            }

            if (state.equals("CONNECTED")) {
                AnalyticsHelper.triggerOVPNConnectDone();
            }

            if (SentinelLiteApp.isVpnReconnectFailed) {
                AppPreferences.getInstance().saveLong(AppConstants.PREFS_CONNECTION_START_TIME, 0L);
                onVpnDisconnectionInitiated();
                loadVpnFragment(getString(R.string.network_lost));
                SentinelLiteApp.isVpnInitiated = false;
                SentinelLiteApp.isVpnConnected = false;
                SentinelLiteApp.isVpnReconnectFailed = false;
            }

            // Called when user connects to a VPN node from other activity
            if (mHasActivityResult) {
                onVpnConnectionInitiated(AppPreferences.getInstance().getString(AppConstants.PREFS_CONFIG_PATH));
                mHasActivityResult = false;
            }
        });
    }

    @Override
    public void updateByteCount(long in, long out, long diffIn, long diffOut) {
        Fragment aFragment = getSupportFragmentManager().findFragmentById(R.id.fl_container);
        if (aFragment != null && aFragment instanceof VpnConnectedFragment) {
            String aDownloadSpeed = humanReadableByteCount(diffIn / OpenVPNManagement.mBytecountInterval, true, getResources());
            String aUploadSpeed = humanReadableByteCount(diffOut / OpenVPNManagement.mBytecountInterval, true, getResources());
            String aTotalData = humanReadableByteCount(in, false, getResources());
            runOnUiThread(() -> {
                ((VpnConnectedFragment) aFragment).updateByteCount(aDownloadSpeed, aUploadSpeed, aTotalData);
            });
        }
    }

    @Override
    public void setConnectedVPN(String uuid) {
    }

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

    public void registerReceivers(){
        toolbarGone = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String action = intent.getAction();
                if (action.equals("toolbargone")){
                        mSearch.setVisibility(GONE);
                        mSort.setVisibility(GONE);
                }
            }
        };
        registerReceiver(toolbarGone, new IntentFilter("toolbargone"));

        toolbarVisible = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String action = intent.getAction();
                if (action.equals("toolbarvisible")){
                        mSearch.setVisibility(View.VISIBLE);
                        mSort.setVisibility(View.VISIBLE);
                }
            }
        };
        registerReceiver(toolbarVisible, new IntentFilter("toolbarvisible"));
    }
}