package sentinelgroup.io.sentinel.ui.activity;

import android.arch.lifecycle.ViewModelProviders;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.alimuzaffar.lib.pin.PinEntryEditText;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.ui.dialog.SingleActionDialogFragment;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.viewmodel.VerifyPinViewModel;
import sentinelgroup.io.sentinel.viewmodel.VerifyPinViewModelFactory;

public class VerifyPinActivity extends AppCompatActivity implements View.OnClickListener, PinEntryEditText.OnPinEnteredListener, TextWatcher, TextView.OnEditorActionListener {

    private VerifyPinViewModel mViewModel;

    private PinEntryEditText mEtPin;
    private TextView mTvPin;
    private Button mBtnVerify;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_verify_pin);
        initView();
        initViewModel();
    }

    private void initView() {
        mEtPin = findViewById(R.id.et_enter_pin);
        mTvPin = findViewById(R.id.tv_enter_pin);
        mBtnVerify = findViewById(R.id.btn_verify);
        Button aBtnForgotPin = findViewById(R.id.btn_forgot_pin);
        // Set Listeners
        mEtPin.setOnPinEnteredListener(this);
        mEtPin.addTextChangedListener(this);
        mEtPin.setOnEditorActionListener(this);
        mBtnVerify.setOnClickListener(this);
        aBtnForgotPin.setOnClickListener(this);
    }

    private void initViewModel() {
        VerifyPinViewModelFactory aFactory = InjectorModule.provideVerifyPinViewModelFactory(this);
        mViewModel = ViewModelProviders.of(this, aFactory).get(VerifyPinViewModel.class);

        mViewModel.getIsPinCorrectLiveEvent().observe(this, isPinCorrect -> {
            if (isPinCorrect != null) {
                if (isPinCorrect) {
                    loadDashboardActivity();
                } else {
                    clearInput();
                    showSingleActionDialog(getString(R.string.invalid_pin));
                }
            }
        });
    }

    private void loadDashboardActivity() {
        startActivity(new Intent(this, DashboardActivity.class));
        finish();
    }

    private void clearInput() {
        mEtPin.setText("");
    }

    private void showSingleActionDialog(String iMessage) {
        SingleActionDialogFragment.newInstance(R.string.please_note, iMessage, android.R.string.ok)
                .show(getSupportFragmentManager(), AppConstants.SINGLE_ACTION_DIALOG_TAG);
    }

    private void verifyPin() {
        int aPin = Integer.parseInt(mEtPin.getText().toString().trim());
        String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        mViewModel.verifyAppPin(aPin, aAccountAddress);
    }

    @Override
    public void onPinEntered(CharSequence str) {
        mBtnVerify.setEnabled(!mEtPin.getText().toString().trim().isEmpty());
    }

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {

    }

    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {

    }

    @Override
    public void afterTextChanged(Editable s) {
        mTvPin.setVisibility(mEtPin.getText().toString().trim().isEmpty() ? View.VISIBLE : View.INVISIBLE);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_verify:
                verifyPin();
                break;
            case R.id.btn_forgot_pin:
                clearInput();
                startActivityForResult(new Intent(VerifyPinActivity.this, ForgotPinActivity.class), AppConstants.REQ_CODE_FORGOT_PIN);
                break;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == AppConstants.REQ_CODE_FORGOT_PIN) {
            if (resultCode == RESULT_OK)
                Toast.makeText(VerifyPinActivity.this, getString(R.string.reset_pin_success), Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
        if (actionId == EditorInfo.IME_ACTION_DONE) {
            verifyPin();
            return true;
        }
        return false;
    }
}