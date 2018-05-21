package sentinelgroup.io.sentinel;

import android.content.Context;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;

import java.io.File;

import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

public class SentinelApp extends MultiDexApplication {

    private static SentinelApp sInstance;

    @Override
    public void onCreate() {
        super.onCreate();
        sInstance = this;
        MultiDex.install(this);
        if (AppPreferences.getInstance().getString(AppConstants.PREF_FILE_PATH).isEmpty()) {
            String aFilePath = new File(getFilesDir(), AppConstants.PREF_FILE_PATH).getAbsolutePath();
            AppPreferences.getInstance().saveString(AppConstants.PREF_FILE_PATH, aFilePath);
        }
    }

    public static Context getAppContext() {
        return sInstance.getApplicationContext();
    }

    public static boolean isDebugEnabled() {
        return BuildConfig.DEBUG;
    }
}
