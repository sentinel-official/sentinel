package sentinelgroup.io.sentinel.repository;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.MutableLiveData;

import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import sentinelgroup.io.sentinel.db.dao.BookmarkDao;
import sentinelgroup.io.sentinel.db.dao.VpnListEntryDao;
import sentinelgroup.io.sentinel.db.dao.VpnUsageEntryDao;
import sentinelgroup.io.sentinel.network.api.GenericWebService;
import sentinelgroup.io.sentinel.network.model.BookmarkEntity;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.GenericResponse;
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
    private final BookmarkDao mBookmarkDao;
    private final GenericWebService mGenericWebService;
    private final AppExecutors mAppExecutors;
    private final MutableLiveData<List<VpnListEntity>> mVpnListMutableLiveData;
    private final MutableLiveData<VpnUsageEntity> mVpnUsageMutableLiveData;
    private final SingleLiveEvent<String> mVpnListErrorLiveEvent;
    private final SingleLiveEvent<Resource<VpnUsage>> mVpnUsageLiveEvent;
    private final SingleLiveEvent<Resource<VpnCredentials>> mVpnServerCredentialsLiveEvent;
    private final SingleLiveEvent<Resource<VpnConfig>> mVpnConfigLiveEvent;
    private final SingleLiveEvent<Resource<ReportPay>> mReportPaymentLiveEvent;
    private final SingleLiveEvent<Resource<String>> mDisconnectLiveEvent;
    private final SingleLiveEvent<Boolean> mTokenAlertLiveEvent;
    private final SingleLiveEvent<Resource<GenericResponse>> mRatingLiveEvent;
    private final String mDeviceId;

    private VpnRepository(VpnListEntryDao iListDao, VpnUsageEntryDao iUsageDao, BookmarkDao iBookmarkDao, GenericWebService iGenericWebService, AppExecutors iAppExecutors, String iDeviceId) {
        mListDao = iListDao;
        mUsageDao = iUsageDao;
        mBookmarkDao = iBookmarkDao;
        mGenericWebService = iGenericWebService;
        mAppExecutors = iAppExecutors;
        mVpnListMutableLiveData = new MutableLiveData<>();
        mVpnUsageMutableLiveData = new MutableLiveData<>();
        mVpnListErrorLiveEvent = new SingleLiveEvent<>();
        mVpnUsageLiveEvent = new SingleLiveEvent<>();
        mVpnServerCredentialsLiveEvent = new SingleLiveEvent<>();
        mVpnConfigLiveEvent = new SingleLiveEvent<>();
        mReportPaymentLiveEvent = new SingleLiveEvent<>();
        mDisconnectLiveEvent = new SingleLiveEvent<>();
        mTokenAlertLiveEvent = new SingleLiveEvent<>();
        mRatingLiveEvent = new SingleLiveEvent<>();
        mDeviceId = iDeviceId;

        LiveData<List<VpnListEntity>> aVpnListServerData = getVpnListMutableLiveData();
        aVpnListServerData.observeForever(vpnList -> {
            mAppExecutors.diskIO().execute(() -> {
                if (vpnList != null && vpnList.size() > 0) {
                    List<BookmarkEntity> aBookmarks = mBookmarkDao.getAllBookmarkEntities();
                    for (int i = 0; i < vpnList.size(); i++) {
                        vpnList.get(i).setServerSequence(i);
                        vpnList.get(i).setBookmarked(aBookmarks.contains(new BookmarkEntity(vpnList.get(i).getAccountAddress(), vpnList.get(i).getIp())));
                    }
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

    public static VpnRepository getInstance(VpnListEntryDao iListDao, VpnUsageEntryDao iUsageDao, BookmarkDao iBookmarkDao, GenericWebService iGenericWebService, AppExecutors iAppExecutors, String iDeviceId) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new VpnRepository(iListDao, iUsageDao, iBookmarkDao, iGenericWebService, iAppExecutors, iDeviceId);
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
//    public LiveData<List<VpnListEntity>> getVpnListLiveDataSortedBy() {
//        return getVpnListLiveDataSortedBy(AppConstants.SORT_BY_DEFAULT);
//    }

    public LiveData<VpnListEntity> getVpnLiveDataByVpnAddress(String iVpnAddress) {
        return mListDao.getVpnEntity(iVpnAddress);
    }

    public LiveData<List<VpnListEntity>> getVpnListLiveDataSortedBy(String iSearchQuery, String iSelectedSortType, boolean toFilterByBookmark) {
        switch (iSelectedSortType) {
            case AppConstants.SORT_BY_COUNTRY_A:
                return toFilterByBookmark ? mListDao.getVpnLisEntitySortCountryA(iSearchQuery, toFilterByBookmark) : mListDao.getVpnLisEntitySortCountryA(iSearchQuery);
            case AppConstants.SORT_BY_COUNTRY_D:
                return toFilterByBookmark ? mListDao.getVpnLisEntitySortCountryD(iSearchQuery, toFilterByBookmark) : mListDao.getVpnLisEntitySortCountryD(iSearchQuery);
            case AppConstants.SORT_BY_LATENCY_I:
                return toFilterByBookmark ? mListDao.getVpnLisEntitySortLatencyI(iSearchQuery, toFilterByBookmark) : mListDao.getVpnLisEntitySortLatencyI(iSearchQuery);
            case AppConstants.SORT_BY_LATENCY_D:
                return toFilterByBookmark ? mListDao.getVpnLisEntitySortLatencyD(iSearchQuery, toFilterByBookmark) : mListDao.getVpnLisEntitySortLatencyD(iSearchQuery);
            case AppConstants.SORT_BY_BANDWIDTH_I:
                return toFilterByBookmark ? mListDao.getVpnLisEntitySortBandwidthI(iSearchQuery, toFilterByBookmark) : mListDao.getVpnLisEntitySortBandwidthI(iSearchQuery);
            case AppConstants.SORT_BY_BANDWIDTH_D:
                return toFilterByBookmark ? mListDao.getVpnLisEntitySortBandwidthD(iSearchQuery, toFilterByBookmark) : mListDao.getVpnLisEntitySortBandwidthD(iSearchQuery);
            case AppConstants.SORT_BY_PRICE_I:
                return toFilterByBookmark ? mListDao.getVpnLisEntitySortPriceI(iSearchQuery, toFilterByBookmark) : mListDao.getVpnLisEntitySortPriceI(iSearchQuery);
            case AppConstants.SORT_BY_PRICE_D:
                return toFilterByBookmark ? mListDao.getVpnLisEntitySortPriceD(iSearchQuery, toFilterByBookmark) : mListDao.getVpnLisEntitySortPriceD(iSearchQuery);
            case AppConstants.SORT_BY_RATING_I:
                return toFilterByBookmark ? mListDao.getVpnLisEntitySortRatingI(iSearchQuery, toFilterByBookmark) : mListDao.getVpnLisEntitySortRatingI(iSearchQuery);
            case AppConstants.SORT_BY_RATING_D:
                return toFilterByBookmark ? mListDao.getVpnLisEntitySortRatingD(iSearchQuery, toFilterByBookmark) : mListDao.getVpnLisEntitySortRatingD(iSearchQuery);
            case AppConstants.SORT_BY_DEFAULT:
            default:
                return toFilterByBookmark ? mListDao.getVpnLisEntity(iSearchQuery, toFilterByBookmark) : mListDao.getVpnLisEntity(iSearchQuery);
        }
    }

    public LiveData<VpnUsageEntity> getVpnUsageEntity() {
        return mUsageDao.getVpnUsageEntity();
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

    public SingleLiveEvent<Resource<ReportPay>> getReportPaymentLiveEvent() {
        return mReportPaymentLiveEvent;
    }

    public SingleLiveEvent<Boolean> getTokenAlertLiveEvent(GenericRequestBody iBody) {
        if (!AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_FREE_TOKEN_RECEIVED))
            getFreeTokens(iBody);
        return mTokenAlertLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getRatingLiveEvent() {
        return mRatingLiveEvent;
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
                    mVpnServerCredentialsLiveEvent.postValue(Resource.error(response.body().message, response.body()));
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

    public Call<GenericResponse> disconnectVpn() {
        GenericRequestBody aBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .accountAddress(AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS))
                .token(AppPreferences.getInstance().getString(AppConstants.PREFS_VPN_TOKEN))
                .build();
        String aUrl = String.format(Locale.US, AppConstants.DISCONNECT_URL_BUILDER, AppPreferences.getInstance().getString(AppConstants.PREFS_IP_ADDRESS), AppPreferences.getInstance().getInteger(AppConstants.PREFS_IP_PORT));
        return disconnectVpn(aUrl, aBody);
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

    public void toggleVpnBookmark(String iAccountAddress, String iIP) {
        mAppExecutors.diskIO().execute(() -> {
            if (isVpnBookmarked(iAccountAddress, iIP)) {
                mBookmarkDao.deleteBookmarkEntity(iAccountAddress, iIP);
            } else {
                mBookmarkDao.insertBookmarkEntity(new BookmarkEntity(iAccountAddress, iIP));
            }
        });
    }

    public boolean isVpnBookmarked(String iAccountAddress, String iIP) {
        return mBookmarkDao.getBookmarkEntity(iAccountAddress, iIP) > 0;
    }
}
