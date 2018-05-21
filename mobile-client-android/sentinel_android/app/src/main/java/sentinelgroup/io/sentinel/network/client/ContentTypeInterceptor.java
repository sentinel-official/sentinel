package sentinelgroup.io.sentinel.network.client;

import android.support.annotation.NonNull;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class ContentTypeInterceptor implements Interceptor {
    @Override
    public Response intercept(@NonNull Chain chain) throws IOException {
        Request.Builder requestBuilder = chain.request().newBuilder();
        requestBuilder.header("Content-Type", "application/json");
        return chain.proceed(requestBuilder.build());
    }
}
