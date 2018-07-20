package sentinelgroup.io.sentinel.ui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

public class SplashActivity extends AppCompatActivity {
    private Handler mHandler;
    private Runnable mRunnable;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        initView();
    }

    private void initView() {
        mHandler = new Handler();
        mRunnable = () -> {
            if (!AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_INFO_SHOWN)
                    && AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS).isEmpty()) {
                openNextActivity(OnBoardingActivity.class);
            } else {
                openNextActivity(LauncherActivity.class);
            }
        };
        mHandler.postDelayed(mRunnable, 2000);
    }

    /*
     * Fire the next activity based on the condition
     */
    private void openNextActivity(Class<?> iClass) {
        startActivity(new Intent(this, iClass));
        finish();
    }

    @Override
    protected void onDestroy() {
        mHandler.removeCallbacks(mRunnable);
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        // Disable back action
    }
}