package sentinelgroup.io.sentinel.repository;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.MutableLiveData;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import sentinelgroup.io.sentinel.db.dao.VpnListEntryDao;
import sentinelgroup.io.sentinel.db.dao.VpnUsageEntryDao;
import sentinelgroup.io.sentinel.network.api.GenericWebService;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.ReportPay;
import sentinelgroup.io.sentinel.network.model.Tokens;
import sentinelgroup.io.sentinel.network.model.Vpn;
import sentinelgroup.io.sentinel.network.model.VpnConfig;
import sentinelgroup.io.sentinel.network.model.VpnCredentials;
import sentinelgroup.io.sentinel.network.model.VpnListEntity;
import sentinelgroup.io.sentinel.network.model.VpnUsage;
import sentinelgroup.io.sentinel.network.model.VpnUsageEntity;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.NoConnectivityException;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

/**
 * Repository class to handle VPN related data
 */
public class VpnRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static VpnRepository sInstance;
    private final VpnListEntryDao mListDao;
    private final VpnUsageEntryDao mUsageDao;
    private final GenericWebService mGenericWebService;
    private final AppExecutors mAppExecutors;
    private final MutableLiveData<List<VpnListEntity>> mVpnListMutableLiveData;
    private final MutableLiveData<VpnUsageEntity> mVpnUsageMutableLiveData;
    private final SingleLiveEvent<String> mVpnListErrorLiveEvent;
    private final SingleLiveEvent<Resource<VpnUsage>> mVpnUsageLiveEvent;
    private final SingleLiveEvent<Resource<VpnCredentials>> mVpnServerCredentialsLiveEvent;
    private final SingleLiveEvent<Resource<VpnConfig>> mVpnConfigLiveEvent;
    private final SingleLiveEvent<Resource<ReportPay>> mReportPaymentLiveEvent;
    private final SingleLiveEvent<Boolean> mTokenAlertLiveEvent;

    private VpnRepository(VpnListEntryDao iListDao, VpnUsageEntryDao iUsageDao, GenericWebService iGenericWebService, AppExecutors iAppExecutors) {
        mListDao = iListDao;
        mUsageDao = iUsageDao;
        mGenericWebService = iGenericWebService;
        mAppExecutors = iAppExecutors;
        mVpnListMutableLiveData = new MutableLiveData<>();
        mVpnUsageMutableLiveData = new MutableLiveData<>();
        mVpnListErrorLiveEvent = new SingleLiveEvent<>();
        mVpnUsageLiveEvent = new SingleLiveEvent<>();
        mVpnServerCredentialsLiveEvent = new SingleLiveEvent<>();
        mVpnConfigLiveEvent = new SingleLiveEvent<>();
        mReportPaymentLiveEvent = new SingleLiveEvent<>();
        mTokenAlertLiveEvent = new SingleLiveEvent<>();

        LiveData<List<VpnListEntity>> aVpnListServerData = getVpnListMutableLiveData();
        aVpnListServerData.observeForever(vpnList -> {
            mAppExecutors.diskIO().execute(() -> {
                if (vpnList != null && vpnList.size() > 0) {
                    mListDao.deleteVpnListEntity();
                    mListDao.insertVpnListEntity(vpnList);
                }
            });
        });

        LiveData<VpnUsageEntity> aVpnUsageServerData = getVpnUsageMutableLiveData();
        aVpnUsageServerData.observeForever(vpnUsage -> {
            mAppExecutors.diskIO().execute(() -> {
                if (vpnUsage != null) {
                    mUsageDao.insertVpnUsageEntity(vpnUsage);
                }
            });
        });
    }

    public static VpnRepository getInstance(VpnListEntryDao iListDao, VpnUsageEntryDao iUsageDao, GenericWebService iGenericWebService, AppExecutors iAppExecutors) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new VpnRepository(iListDao, iUsageDao, iGenericWebService, iAppExecutors);
            }
        }
        return sInstance;
    }

    private MutableLiveData<List<VpnListEntity>> getVpnListMutableLiveData() {
        getUnoccupiedVpnList();
        return mVpnListMutableLiveData;
    }

    private MutableLiveData<VpnUsageEntity> getVpnUsageMutableLiveData() {
        return mVpnUsageMutableLiveData;
    }

    // public getter methods for LiveData & SingleLiveEvent
    public LiveData<List<VpnListEntity>> getVpnListLiveData() {
        return mListDao.getVpnLisEntity();
    }

    public LiveData<VpnListEntity> getVpnLiveData(String iVpnAddress) {
        return mListDao.getVpnEntity(iVpnAddress);
    }

    public LiveData<VpnUsageEntity> getVpnUsageEntity() {
        return mUsageDao.getVpnUsageEntity();
    }

    public SingleLiveEvent<String> getVpnListErrorLiveEvent() {
        return mVpnListErrorLiveEvent;
    }

    public SingleLiveEvent<Resource<VpnUsage>> getVpnUsageLiveEvent(GenericRequestBody iRequestBody) {
        getVpnUsageForUser(iRequestBody);
        return mVpnUsageLiveEvent;
    }

    public SingleLiveEvent<Resource<VpnCredentials>> getVpnServerCredentialsLiveEvent() {
        return mVpnServerCredentialsLiveEvent;
    }

    public SingleLiveEvent<Resource<VpnConfig>> getVpnConfigLiveEvent() {
        return mVpnConfigLiveEvent;
    }

    public SingleLiveEvent<Resource<ReportPay>> getReportPaymentLiveEvent() {
        return mReportPaymentLiveEvent;
    }

    public SingleLiveEvent<Boolean> getTokenAlertLiveEvent(GenericRequestBody iBody) {
        if (!AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_FREE_TOKEN_RECEIVED))
            getFreeTokens(iBody);
        return mTokenAlertLiveEvent;
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

            private void reportSuccessResponse(Response<Vpn> response) {
                if (response != null && response.body() != null)
                    if (response.body().success && response.body().list != null && response.body().list.size() > 0)
                        mVpnListMutableLiveData.postValue(response.body().list);
            }

            private void reportErrorResponse(String iThrowableLocalMessage) {
                if (iThrowableLocalMessage != null)
                    mVpnListErrorLiveEvent.postValue(iThrowableLocalMessage);
                else
                    mVpnListErrorLiveEvent.postValue(AppConstants.GENERIC_ERROR);
            }
        });
    }

    public void getVpnServerCredentials(GenericRequestBody iRequestBody) {
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

            private void reportSuccessResponse(Response<VpnCredentials> response) {
                if (response != null && response.body() != null) {
                    if (response.body().success)
                        mVpnServerCredentialsLiveEvent.postValue(Resource.success(response.body()));
                    else
                        reportErrorResponse(response, null);
                } else {
                    reportErrorResponse(null, null);
                }
            }

            private void reportErrorResponse(Response<VpnCredentials> response, String iThrowableLocalMessage) {
                if (response != null && response.body() != null) {
                    mVpnServerCredentialsLiveEvent.postValue(Resource.error(response.body().message, null));
                } else if (iThrowableLocalMessage != null)
                    mVpnServerCredentialsLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mVpnServerCredentialsLiveEvent.postValue(Resource.error(AppConstants.GENERIC_ERROR, null));
            }
        });
    }

    public void getVpnUsageForUser(GenericRequestBody iRequestBody) {
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
                        mVpnUsageMutableLiveData.postValue(response.body().usage);
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
                    mVpnUsageLiveEvent.postValue(Resource.error(AppConstants.GENERIC_ERROR, null));
                }
            }
        });
    }

    public void getVpnConfig(String iUrl, GenericRequestBody iRequestBody) {
        mVpnConfigLiveEvent.postValue(Resource.loading(null));
        mGenericWebService.getVpnConfig(iUrl, iRequestBody).enqueue(new Callback<VpnConfig>() {
            @Override
            public void onResponse(Call<VpnConfig> call, Response<VpnConfig> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<VpnConfig> call, Throwable t) {
                reportErrorResponse(t instanceof NoConnectivityException ? t.getLocalizedMessage() : null);
            }

            private void reportSuccessResponse(Response<VpnConfig> response) {
                if (response != null && response.body() != null) {
                    if (response.body().success)
                        mVpnConfigLiveEvent.postValue(Resource.success(response.body()));
                } else {
                    reportErrorResponse(null);
                }
            }

            private void reportErrorResponse(String iThrowableLocalMessage) {
                if (iThrowableLocalMessage != null)
                    mVpnConfigLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mVpnConfigLiveEvent.postValue(Resource.error(AppConstants.GENERIC_ERROR, null));
            }
        });
    }

    public void reportPayment(GenericRequestBody iRequestBody) {
        mReportPaymentLiveEvent.postValue(Resource.loading(null));
        mGenericWebService.reportPayment(iRequestBody).enqueue(new Callback<ReportPay>() {
            @Override
            public void onResponse(Call<ReportPay> call, Response<ReportPay> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<ReportPay> call, Throwable t) {
                reportErrorResponse(t instanceof NoConnectivityException ? t.getLocalizedMessage() : null);
            }

            private void reportSuccessResponse(Response<ReportPay> response) {
                if (response != null && response.body() != null) {
                    if (response.body().success)
                        mReportPaymentLiveEvent.postValue(Resource.success(response.body()));
                    else
                        reportErrorResponse(response.message());
                } else {
                    reportErrorResponse(null);
                }
            }

            private void reportErrorResponse(String iThrowableLocalMessage) {
                if (iThrowableLocalMessage != null)
                    mReportPaymentLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mReportPaymentLiveEvent.postValue(Resource.error(AppConstants.GENERIC_ERROR, null));
            }
        });
    }

    private void getFreeTokens(GenericRequestBody iBody) {
        mGenericWebService.getFreeTokens(iBody).enqueue(new Callback<Tokens>() {
            @Override
            public void onResponse(Call<Tokens> call, Response<Tokens> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<Tokens> call, Throwable t) {
            }

            private void reportSuccessResponse(Response<Tokens> response) {
                if (response != null && response.body() != null) {
                    mTokenAlertLiveEvent.postValue(response.body().success);
                    AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_FREE_TOKEN_RECEIVED, true);
                }
            }
        });
    }
}
