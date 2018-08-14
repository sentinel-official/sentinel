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
import sentinelgroup.io.sentinel.network.api.AppVersionWebService;
import sentinelgroup.io.sentinel.network.api.GenericWebService;
import sentinelgroup.io.sentinel.network.api.ReferralWebService;
import sentinelgroup.io.sentinel.util.Logger;

/**
 * Retrofit client.
 */
public class WebClient {
    private static final String GENERIC_BASE_URL = "https://api.sentinelgroup.io/";
    private static final String REFERRAL_BASE_URL = "https://refer-api.sentinelgroup.io/";
    private static final String App_VERSION_BASE_URL = "https://version-api.sentinelgroup.io/";

    private static OkHttpClient sHttpClient = enableTls12OnPreLollipop(new OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(10, TimeUnit.SECONDS)
            .writeTimeout(10, TimeUnit.SECONDS)
            .retryOnConnectionFailure(false)
            .addInterceptor(new HttpLoggingInterceptor().setLevel(HttpLoggingInterceptor.Level.BODY))
            .addInterceptor(new AuthInterceptor())).build();

    private static Retrofit sGenericClient, sReferralClient, sAppVersionClient;

    private static GenericWebService sGenericWebService;
    private static ReferralWebService sReferralWebService;
    private static AppVersionWebService sAppVersionWebService;

    static {
        setupGenericRestClient();
        setupReferralRestClient();
        setupAppVersionClient();
    }

    private WebClient() {
    }

    private static void setupGenericRestClient() {
        sGenericClient = new Retrofit.Builder()
                .baseUrl(GENERIC_BASE_URL)
                .client(sHttpClient)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
    }

    private static void setupReferralRestClient() {
        sReferralClient = new Retrofit.Builder()
                .baseUrl(REFERRAL_BASE_URL)
                .client(sHttpClient)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
    }

    private static void setupAppVersionClient() {
        sAppVersionClient = new Retrofit.Builder()
                .baseUrl(App_VERSION_BASE_URL)
                .client(sHttpClient)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
    }

    public static Retrofit getGenericClient() {
        return sGenericClient;
    }

    public static Retrofit getReferralClient() {
        return sReferralClient;
    }

    public static Retrofit getsAppVersionClient() {
        return sAppVersionClient;
    }

    public static GenericWebService getGenericWebService() {
        return sGenericClient.create(GenericWebService.class);
    }

    public static ReferralWebService getReferralWebService() {
        return sReferralClient.create(ReferralWebService.class);
    }

    public static AppVersionWebService getAppVersionWebService() {
        return sAppVersionClient.create(AppVersionWebService.class);
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
                if (aTrustManagers.length != 1 || !(aTrustManagers[0] instanceof X509TrustManager)) {
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