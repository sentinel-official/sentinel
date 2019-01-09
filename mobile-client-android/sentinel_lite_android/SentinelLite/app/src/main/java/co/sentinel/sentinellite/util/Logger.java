package co.sentinel.sentinellite.util;

import android.util.Log;

import co.sentinel.sentinellite.SentinelLiteApp;

public class Logger {
    public static void logVerbose(String iTitle, String iLogMessage) {
        if (SentinelLiteApp.isDebugEnabled())
            Log.v(AppConstants.TAG, iTitle + " : " + iLogMessage);
    }

    public static void logInfo(String iTitle, String iLogMessage) {
        if (SentinelLiteApp.isDebugEnabled())
            Log.i(AppConstants.TAG, iTitle + " : " + iLogMessage);
    }

    public static void logError(String iTitle, String iLogMessage, Exception iException) {
        if (SentinelLiteApp.isDebugEnabled())
            Log.e(AppConstants.TAG, iTitle + " : " + iLogMessage, iException);
    }

    public static void logWarn(String iTitle, String iLogMessage) {
        if (SentinelLiteApp.isDebugEnabled())
            Log.w(AppConstants.TAG, iTitle + " : " + iLogMessage);
    }

    public static void logWarn(String iLogMessage) {
        if (SentinelLiteApp.isDebugEnabled())
            Log.w(AppConstants.TAG, iLogMessage);
    }

    public static void logDebug(String iTitle, String iLogMessage) {
        if (SentinelLiteApp.isDebugEnabled())
            Log.d(AppConstants.TAG, iTitle + " : " + iLogMessage);
    }
}