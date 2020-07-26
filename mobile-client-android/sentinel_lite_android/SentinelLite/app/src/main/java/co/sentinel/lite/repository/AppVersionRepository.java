package co.sentinel.lite.repository;

import co.sentinel.lite.network.api.AppVersionWebService;
import co.sentinel.lite.network.model.ApiError;
import co.sentinel.lite.network.model.VersionInfo;
import co.sentinel.lite.util.ApiErrorUtils;
import co.sentinel.lite.util.AppConstants;
import co.sentinel.lite.util.NoConnectivityException;
import co.sentinel.lite.util.Resource;
import co.sentinel.lite.util.SingleLiveEvent;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AppVersionRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static AppVersionRepository sInstance;
    private final AppVersionWebService mAppVersionWebService;
    private final SingleLiveEvent<Resource<VersionInfo>> mSlcVersionInfoLiveEvent;
    private final SingleLiveEvent<Resource<VersionInfo>> mSncVersionInfoLiveEvent;

    private AppVersionRepository(AppVersionWebService iWebService) {
        this.mAppVersionWebService = iWebService;
        mSlcVersionInfoLiveEvent = new SingleLiveEvent<>();
        mSncVersionInfoLiveEvent = new SingleLiveEvent<>();
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
    public SingleLiveEvent<Resource<VersionInfo>> getSlcVersionInfoLiveEvent() {
        return mSlcVersionInfoLiveEvent;
    }

    public SingleLiveEvent<Resource<VersionInfo>> getSncVersionInfoLiveEvent() {
        return mSncVersionInfoLiveEvent;
    }

    public void fetchSlcVersionInfo() {
        getVersionInfoSlc();
    }

    public void fetchSncVersionInfo() {
        getVersionInfoSnc();
    }

    /*
     * Network call
     */
    private void getVersionInfoSlc() {
        mAppVersionWebService.getLatestAppVersionSlc().enqueue(new Callback<VersionInfo>() {
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
                    mSlcVersionInfoLiveEvent.postValue(Resource.success(iResponse.body()));
                } else {
                    reportErrorResponse(iResponse, null);
                }
            }

            private void reportErrorResponse(Response<VersionInfo> iResponse, String iThrowableLocalMessage) {
                if (iResponse != null) {
                    mSlcVersionInfoLiveEvent.postValue(Resource.error(AppConstants.ERROR_VERSION_FETCH, iResponse.body()));
                } else if (iThrowableLocalMessage != null)
                    mSlcVersionInfoLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mSlcVersionInfoLiveEvent.postValue(Resource.error(AppConstants.ERROR_GENERIC, null));
            }
        });
    }

    private void getVersionInfoSnc() {
        mAppVersionWebService.getLatestAppVersionSnc().enqueue(new Callback<VersionInfo>() {
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
                    mSncVersionInfoLiveEvent.postValue(Resource.success(iResponse.body()));
                } else {
                    reportErrorResponse(iResponse, null);
                }
            }

            private void reportErrorResponse(Response<VersionInfo> iResponse, String iThrowableLocalMessage) {
                if (iResponse != null) {
                    ApiError aError = ApiErrorUtils.parseGenericError(iResponse);
                    mSncVersionInfoLiveEvent.postValue(Resource.error(aError.getMessage() != null ? aError.getMessage() : AppConstants.ERROR_GENERIC, iResponse.body()));
                } else if (iThrowableLocalMessage != null)
                    mSncVersionInfoLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mSncVersionInfoLiveEvent.postValue(Resource.error(AppConstants.ERROR_GENERIC, null));
            }
        });
    }
}