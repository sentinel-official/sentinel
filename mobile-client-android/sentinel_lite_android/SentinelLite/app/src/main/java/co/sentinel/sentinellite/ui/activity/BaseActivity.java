package co.sentinel.sentinellite.ui.activity;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.widget.TextView;
import android.widget.Toast;

import co.sentinel.sentinellite.R;
import co.sentinel.sentinellite.ui.custom.OnGenericFragmentInteractionListener;
import co.sentinel.sentinellite.ui.dialog.DoubleActionDialogFragment;
import co.sentinel.sentinellite.ui.dialog.ProgressDialogFragment;
import co.sentinel.sentinellite.ui.dialog.SingleActionDialogFragment;
import co.sentinel.sentinellite.ui.dialog.TripleActionDialogFragment;

import static co.sentinel.sentinellite.util.AppConstants.TAG_DOUBLE_ACTION_DIALOG;
import static co.sentinel.sentinellite.util.AppConstants.TAG_PROGRESS_DIALOG;
import static co.sentinel.sentinellite.util.AppConstants.TAG_SINGLE_ACTION_DIALOG;
import static co.sentinel.sentinellite.util.AppConstants.TAG_TRIPLE_ACTION_DIALOG;

/**
 * All the Activities in the app which needs to show just the toolbar must extend this
 * BaseActivity
 */
public abstract class BaseActivity extends AppCompatActivity implements OnGenericFragmentInteractionListener,
        DoubleActionDialogFragment.OnDialogActionListener, TripleActionDialogFragment.OnDialogActionListener {
    private Toolbar mToolbar;
    private TextView mToolbarTitle;
    private ProgressDialogFragment mPrgDialog;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_container);
        initView();
    }

    /*
     * Instantiate all the views used in the XML and perform other instantiation steps (if needed)
     */
    private void initView() {
        mToolbar = findViewById(R.id.toolbar);
        mToolbarTitle = findViewById(R.id.toolbar_title);
        mPrgDialog = ProgressDialogFragment.newInstance(true);
        // instantiate toolbar
        setupToolbar();
    }

    /*
     * Set the toolbar as the default actionbar and set the home indicator
     */
    private void setupToolbar() {
        setSupportActionBar(mToolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayShowTitleEnabled(false);
            getSupportActionBar().setHomeAsUpIndicator(R.drawable.ic_back);
            getSupportActionBar().setDisplayShowHomeEnabled(true);
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
        setToolbarTitle(getString(R.string.app_name));
    }

    /**
     * Set the toolbar title
     *
     * @param iTitle [String] The title to be shown in the toolbar
     */
    protected void setToolbarTitle(String iTitle) {
        mToolbarTitle.setText(iTitle);
    }

    /**
     * Hides the home icon when it is not required
     */
    protected void hideBackIcon() {
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayShowHomeEnabled(false);
            getSupportActionBar().setDisplayHomeAsUpEnabled(false);
        }
    }

    /**
     * Initialize the Progress Dialog which needs to be shown while loading a screen
     *
     * @param isHalfDim [boolean] Denotes whether the dialog's background should be transparent or
     *                  dimmed
     * @param iMessage  [String] The message text which needs to be shown as Loading message
     */
    protected void showProgressDialog(boolean isHalfDim, String iMessage) {
        toggleProgressDialogState(true, isHalfDim, iMessage == null ? getString(R.string.generic_loading_message) : iMessage);
    }

    /**
     * Hide the Progress Dialog window if it is currently being displayed
     */
    protected void hideProgressDialog() {
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
     * @param iTitleId          [int] The resource id of the title to be displayed (default - "Please Note")
     * @param iMessage          [String] The error message to be displayed
     * @param iPositiveOptionId [int] The resource id of the button text (default - "Ok")
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
     * @param iTitleId          [int] The resource id of the title to be displayed (default - "Please Note")
     * @param iMessage          [String] The error message to be displayed
     * @param iPositiveOptionId [int] The resource id of the positive button text (default - "Ok")
     * @param iNegativeOptionId [int] The resource id of the negative button text (default - "Cancel")
     */
    protected void showDoubleActionError(String iTag, int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId) {
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
     * Copies the string to the clipboard and shows a Toast on completing it
     *
     * @param iCopyString  [String] The text which needs to be copied to the clipboard
     * @param iToastTextId [int] The resource id of the toast message.
     */
    protected void copyToClipboard(String iCopyString, int iToastTextId) {
        ClipboardManager clipboard = (ClipboardManager) this.getSystemService(CLIPBOARD_SERVICE);
        if (clipboard != null) {
            ClipData clip = ClipData.newPlainText(getString(R.string.app_name), iCopyString);
            Toast.makeText(this, iToastTextId, Toast.LENGTH_SHORT).show();
            clipboard.setPrimaryClip(clip);
        }
    }


    /**
     * Implement this method and add your logic to load the fragment into the container
     *
     * @param iFragment [Fragment] The new fragment to be loaded
     */
    public abstract void loadFragment(Fragment iFragment);
}