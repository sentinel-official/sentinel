package sentinelgroup.io.sentinel.util;

import android.util.Log;

import sentinelgroup.io.sentinel.SentinelApp;

public class Logger {
    public static void logVerbose(String iTitle, String iLogMessage) {
        if (SentinelApp.isDebugEnabled())
            Log.v(AppConstants.TAG, iTitle + " : " + iLogMessage);
    }

    public static void logInfo(String iTitle, String iLogMessage) {
        if (SentinelApp.isDebugEnabled())
            Log.i(AppConstants.TAG, iTitle + " : " + iLogMessage);
    }

    public static void logError(String iTitle, String iLogMessage, Exception iException) {
        if (SentinelApp.isDebugEnabled())
            Log.e(AppConstants.TAG, iTitle + " : " + iLogMessage, iException);
    }

    public static void logWarn(String iTitle, String iLogMessage) {
        if (SentinelApp.isDebugEnabled())
            Log.w(AppConstants.TAG, iTitle + " : " + iLogMessage);
    }

    public static void logWarn(String iLogMessage) {
        if (SentinelApp.isDebugEnabled())
            Log.w(AppConstants.TAG, iLogMessage);
    }

    public static void logDebug(String iTitle, String iLogMessage) {
        if (SentinelApp.isDebugEnabled())
            Log.d(AppConstants.TAG, iTitle + " : " + iLogMessage);
    }
}