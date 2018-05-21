package sentinelgroup.io.sentinel.network.client;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import sentinelgroup.io.sentinel.BuildConfig;
import sentinelgroup.io.sentinel.network.api.WebService;

public class WebClient {
    private static final String BASE_URL = "https://api.sentinelgroup.io/";

    private static WebService sWebService;

    static {
        setupRestClient();
    }

    private WebClient() {
    }

    private static void setupRestClient() {
        // set your desired log level
        HttpLoggingInterceptor aLoggingInterceptor = new HttpLoggingInterceptor();
        aLoggingInterceptor.setLevel(BuildConfig.DEBUG ? HttpLoggingInterceptor.Level.BODY : HttpLoggingInterceptor.Level.NONE);
        // set ContentTypeInterceptor
        ContentTypeInterceptor aContentTypeInterceptor = new ContentTypeInterceptor();

        OkHttpClient aClient = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .retryOnConnectionFailure(true)
                .addInterceptor(aLoggingInterceptor)
                .addInterceptor(aContentTypeInterceptor)
                .build();

        Retrofit aRetrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(aClient)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        sWebService = aRetrofit.create(WebService.class);
    }

    public static WebService get() {
        return sWebService;
    }
}