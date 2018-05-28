package sentinelgroup.io.sentinel.util;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

import sentinelgroup.io.sentinel.SentinelApp;

public class NetworkUtil {
    private static boolean mConnected = false;

    public static boolean isOnline() {
        try {
            ConnectivityManager aConnectivityManager = (ConnectivityManager) SentinelApp.getAppContext().getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo aNetworkInfo = null;
            if (aConnectivityManager != null) {
                aNetworkInfo = aConnectivityManager.getActiveNetworkInfo();
            }
            mConnected = aNetworkInfo != null && aNetworkInfo.isAvailable() && aNetworkInfo.isConnected();
            return mConnected;
        } catch (Exception e) {
            Logger.logDebug("CheckConnectivity Exception: ", e.getMessage());
        }
        return mConnected;
    }
}