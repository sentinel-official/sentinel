package sentinelgroup.io.sentinel.util;

import android.content.res.Resources;

import java.io.IOException;

import sentinelgroup.io.sentinel.R;


public class NoConnectivityException extends IOException {

    @Override
    public String getMessage() {
        return Resources.getSystem().getString(R.string.no_internet);
    }
}