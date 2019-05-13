package sentinelgroup.io.sentinel.repository;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.MutableLiveData;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import sentinelgroup.io.sentinel.db.dao.BonusInfoDao;
import sentinelgroup.io.sentinel.network.api.BonusWebService;
import sentinelgroup.io.sentinel.network.model.ApiError;
import sentinelgroup.io.sentinel.network.model.BonusInfoEntity;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.GenericResponse;
import sentinelgroup.io.sentinel.util.ApiErrorUtils;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Logger;
import sentinelgroup.io.sentinel.util.NoConnectivityException;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

/**
 * Repository class to handle Bonus related data
 */
public class BonusRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static BonusRepository sInstance;
    private final BonusInfoDao mDao;
    private final BonusWebService mBonusWebService;
    private final BonusWebService mBonusLongTimeoutWebService;
    private final AppExecutors mAppExecutors;
    private final SingleLiveEvent<Resource<GenericResponse>> mAccountInfoLiveEvent;
    private final MutableLiveData<BonusInfoEntity> mBonusInfoMutableLiveData;
    private final SingleLiveEvent<Resource<GenericResponse>> mAddAccountLiveEvent;
    private final SingleLiveEvent<Resource<GenericResponse>> mUpdateAccountLiveEvent;
    private final String mDeviceId;

    private BonusRepository(BonusInfoDao iDao, BonusWebService iBonusWebService, BonusWebService iBonusLongTimeoutWebService, AppExecutors iAppExecutors, String iDeviceId) {
        this.mDao = iDao;
        this.mBonusWebService = iBonusWebService;
        this.mBonusLongTimeoutWebService = iBonusLongTimeoutWebService;
        this.mAppExecutors = iAppExecutors;
        mAccountInfoLiveEvent = new SingleLiveEvent<>();
        mAddAccountLiveEvent = new SingleLiveEvent<>();
        mUpdateAccountLiveEvent = new SingleLiveEvent<>();
        mBonusInfoMutableLiveData = new MutableLiveData<>();
        mDeviceId = iDeviceId;

        LiveData<BonusInfoEntity> aBonusInfoEntityLiveData = getBonusInfoMutableLiveData();
        aBonusInfoEntityLiveData.observeForever(bonusInfoEntity -> {
            mAppExecutors.diskIO().execute(() -> {
                if (bonusInfoEntity != null && bonusInfoEntity.isSuccess()) {
                    mDao.insertBonusInfoEntity(bonusInfoEntity);
                }
            });
        });
    }

    public static BonusRepository getInstance(BonusInfoDao iDao, BonusWebService iBonusWebService, BonusWebService iBonusLongTimeoutWebService, AppExecutors iAppExecutors, String iDeviceId) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new BonusRepository(iDao, iBonusWebService, iBonusLongTimeoutWebService, iAppExecutors, iDeviceId);
            }
        }
        return sInstance;
    }

    private MutableLiveData<BonusInfoEntity> getBonusInfoMutableLiveData() {
        getBonusInfo();
        return mBonusInfoMutableLiveData;
    }

    /*
     * Public getter methods for LiveData and SingleLiveEvents
     */
    public SingleLiveEvent<Resource<GenericResponse>> getAddAccountLiveEvent() {
        return mAddAccountLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getUpdateAccountLiveEvent() {
        return mUpdateAccountLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getAccountInfoLiveEvent() {
        return mAccountInfoLiveEvent;
    }

    public void fetchAccountInfo() {
        getAccountDetails();
    }

    public void fetchBonusInfo() {
        getBonusInfo();
    }

    /*
     * Network call
     */
    private void getAccountDetails() {
        mBonusLongTimeoutWebService.getAccountInfoByDeviceIdAddress("deviceId", mDeviceId).enqueue(new Callback<GenericResponse>() {
            @Override
            public void onResponse(Call<GenericResponse> call, Response<GenericResponse> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<GenericResponse> call, Throwable t) {
                reportErrorResponse(null, t instanceof NoConnectivityException ? t.getLocalizedMessage() : null);
            }

            private void reportSuccessResponse(Response<GenericResponse> iResponse) {
                if (iResponse.isSuccessful()) {
                    if (iResponse.body() != null && iResponse.body().account != null && iResponse.body().account.referralId != null) {
                        AppPreferences.getInstance().saveString(AppConstants.PREFS_REF_ID, iResponse.body().account.referralId);
                    }
                    mAccountInfoLiveEvent.postValue(Resource.success(iResponse.body()));
                } else {
                    reportErrorResponse(iResponse, null);
                }
            }

            private void reportErrorResponse(Response<GenericResponse> iResponse, String iThrowableLocalMessage) {
                if (iResponse != null) {
                    ApiError aError = ApiErrorUtils.parseGenericError(iResponse);
                    mAccountInfoLiveEvent.postValue(Resource.error(aError.getMessage() != null ? aError.getMessage() : AppConstants.ERROR_GENERIC, iResponse.body()));
                    Logger.logDebug("BonusRepository", "getAccountDetails: " + (aError.getMessage() != null ? aError.getMessage() : AppConstants.ERROR_GENERIC));
                } else if (iThrowableLocalMessage != null) {
                    mAccountInfoLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                    Logger.logDebug("BonusRepository", "getAccountDetails: " + iThrowableLocalMessage);
                } else {
                    mAccountInfoLiveEvent.postValue(Resource.error(AppConstants.ERROR_GENERIC, null));
                    Logger.logDebug("BonusRepository", "getAccountDetails: ERROR_GENERIC");
                }
            }
        });
    }

    private void getBonusInfo() {
        mBonusWebService.getBonusInfo(mDeviceId).enqueue(new Callback<BonusInfoEntity>() {
            @Override
            public void onResponse(Call<BonusInfoEntity> call, Response<BonusInfoEntity> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<BonusInfoEntity> call, Throwable t) {
            }

            private void reportSuccessResponse(Response<BonusInfoEntity> iResponse) {
                if (iResponse.isSuccessful()) {
                    if (iResponse.body() != null) {
                        iResponse.body().setDeviceId(mDeviceId);
                        mBonusInfoMutableLiveData.postValue(iResponse.body());
                    }
                }
            }
        });
    }

    public void addAccountInfo(GenericRequestBody iRequestBody) {
        mAddAccountLiveEvent.postValue(Resource.loading(null));
        mBonusWebService.addAccount(iRequestBody).enqueue(new Callback<GenericResponse>() {
            @Override
            public void onResponse(Call<GenericResponse> call, Response<GenericResponse> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<GenericResponse> call, Throwable t) {
                reportErrorResponse(null, t instanceof NoConnectivityException ? t.getLocalizedMessage() : null);
            }

            private void reportSuccessResponse(Response<GenericResponse> iResponse) {
                if (iResponse.isSuccessful()) {
                    mAddAccountLiveEvent.postValue(Resource.success(iResponse.body()));
                } else {
                    reportErrorResponse(iResponse, null);
                }
            }

            private void reportErrorResponse(Response<GenericResponse> iResponse, String iThrowableLocalMessage) {
                if (iResponse != null) {
                    ApiError aError = ApiErrorUtils.parseGenericError(iResponse);
                    mAddAccountLiveEvent.postValue(Resource.error(aError.getMessage() != null ? aError.getMessage() : AppConstants.ERROR_GENERIC, iResponse.body()));
                } else if (iThrowableLocalMessage != null) {
                    mAddAccountLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                } else {
                    mAddAccountLiveEvent.postValue(Resource.error(AppConstants.ERROR_GENERIC, null));
                }
            }
        });
    }

    public void updateAccount(String iDeviceId, GenericRequestBody iRequestBody) {
        mUpdateAccountLiveEvent.postValue(Resource.loading(null));
        mBonusWebService.updateAccount(iDeviceId, iRequestBody).enqueue(new Callback<GenericResponse>() {
            @Override
            public void onResponse(Call<GenericResponse> call, Response<GenericResponse> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<GenericResponse> call, Throwable t) {
                reportErrorResponse(null, t instanceof NoConnectivityException ? t.getLocalizedMessage() : null);
            }

            private void reportSuccessResponse(Response<GenericResponse> iResponse) {
                if (iResponse.isSuccessful()) {
                    mUpdateAccountLiveEvent.postValue(Resource.success(iResponse.body()));
                } else {
                    reportErrorResponse(iResponse, null);
                }
            }

            private void reportErrorResponse(Response<GenericResponse> iResponse, String iThrowableLocalMessage) {
                if (iResponse != null) {
                    ApiError aError = ApiErrorUtils.parseGenericError(iResponse);
                    mUpdateAccountLiveEvent.postValue(Resource.error(aError.getMessage() != null ? aError.getMessage() : AppConstants.ERROR_GENERIC, iResponse.body()));
                } else if (iThrowableLocalMessage != null) {
                    mUpdateAccountLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                } else {
                    mUpdateAccountLiveEvent.postValue(Resource.error(AppConstants.ERROR_GENERIC, null));
                }
            }
        });
    }
}