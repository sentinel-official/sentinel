package co.sentinel.sentinellite.repository;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.MutableLiveData;

import java.util.List;
import java.util.Locale;

import co.sentinel.sentinellite.db.dao.VpnListEntryDao;
import co.sentinel.sentinellite.network.api.GenericWebService;
import co.sentinel.sentinellite.network.model.ApiError;
import co.sentinel.sentinellite.network.model.GenericRequestBody;
import co.sentinel.sentinellite.network.model.GenericResponse;
import co.sentinel.sentinellite.network.model.Vpn;
import co.sentinel.sentinellite.network.model.VpnConfig;
import co.sentinel.sentinellite.network.model.VpnCredentials;
import co.sentinel.sentinellite.network.model.VpnListEntity;
import co.sentinel.sentinellite.network.model.VpnUsage;
import co.sentinel.sentinellite.network.model.VpnUsageEntity;
import co.sentinel.sentinellite.util.ApiErrorUtils;
import co.sentinel.sentinellite.util.AppConstants;
import co.sentinel.sentinellite.util.AppExecutors;
import co.sentinel.sentinellite.util.AppPreferences;
import co.sentinel.sentinellite.util.NoConnectivityException;
import co.sentinel.sentinellite.util.Resource;
import co.sentinel.sentinellite.util.SingleLiveEvent;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Repository class to handle VPN related data
 */
public class VpnRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static VpnRepository sInstance;
    private final VpnListEntryDao mListDao;
    private final GenericWebService mGenericWebService;
    private final AppExecutors mAppExecutors;
    private final String mDeviceId;
    private final MutableLiveData<List<VpnListEntity>> mVpnListMutableLiveData;
    private final SingleLiveEvent<String> mVpnListErrorLiveEvent;
    private final SingleLiveEvent<Resource<VpnUsage>> mVpnUsageLiveEvent;
    private final SingleLiveEvent<Resource<VpnCredentials>> mVpnServerCredentialsLiveEvent;
    private final SingleLiveEvent<Resource<VpnConfig>> mVpnConfigLiveEvent;
    private final SingleLiveEvent<Resource<String>> mDisconnectLiveEvent;
    private final SingleLiveEvent<Resource<GenericResponse>> mRatingLiveEvent;
    private final SingleLiveEvent<String> mVpnUsageErrorLiveEvent;

    private VpnRepository(VpnListEntryDao iListDao, GenericWebService iGenericWebService, AppExecutors iAppExecutors, String iDeviceId) {
        mListDao = iListDao;
        mGenericWebService = iGenericWebService;
        mAppExecutors = iAppExecutors;
        mDeviceId = iDeviceId;
        mVpnListMutableLiveData = new MutableLiveData<>();
        mVpnListErrorLiveEvent = new SingleLiveEvent<>();
        mVpnUsageLiveEvent = new SingleLiveEvent<>();
        mVpnServerCredentialsLiveEvent = new SingleLiveEvent<>();
        mVpnConfigLiveEvent = new SingleLiveEvent<>();
        mDisconnectLiveEvent = new SingleLiveEvent<>();
        mRatingLiveEvent = new SingleLiveEvent<>();
        mVpnUsageErrorLiveEvent = new SingleLiveEvent<>();

        LiveData<List<VpnListEntity>> aVpnListServerData = getVpnListMutableLiveData();
        aVpnListServerData.observeForever(vpnList -> {
            mAppExecutors.diskIO().execute(() -> {
                if (vpnList != null && vpnList.size() > 0) {
                    mListDao.deleteVpnListEntity();
                    mListDao.insertVpnListEntity(vpnList);
                }
            });
        });
    }

    public static VpnRepository getInstance(VpnListEntryDao iListDao, GenericWebService iGenericWebService, AppExecutors iAppExecutors, String iDeviceId) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new VpnRepository(iListDao, iGenericWebService, iAppExecutors, iDeviceId);
            }
        }
        return sInstance;
    }

    private MutableLiveData<List<VpnListEntity>> getVpnListMutableLiveData() {
        getUnoccupiedVpnList();
        return mVpnListMutableLiveData;
    }

    // public getter methods for LiveData & SingleLiveEvent
    public LiveData<List<VpnListEntity>> getVpnListLiveData() {
        return mListDao.getVpnLisEntity();
    }

    public LiveData<VpnListEntity> getVpnLiveData(String iVpnAddress) {
        return mListDao.getVpnEntity(iVpnAddress);
    }

    public SingleLiveEvent<String> getVpnListErrorLiveEvent() {
        return mVpnListErrorLiveEvent;
    }

    public SingleLiveEvent<Resource<VpnUsage>> getVpnUsageLiveEvent() {
        return mVpnUsageLiveEvent;
    }

    public SingleLiveEvent<Resource<VpnCredentials>> getVpnServerCredentialsLiveEvent() {
        return mVpnServerCredentialsLiveEvent;
    }

    public SingleLiveEvent<Resource<VpnConfig>> getVpnConfigLiveEvent() {
        return mVpnConfigLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getRatingLiveEvent() {
        return mRatingLiveEvent;
    }

    public void getVpnServerCredentials(String iVpnAddress) {
        GenericRequestBody aBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .deviceIdMain(mDeviceId)
                .vpnAddress(iVpnAddress)
                .build();
        getVpnServerCredentials(aBody);
    }

    public void getVpnUsageForUser() {
        GenericRequestBody aBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .deviceIdMain(mDeviceId)
                .build();
        getVpnUsageForUser(aBody);
    }

    public void getVpnConfig(String iVpnAddress, String iToken, String iIp, int iPort) {
        GenericRequestBody aBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .deviceIdMain(mDeviceId)
                .accountAddress(mDeviceId)
                .vpnAddress(iVpnAddress)
                .token(iToken)
                .build();
        String aUrl = String.format(Locale.US, AppConstants.URL_BUILDER, iIp, iPort);
        getVpnConfig(aUrl, aBody);
    }

    public Call<GenericResponse> disconnectVpn() {
        GenericRequestBody aBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .accountAddress(mDeviceId)
                .token(AppPreferences.getInstance().getString(AppConstants.PREFS_VPN_TOKEN))
                .build();
        String aUrl = String.format(Locale.US, AppConstants.DISCONNECT_URL_BUILDER, AppPreferences.getInstance().getString(AppConstants.PREFS_IP_ADDRESS), AppPreferences.getInstance().getInteger(AppConstants.PREFS_IP_PORT));
        return disconnectVpn(aUrl, aBody);
    }

    // Network call
    public void getUnoccupiedVpnList() {
        mGenericWebService.getUnoccupiedVpnList().enqueue(new Callback<Vpn>() {
            @Override
            public void onResponse(Call<Vpn> call, Response<Vpn> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<Vpn> call, Throwable t) {
                reportErrorResponse(t.getLocalizedMessage());
            }

            private void reportSuccessResponse(Response<Vpn> iResponse) {
                if (iResponse.isSuccessful())
                    mVpnListMutableLiveData.postValue(iResponse.body().list);
            }

            private void reportErrorResponse(String iThrowableLocalMessage) {
                if (iThrowableLocalMessage != null)
                    mVpnListErrorLiveEvent.postValue(iThrowableLocalMessage);
                else
                    mVpnListErrorLiveEvent.postValue(AppConstants.ERROR_GENERIC);
            }
        });
    }

    private void getVpnServerCredentials(GenericRequestBody iRequestBody) {
        mVpnServerCredentialsLiveEvent.postValue(Resource.loading(null));
        mGenericWebService.getVpnServerCredentials(iRequestBody).enqueue(new Callback<VpnCredentials>() {
            @Override
            public void onResponse(Call<VpnCredentials> call, Response<VpnCredentials> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<VpnCredentials> call, Throwable t) {
                reportErrorResponse(null, t instanceof NoConnectivityException ? t.getLocalizedMessage() : null);
            }

            private void reportSuccessResponse(Response<VpnCredentials> iResponse) {
                if (iResponse.isSuccessful())
                    mVpnServerCredentialsLiveEvent.postValue(Resource.success(iResponse.body()));
                else
                    reportErrorResponse(iResponse, null);
            }

            private void reportErrorResponse(Response<VpnCredentials> iResponse, String iThrowableLocalMessage) {
                if (iResponse != null) {
                    ApiError aError = ApiErrorUtils.parseGenericError(iResponse);
                    mVpnServerCredentialsLiveEvent.postValue(Resource.error(aError.getMessage() != null ? aError.getMessage() : AppConstants.ERROR_GENERIC, null));
                } else if (iThrowableLocalMessage != null)
                    mVpnServerCredentialsLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mVpnServerCredentialsLiveEvent.postValue(Resource.error(AppConstants.ERROR_GENERIC, null));
            }
        });
    }

    private void getVpnUsageForUser(GenericRequestBody iRequestBody) {
        mVpnUsageLiveEvent.postValue(Resource.loading(null));
        mGenericWebService.getVpnUsageForUser(iRequestBody).enqueue(new Callback<VpnUsage>() {
            @Override
            public void onResponse(Call<VpnUsage> call, Response<VpnUsage> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<VpnUsage> call, Throwable t) {
                reportErrorResponse(t instanceof NoConnectivityException ? t.getLocalizedMessage() : null);
            }

            private void reportSuccessResponse(Response<VpnUsage> response) {
                if (response != null && response.body() != null) {
                    if (response.body().success) {
                        mVpnUsageLiveEvent.postValue(Resource.success(response.body()));
                    } else {
                        reportErrorResponse(null);
                    }
                } else {
                    reportErrorResponse(null);
                }
            }

            private void reportErrorResponse(String iThrowableLocalMessage) {
                if (iThrowableLocalMessage != null) {
                    mVpnUsageLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                } else {
                    mVpnUsageLiveEvent.postValue(Resource.error(AppConstants.ERROR_GENERIC, null));
                }
            }
        });
    }

    private void getVpnConfig(String iUrl, GenericRequestBody iRequestBody) {
        mVpnConfigLiveEvent.postValue(Resource.loading(null));
        mGenericWebService.getVpnConfig(iUrl, iRequestBody).enqueue(new Callback<VpnConfig>() {
            @Override
            public void onResponse(Call<VpnConfig> call, Response<VpnConfig> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<VpnConfig> call, Throwable t) {
                reportErrorResponse(null, t instanceof NoConnectivityException ? t.getLocalizedMessage() : null);
            }

            private void reportSuccessResponse(Response<VpnConfig> iResponse) {
                if (iResponse.isSuccessful() && iResponse.body() != null && iResponse.body().success)
                    mVpnConfigLiveEvent.postValue(Resource.success(iResponse.body()));
                else
                    reportErrorResponse(iResponse, null);
            }

            private void reportErrorResponse(Response<VpnConfig> iResponse, String iThrowableLocalMessage) {
                if (iResponse != null) {
                    ApiError aError = ApiErrorUtils.parseGenericError(iResponse);
                    mVpnConfigLiveEvent.postValue(Resource.error(aError.getMessage() != null ? aError.getMessage() : AppConstants.ERROR_GENERIC, null));
                } else if (iThrowableLocalMessage != null)
                    mVpnConfigLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mVpnConfigLiveEvent.postValue(Resource.error(AppConstants.ERROR_GENERIC, null));
            }
        });
    }

    private Call<GenericResponse> disconnectVpn(String iUrl, GenericRequestBody iRequestBody) {
        mDisconnectLiveEvent.postValue(Resource.loading(null));
        return mGenericWebService.disconnectVpn(iUrl, iRequestBody);
    }

    public void rateVpnSession(GenericRequestBody iRequestBody) {
        mRatingLiveEvent.postValue(Resource.loading(null));
        mGenericWebService.rateVpnSession(iRequestBody).enqueue(new Callback<GenericResponse>() {
            @Override
            public void onResponse(Call<GenericResponse> call, Response<GenericResponse> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<GenericResponse> call, Throwable t) {
                reportErrorResponse(t instanceof NoConnectivityException ? t.getLocalizedMessage() : null);
            }

            private void reportSuccessResponse(Response<GenericResponse> iResponse) {
                if (iResponse.isSuccessful() && iResponse.body() != null)
                    mRatingLiveEvent.postValue(Resource.success(iResponse.body()));
                else
                    reportErrorResponse(null);
            }

            private void reportErrorResponse(String iThrowableLocalMessage) {
                if (iThrowableLocalMessage != null)
                    mRatingLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mRatingLiveEvent.postValue(Resource.error(AppConstants.ERROR_GENERIC, null));
            }
        });
    }
}