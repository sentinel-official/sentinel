package co.sentinel.sentinellite.util;

import java.io.IOException;

import co.sentinel.sentinellite.R;
import co.sentinel.sentinellite.SentinelLiteApp;

public class NoConnectivityException extends IOException {

    @Override
    public String getMessage() {
        return SentinelLiteApp.getAppContext().getString(R.string.no_internet);
    }
}