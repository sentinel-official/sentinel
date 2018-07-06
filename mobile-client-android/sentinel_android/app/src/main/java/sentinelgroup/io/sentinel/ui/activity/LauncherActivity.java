package sentinelgroup.io.sentinel.ui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

public class LauncherActivity extends AppCompatActivity implements View.OnClickListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_launcher);
        initView();
        checkUserLoginState();
        switchOnTestnet();
    }

    private void initView() {
        findViewById(R.id.btn_create_auid).setOnClickListener(this);
        findViewById(R.id.btn_restore).setOnClickListener(this);
    }

    private void checkUserLoginState() {
        String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        if (!aAccountAddress.isEmpty()) {
            startCreateAccountActivity();
        }
    }

    private void switchOnTestnet() {
        AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE, true);
    }

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

    private void startCreateAccountActivity() {
        startActivity(new Intent(this, CreateAccountActivity.class));
        finish();
    }

    private void startRestoreKeystoreActivity() {
        startActivity(new Intent(this, RestoreKeystoreActivity.class));
        finish();
    }
}