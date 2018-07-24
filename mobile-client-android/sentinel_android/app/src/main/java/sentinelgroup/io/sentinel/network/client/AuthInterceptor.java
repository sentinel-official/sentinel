package sentinelgroup.io.sentinel.network.client;

import android.support.annotation.NonNull;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;
import sentinelgroup.io.sentinel.util.NetworkUtil;
import sentinelgroup.io.sentinel.util.NoConnectivityException;

/**
 * Modifies the request header and observes the response for NoConnectivity exception.
 */
public class AuthInterceptor implements Interceptor {
    @Override
    public Response intercept(@NonNull Chain chain) throws IOException {
        if (!NetworkUtil.isOnline()) {
            throw new NoConnectivityException();
        }
        Request.Builder aRequestBuilder = chain.request().newBuilder();
        aRequestBuilder.header("Content-Type", "application/json");
        return chain.proceed(aRequestBuilder.build());
    }
}
