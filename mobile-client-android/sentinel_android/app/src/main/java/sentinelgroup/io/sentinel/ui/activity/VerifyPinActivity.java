package sentinelgroup.io.sentinel.ui.activity;

import android.arch.lifecycle.ViewModelProviders;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
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

public class VerifyPinActivity extends AppCompatActivity implements View.OnClickListener,
        PinEntryEditText.OnPinEnteredListener, TextWatcher, TextView.OnEditorActionListener {
    private VerifyPinViewModel mViewModel;

    private PinEntryEditText mEtPin;
    private TextView mTvPin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_verify_pin);
        initView();
        initViewModel();
    }

    /*
     * Instantiate all the views used in the XML and perform other instantiation steps (if needed)
     */
    private void initView() {
        mEtPin = findViewById(R.id.et_enter_pin);
        mTvPin = findViewById(R.id.tv_enter_pin);
        // add listeners
        mEtPin.setOnPinEnteredListener(this);
        mEtPin.addTextChangedListener(this);
        mEtPin.setOnEditorActionListener(this);
        findViewById(R.id.btn_forgot_pin).setOnClickListener(this);
        // Give focus to PinEntryEditText
        showKeyboard();
    }

    /*
     * Show on screen keyboard
     */
    private void showKeyboard() {
        if (mEtPin != null) {
            mEtPin.setFocusable(true);
            mEtPin.setFocusableInTouchMode(true);
            mEtPin.requestFocus();
        }
        InputMethodManager aInputMethodManager = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
        if (aInputMethodManager != null) {
            aInputMethodManager.showSoftInput(mEtPin, InputMethodManager.SHOW_FORCED);
        }
    }

    /*
     * Hide on screen keyboard
     */
    public void hideKeyboard() {
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

    /*
     * Instantiate the ViewModel and observe the LiveData returned by it
     */
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

    /*
     * Launch the DashboardActivity
     */
    private void loadDashboardActivity() {
        startActivity(new Intent(this, DashboardActivity.class));
        finish();
    }

    /*
     * Clear the wrong PIN entered in the PinEntryEditText
     */
    private void clearInput() {
        mEtPin.setText("");
    }

    /**
     * Construct a new instance of SingleActionDialogFragment and display the Error Message
     *
     * @param iMessage [String] The error message to be displayed
     */
    private void showSingleActionDialog(String iMessage) {
        SingleActionDialogFragment.newInstance(R.string.please_note, iMessage, android.R.string.ok)
                .show(getSupportFragmentManager(), AppConstants.SINGLE_ACTION_DIALOG_TAG);
    }

    /*
     * Verify the app PIN entered by the user and take him to the DashboardActivity if it was
     * entered correctly else show an error
     */
    private void verifyPin() {
        String aPinString = mEtPin.getText().toString().trim();
        if (!aPinString.isEmpty()) {
            int aPin = Integer.parseInt(aPinString);
            String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
            mViewModel.verifyAppPin(aPin, aAccountAddress);
        } else {
            showSingleActionDialog(getString(R.string.pin_empty));
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

    // Listener implementations
    @Override
    public void onPinEntered(CharSequence str) {
        hideKeyboard();
        verifyPin();
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
            case R.id.btn_forgot_pin:
                clearInput();
                startActivityForResult(new Intent(VerifyPinActivity.this, ForgotPinActivity.class), AppConstants.REQ_CODE_FORGOT_PIN);
                break;
        }
    }

    @Override
    public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
        return actionId == EditorInfo.IME_ACTION_DONE;
    }
}