package sentinelgroup.io.sentinel.ui.activity;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.widget.TextView;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.dialog.ProgressDialogFragment;
import sentinelgroup.io.sentinel.ui.dialog.SingleActionDialogFragment;
import sentinelgroup.io.sentinel.ui.fragment.ForgotPinFragment;

public class ForgotPinActivity extends AppCompatActivity implements ForgotPinFragment.OnFragmentInteractionListener {

    private Toolbar mToolbar;
    private TextView mToolbarTitle;
    private ProgressDialogFragment mPrgDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_container_simple);
        initView();
        loadFragment(ForgotPinFragment.newInstance());
    }

    private void initView() {
        mToolbar = findViewById(R.id.toolbar);
        mToolbarTitle = mToolbar.findViewById(R.id.toolbar_title);
        mPrgDialog = ProgressDialogFragment.newInstance(true);
        setupToolbar();
    }

    private void setupToolbar() {
        setSupportActionBar(mToolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayShowTitleEnabled(false);
            getSupportActionBar().setHomeAsUpIndicator(R.drawable.ic_back);
            getSupportActionBar().setDisplayShowHomeEnabled(true);
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }

    private void setToolbarTitle(String iTitle) {
        mToolbarTitle.setText(iTitle);
    }

    private void loadFragment(Fragment iFragment) {
        getSupportFragmentManager().beginTransaction().replace(R.id.fl_container, iFragment).commit();
    }

    private void showProgress() {
        mPrgDialog.show(getSupportFragmentManager(), "progress_dialog");
    }

    private void hideProgress() {
        if (mPrgDialog != null)
            mPrgDialog.dismiss();
    }

    private void showError(String iError) {
        SingleActionDialogFragment.newInstance(getString(R.string.please_note), iError, getString(android.R.string.ok))
                .show(getSupportFragmentManager(), "alert_dialog");
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            onBackPressed();
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed() {
        setResult(RESULT_CANCELED);
        finish();
    }

    @Override
    public void onFragmentLoaded(String iTitle) {
        setToolbarTitle(iTitle);
    }

    @Override
    public void onToggleProgressDialog(boolean isDialogShown) {
        if (isDialogShown)
            showProgress();
        else
            hideProgress();
    }

    @Override
    public void onShowErrorDialog(String iError) {
        showError(iError);
    }

    @Override
    public void onLoadNextActivity() {
        setResult(RESULT_OK);
        finish();
    }
}
