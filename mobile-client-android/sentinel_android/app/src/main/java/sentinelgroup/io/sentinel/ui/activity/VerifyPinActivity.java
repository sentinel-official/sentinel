package sentinelgroup.io.sentinel.ui.activity;

import android.arch.lifecycle.ViewModelProviders;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.alimuzaffar.lib.pin.PinEntryEditText;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.di.InjectorModule;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.viewmodel.VerifyPinViewModel;
import sentinelgroup.io.sentinel.viewmodel.VerifyPinViewModelFactory;

public class VerifyPinActivity extends AppCompatActivity implements View.OnClickListener, PinEntryEditText.OnPinEnteredListener, TextWatcher {

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
        // Set Listeners
        mEtPin.setOnPinEnteredListener(this);
        mEtPin.addTextChangedListener(this);
        mBtnVerify.setOnClickListener(this);
    }

    private void initViewModel() {
        VerifyPinViewModelFactory aFactory = InjectorModule.provideVerifyPinViewModelFactory(this);
        mViewModel = ViewModelProviders.of(this, aFactory).get(VerifyPinViewModel.class);

        mViewModel.getIsPinCorrectLiveEvent().observe(this, isPinCorrect -> {
            if (isPinCorrect != null) {
                if (isPinCorrect) {
                    loadDashboardActivity();
                } else {
                    Toast.makeText(this, R.string.invalid_pin, Toast.LENGTH_SHORT).show();
                    mEtPin.setText("");
                    toggleEnabledState(true);
                }
            }
        });
    }

    private void loadDashboardActivity() {
        startActivity(new Intent(this, DashboardActivity.class));
        finish();
    }

    private void toggleEnabledState(boolean iEnabled) {
        mBtnVerify.setEnabled(iEnabled);
        mTvPin.setEnabled(iEnabled);
    }

    @Override
    public void onPinEntered(CharSequence str) {
        mBtnVerify.setEnabled(!mEtPin.getText().toString().isEmpty());
    }

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {

    }

    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {

    }

    @Override
    public void afterTextChanged(Editable s) {
        mTvPin.setVisibility(mEtPin.getText().toString().isEmpty() ? View.VISIBLE : View.INVISIBLE);
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.btn_verify) {
            toggleEnabledState(false);
            int aPin = Integer.parseInt(mEtPin.getText().toString().trim());
            String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
            mViewModel.verifyAppPin(aPin, aAccountAddress);
        }
    }
}