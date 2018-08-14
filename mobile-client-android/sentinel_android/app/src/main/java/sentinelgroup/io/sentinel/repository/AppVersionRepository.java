package sentinelgroup.io.sentinel.repository;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import sentinelgroup.io.sentinel.network.api.AppVersionWebService;
import sentinelgroup.io.sentinel.network.model.ApiError;
import sentinelgroup.io.sentinel.network.model.VersionInfo;
import sentinelgroup.io.sentinel.util.ApiErrorUtils;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.NoConnectivityException;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class AppVersionRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static AppVersionRepository sInstance;
    private final AppVersionWebService mAppVersionWebService;
    private final SingleLiveEvent<Resource<VersionInfo>> mVersionInfoLiveEvent;

    private AppVersionRepository(AppVersionWebService iWebService) {
        this.mAppVersionWebService = iWebService;
        mVersionInfoLiveEvent = new SingleLiveEvent<>();
    }

    public static AppVersionRepository getInstance(AppVersionWebService aAppVersionWebService) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new AppVersionRepository(aAppVersionWebService);
            }
        }
        return sInstance;
    }

    /*
     * public getter methods for LiveData and SingleLiveEvents
     */

    public SingleLiveEvent<Resource<VersionInfo>> getVersionInfoLiveEvent() {
        getVersionInfo();
        return mVersionInfoLiveEvent;
    }

    /*
     * Network call
     */
    public void getVersionInfo() {
        mAppVersionWebService.getLatestAppVersion().enqueue(new Callback<VersionInfo>() {
            @Override
            public void onResponse(Call<VersionInfo> call, Response<VersionInfo> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<VersionInfo> call, Throwable t) {
                reportErrorResponse(null, t instanceof NoConnectivityException ? t.getLocalizedMessage() : null);
            }

            private void reportSuccessResponse(Response<VersionInfo> iResponse) {
                if (iResponse.isSuccessful()) {
                    mVersionInfoLiveEvent.postValue(Resource.success(iResponse.body()));
                } else {
                    reportErrorResponse(iResponse, null);
                }
            }

            private void reportErrorResponse(Response<VersionInfo> iResponse, String iThrowableLocalMessage) {
                if (iResponse != null) {
                    ApiError aError = ApiErrorUtils.parseGenericError(iResponse);
                    mVersionInfoLiveEvent.postValue(Resource.error(aError.getMessage(), iResponse.body()));
                } else if (iThrowableLocalMessage != null)
                    mVersionInfoLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mVersionInfoLiveEvent.postValue(Resource.error(AppConstants.GENERIC_ERROR, null));
            }
        });
    }
}