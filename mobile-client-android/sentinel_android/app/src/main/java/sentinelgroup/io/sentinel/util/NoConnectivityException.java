package sentinelgroup.io.sentinel.util;

import java.io.IOException;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.SentinelApp;


public class NoConnectivityException extends IOException {

    @Override
    public String getMessage() {
        return SentinelApp.getAppContext().getString(R.string.no_internet);
    }
}