package co.sentinel.lite.util;

import java.io.IOException;

import co.sentinel.lite.R;
import co.sentinel.lite.SentinelLiteApp;

public class NoConnectivityException extends IOException {

    @Override
    public String getMessage() {
        return SentinelLiteApp.getAppContext().getString(R.string.no_internet);
    }
}