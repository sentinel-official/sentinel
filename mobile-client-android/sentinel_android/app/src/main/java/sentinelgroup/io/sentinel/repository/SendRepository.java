package sentinelgroup.io.sentinel.repository;

import sentinelgroup.io.sentinel.network.api.WebService;

public class SendRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static SendRepository sInstance;
    private final WebService mWebService;

    private SendRepository(WebService iWebService) {
        mWebService = iWebService;
    }

    public static SendRepository getInstance(WebService iWebService) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new SendRepository(iWebService);
            }
        }
        return sInstance;
    }

    // Network Call
}
