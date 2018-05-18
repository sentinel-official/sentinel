package sentinelgroup.io.sentinel.util;

import android.content.Context;
import android.content.SharedPreferences;

import sentinelgroup.io.sentinel.SentinelApp;

public class AppPreferences {

    private static AppPreferences mInstance = null;
    private final SharedPreferences mPrefs;

    private AppPreferences() {
        mPrefs = SentinelApp.getAppContext().getSharedPreferences("app_data_prefs", Context.MODE_PRIVATE);
    }

    public static synchronized AppPreferences getInstance() {
        if (mInstance == null) {
            mInstance = new AppPreferences();
        }
        return mInstance;
    }

    ///--------------------------------------------------------------------------------------

    public void saveBoolean(String iKey, boolean iValue) {
        SharedPreferences.Editor prefsEditor = mPrefs.edit();
        prefsEditor.putBoolean(iKey, iValue);
        prefsEditor.apply();
    }

    public void saveInteger(String iKey, int iValue) {
        SharedPreferences.Editor prefsEditor = mPrefs.edit();
        prefsEditor.putInt(iKey, iValue);
        prefsEditor.apply();
    }

    public void saveLong(String iKey, Long iValue) {
        SharedPreferences.Editor prefsEditor = mPrefs.edit();
        prefsEditor.putLong(iKey, iValue);
        prefsEditor.apply();
    }

    public void saveString(String iKey, String iValue) {
        SharedPreferences.Editor prefsEditor = mPrefs.edit();
        prefsEditor.putString(iKey, iValue);
        prefsEditor.apply();
    }

    public boolean getBoolean(String iKey) {
        return mPrefs.getBoolean(iKey, false);
    }

    public int getInteger(String iKey) {
        return mPrefs.getInt(iKey, 0);
    }

    public Long getLong(String iKey) {
        return mPrefs.getLong(iKey, 0L);
    }

    public String getString(String iKey) {
        return mPrefs.getString(iKey, "");
    }

    ///--------------------------------------------------------------------------------------

    public void clearSavedData(Context iContext) {
        SharedPreferences.Editor prefsEditor = mPrefs.edit();
        prefsEditor.clear().apply();
    }
}