package sentinelgroup.io.sentinel.network.client;

import android.os.Build;

import java.security.KeyStore;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;

import okhttp3.ConnectionSpec;
import okhttp3.OkHttpClient;
import okhttp3.TlsVersion;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import sentinelgroup.io.sentinel.BuildConfig;
import sentinelgroup.io.sentinel.network.api.WebService;
import sentinelgroup.io.sentinel.util.Logger;

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

        OkHttpClient.Builder aClientBuilder = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .retryOnConnectionFailure(false)
                .addInterceptor(aLoggingInterceptor)
                .addInterceptor(aContentTypeInterceptor);
        OkHttpClient aClient = enableTls12OnPreLollipop(aClientBuilder)
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

    private static OkHttpClient.Builder enableTls12OnPreLollipop(OkHttpClient.Builder iClient) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP) {
            try {
                SSLContext aSslContext = SSLContext.getInstance("TLSv1.2");
                aSslContext.init(null, null, null);

                TrustManagerFactory aTrustManagerFactory = TrustManagerFactory.getInstance(
                        TrustManagerFactory.getDefaultAlgorithm());
                aTrustManagerFactory.init((KeyStore) null);
                TrustManager[] aTrustManagers = aTrustManagerFactory.getTrustManagers();
                if(aTrustManagers.length!=1 || !(aTrustManagers[0] instanceof X509TrustManager)) {
                    throw new IllegalStateException("Unexpected default trust managers:"
                            + Arrays.toString(aTrustManagers));
                }
                X509TrustManager aX509TrustManager = (X509TrustManager) aTrustManagers[0];

                iClient.sslSocketFactory(new Tls12SocketFactory(aSslContext.getSocketFactory()),
                        aX509TrustManager);

                ConnectionSpec aConnectionSpec = new ConnectionSpec.Builder(ConnectionSpec.MODERN_TLS)
                        .tlsVersions(TlsVersion.TLS_1_2)
                        .build();

                List<ConnectionSpec> aSpecs = new ArrayList<>();
                aSpecs.add(aConnectionSpec);
                aSpecs.add(ConnectionSpec.COMPATIBLE_TLS);
                aSpecs.add(ConnectionSpec.CLEARTEXT);

                iClient.connectionSpecs(aSpecs);
            } catch (Exception exc) {
                Logger.logError("OkHttpTLSCompat", "Error while setting TLS 1.2", exc);
            }
        }
        return iClient;
    }
}