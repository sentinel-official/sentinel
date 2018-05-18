package sentinelgroup.io.sentinel;

import android.content.Context;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;

public class SentinelApp extends MultiDexApplication {

    private static SentinelApp sInstance;

    @Override
    public void onCreate() {
        super.onCreate();
        sInstance = this;
        MultiDex.install(this);
    }

    public static Context getAppContext() {
        return sInstance.getApplicationContext();
    }
}
