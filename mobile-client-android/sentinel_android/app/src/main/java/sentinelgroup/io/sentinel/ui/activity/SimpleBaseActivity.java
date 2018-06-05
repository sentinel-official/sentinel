package sentinelgroup.io.sentinel.ui.activity;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.widget.TextView;
import android.widget.Toast;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.custom.OnGenericFragmentInteractionListener;
import sentinelgroup.io.sentinel.ui.dialog.ProgressDialogFragment;
import sentinelgroup.io.sentinel.ui.dialog.SingleActionDialogFragment;

import static sentinelgroup.io.sentinel.util.AppConstants.PROGRESS_DIALOG_TAG;
import static sentinelgroup.io.sentinel.util.AppConstants.SINGLE_ACTION_DIALOG_TAG;

public abstract class SimpleBaseActivity extends AppCompatActivity implements OnGenericFragmentInteractionListener {
    private Toolbar mToolbar;
    private TextView mToolbarTitle;
    private ProgressDialogFragment mPrgDialog;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_container_simple);
        initView();
    }

    private void initView() {
        // Instantiate
        mToolbar = findViewById(R.id.toolbar);
        mToolbarTitle = mToolbar.findViewById(R.id.toolbar_title);
        mPrgDialog = ProgressDialogFragment.newInstance(true);
        setupToolbar();
    }

    private void setupToolbar() {
        // setSupportActionBar and set its props
        setSupportActionBar(mToolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayShowTitleEnabled(false);
            getSupportActionBar().setHomeAsUpIndicator(R.drawable.ic_back);
            getSupportActionBar().setDisplayShowHomeEnabled(true);
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }

    protected void setToolbarTitle(String iTitle) {
        mToolbarTitle.setText(iTitle);
    }

    protected void hideBackIcon() {
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayShowHomeEnabled(false);
            getSupportActionBar().setDisplayHomeAsUpEnabled(false);
        }
    }

    protected void showProgressDialog(boolean isHalfDim, String iMessage) {
        ToggleProgressDialogState(true, isHalfDim, iMessage == null ? getString(R.string.generic_loading_message) : iMessage);
    }

    protected void hideProgressDialog() {
        ToggleProgressDialogState(false, false, null);
    }

    private void ToggleProgressDialogState(boolean isShow, boolean isHalfDim, String iMessage) {
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(PROGRESS_DIALOG_TAG);
        if (isShow) {
            if (aFragment == null) {
                if (!isHalfDim)
                    mPrgDialog.setNoDim();
                mPrgDialog.setLoadingMessage(iMessage);
                mPrgDialog.show(getSupportFragmentManager(), PROGRESS_DIALOG_TAG);
            } else {
                mPrgDialog.updateLoadingMessage(iMessage);
            }
        } else {
            if (aFragment != null)
                mPrgDialog.dismiss();
        }
    }

    protected void showSingleActionError(String iMessage) {
        showSingleActionError(-1, iMessage, -1);
    }

    protected void showSingleActionError(int iTitleId, String iMessage, int iPositiveOptionId) {
        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(SINGLE_ACTION_DIALOG_TAG);
        int aTitleId = iTitleId != -1 ? iTitleId : R.string.please_note;
        int aPositiveOptionText = iPositiveOptionId != -1 ? iPositiveOptionId : android.R.string.ok;
        if (aFragment == null)
            SingleActionDialogFragment.newInstance(aTitleId, iMessage, aPositiveOptionText)
                    .show(getSupportFragmentManager(), SINGLE_ACTION_DIALOG_TAG);
    }

//    protected void showDoubleActionError(String iMessage) {
//        showDoubleActionError(-1, iMessage, -1, -1);
//    }
//
//    protected void showDoubleActionError(int iTitleId, String iMessage, int iPositiveOptionId, int iNegativeOptionId) {
//        Fragment aFragment = getSupportFragmentManager().findFragmentByTag(DOUBLE_ACTION_DIALOG_TAG);
//        int aTitleId = iTitleId != -1 ? iTitleId : R.string.please_note;
//        int aPositiveOptionText = iPositiveOptionId != -1 ? iPositiveOptionId : android.R.string.ok;
//        int aNegativeOptionText = iNegativeOptionId != -1 ? iNegativeOptionId : android.R.string.cancel;
//        if (aFragment != null)
//            DoubleActionDialogFragment.newInstance(iTitleId, iMessage, iPositiveOptionId, iNegativeOptionId)
//                    .show(getSupportFragmentManager(), DOUBLE_ACTION_DIALOG_TAG);
//    }

    protected void copyToClipboard(String iCopyString, int iToastTextId) {
        ClipboardManager clipboard = (ClipboardManager) this.getSystemService(CLIPBOARD_SERVICE);
        if (clipboard != null) {
            ClipData clip = ClipData.newPlainText(getString(R.string.app_name), iCopyString);
            Toast.makeText(this, iToastTextId, Toast.LENGTH_SHORT).show();
            clipboard.setPrimaryClip(clip);
        }
    }

    // abstract
    public abstract void loadFragment(Fragment iFragment);
}
