package sentinelgroup.io.sentinel.ui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;

import java.io.File;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.SentinelApp;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

import static sentinelgroup.io.sentinel.SentinelApp.changeLanguage;

public class LauncherActivity extends AppCompatActivity implements View.OnClickListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setupAppLanguage();
        setContentView(R.layout.activity_launcher);
        initializePathIfNeeded();
        initView();
        checkUserLoginState();
        switchOnTestNet();
    }

    /*
     * Set the default Language for the App to "English" if language is not set by the user
     */
    private void setupAppLanguage() {
        if (SentinelApp.getSelectedLanguage().isEmpty())
            AppPreferences.getInstance().saveString(AppConstants.PREFS_SELECTED_LANGUAGE_CODE, getString(R.string.default_language));
        changeLanguage(this, SentinelApp.getSelectedLanguage());
    }

    /*
     * Set the default path to be used in the app for storing files
     */
    private void initializePathIfNeeded() {
        if (AppPreferences.getInstance().getString(AppConstants.PREFS_FILE_PATH).isEmpty()) {
            String aFilePath = new File(getFilesDir(), AppConstants.FILE_NAME).getAbsolutePath();
            AppPreferences.getInstance().saveString(AppConstants.PREFS_FILE_PATH, aFilePath);
        }
        if (AppPreferences.getInstance().getString(AppConstants.PREFS_CONFIG_PATH).isEmpty()) {
            String aConfigPath = new File(getFilesDir(), AppConstants.CONFIG_NAME).getAbsolutePath();
            AppPreferences.getInstance().saveString(AppConstants.PREFS_CONFIG_PATH, aConfigPath);
        }
    }

    /*
     * Instantiate all the views used in the XML and perform other instantiation steps (if needed)
     */
    private void initView() {
        findViewById(R.id.btn_create_auid).setOnClickListener(this);
        findViewById(R.id.btn_restore).setOnClickListener(this);
    }

    /*
     * Check the user's login state and navigate the user to the appropriate next screen depending
     * on his logged in state
     */
    private void checkUserLoginState() {
        String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        if (!aAccountAddress.isEmpty()) {
            startCreateAccountActivity();
        }
    }

    /*
     * Make the TESTNET switch checked by default whenever user opens the app
     */
    private void switchOnTestNet() {
        AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE, true);
    }

    /*
     * Launch CreateAccountActivity
     */
    private void startCreateAccountActivity() {
        startActivity(new Intent(this, CreateAccountActivity.class));
        finish();
    }

    /*
     * Launch RestoreKeystoreActivity
     */
    private void startRestoreKeystoreActivity() {
        startActivity(new Intent(this, RestoreKeystoreActivity.class));
        finish();
    }

    // Listener implementations
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_create_auid:
                startCreateAccountActivity();
                break;

            case R.id.btn_restore:
                startRestoreKeystoreActivity();
                break;
        }
    }
}