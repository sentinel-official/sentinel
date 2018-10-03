package co.sentinel.sentinellite.repository;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.MutableLiveData;

import co.sentinel.sentinellite.db.dao.BonusInfoDao;
import co.sentinel.sentinellite.network.api.BonusWebService;
import co.sentinel.sentinellite.network.model.ApiError;
import co.sentinel.sentinellite.network.model.BonusInfoEntity;
import co.sentinel.sentinellite.network.model.GenericRequestBody;
import co.sentinel.sentinellite.network.model.GenericResponse;
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
 * Repository class to handle Referral bonus related data
 */
public class BonusRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static BonusRepository sInstance;
    private final BonusInfoDao mDao;
    private final BonusWebService mBonusWebService;
    private final AppExecutors mAppExecutors;
    private final String mDeviceId;
    private final SingleLiveEvent<Resource<GenericResponse>> mAccountInfoByDeviceIdLiveEvent;
    private final SingleLiveEvent<Resource<GenericResponse>> mAccountInfoByAddressLiveEvent;
    private final SingleLiveEvent<Resource<GenericResponse>> mRegisterDeviceIdLiveEvent;
    private final MutableLiveData<BonusInfoEntity> mBonusInfoMutableLiveData;
    private final SingleLiveEvent<Resource<GenericResponse>> mLinkAccountLiveEvent;

    private BonusRepository(BonusInfoDao iDao, BonusWebService iReferralWebService, AppExecutors iAppExecutors, String iDeviceId) {
        this.mDao = iDao;
        this.mBonusWebService = iReferralWebService;
        this.mAppExecutors = iAppExecutors;
        mDeviceId = iDeviceId;
        mAccountInfoByDeviceIdLiveEvent = new SingleLiveEvent<>();
        mAccountInfoByAddressLiveEvent = new SingleLiveEvent<>();
        mRegisterDeviceIdLiveEvent = new SingleLiveEvent<>();
        mBonusInfoMutableLiveData = new MutableLiveData<>();
        mLinkAccountLiveEvent = new SingleLiveEvent<>();

        LiveData<BonusInfoEntity> aBonusInfoEntityLiveData = getBonusInfoMutableLiveData();
        aBonusInfoEntityLiveData.observeForever(referralInfoEntity -> {
            mAppExecutors.diskIO().execute(() -> {
                if (referralInfoEntity != null && referralInfoEntity.isSuccess()) {
                    mDao.insertBonusInfoEntity(referralInfoEntity);
                }
            });
        });
    }

    public static BonusRepository getInstance(BonusInfoDao iDao, BonusWebService iReferralWebService, AppExecutors iAppExecutors, String iDeviceId) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new BonusRepository(iDao, iReferralWebService, iAppExecutors, iDeviceId);
            }
        }
        return sInstance;
    }

    private MutableLiveData<BonusInfoEntity> getBonusInfoMutableLiveData() {
        fetchBonusInfo();
        return mBonusInfoMutableLiveData;
    }

    /*
     * public getter methods for LiveData and SingleLiveEvents
     */
    public SingleLiveEvent<Resource<GenericResponse>> getAccountInfoByDeviceIdLiveEvent() {
        return mAccountInfoByDeviceIdLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getAccountInfoByAddressLiveEvent() {
        return mAccountInfoByAddressLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getRegisterDeviceIdLiveEvent() {
        return mRegisterDeviceIdLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getLinkAccountLiveEvent() {
        return mLinkAccountLiveEvent;
    }

    public void registerDeviceId(String iReferralCode) {
        GenericRequestBody aRequestBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .deviceIdReferral(mDeviceId)
                .referredBy(iReferralCode)
                .build();
        addAccountInfo(aRequestBody);
    }

    public LiveData<BonusInfoEntity> getBonusInfoEntityLiveData() {
        return mDao.getBonusInfoEntity();
    }

    public void fetchAccountInfoByDeviceId() {
        getAccountDetailsByDeviceId();
    }

    public void fetchAccountInfoByAddress(String iAddress) {
        getAccountDetailsByAddress(iAddress);
    }

    public void fetchBonusInfo() {
        getBonusInfo();
    }

    /*
     * Network call
     */
    private void getAccountDetailsByDeviceId() {
        mBonusWebService.getAccountInfoByDeviceIdAddress(BonusWebService.ACCOUNT_INFO_BY_DEVICE_ID, mDeviceId).enqueue(new Callback<GenericResponse>() {
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
                    mAccountInfoByDeviceIdLiveEvent.postValue(Resource.success(iResponse.body()));
                } else {
                    reportErrorResponse(iResponse, null);
                }
            }

            private void reportErrorResponse(Response<GenericResponse> iResponse, String iThrowableLocalMessage) {
                if (iResponse != null) {
                    ApiError aError = ApiErrorUtils.parseGenericError(iResponse);
                    mAccountInfoByDeviceIdLiveEvent.postValue(Resource.error(aError.getMessage() != null ? aError.getMessage() : AppConstants.ERROR_GENERIC, iResponse.body()));
                } else if (iThrowableLocalMessage != null) {
                    mAccountInfoByDeviceIdLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                } else {
                    mAccountInfoByDeviceIdLiveEvent.postValue(Resource.error(AppConstants.ERROR_GENERIC, null));
                }
            }
        });
    }

    private void getAccountDetailsByAddress(String iAddress) {
        mAccountInfoByAddressLiveEvent.postValue(Resource.loading(null));
        mBonusWebService.getAccountInfoByDeviceIdAddress(BonusWebService.ACCOUNT_INFO_BY_ADDRESS, iAddress).enqueue(new Callback<GenericResponse>() {
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
                    mAccountInfoByAddressLiveEvent.postValue(Resource.success(iResponse.body()));
                } else {
                    reportErrorResponse(iResponse, null);
                }
            }

            private void reportErrorResponse(Response<GenericResponse> iResponse, String iThrowableLocalMessage) {
                if (iResponse != null) {
                    ApiError aError = ApiErrorUtils.parseGenericError(iResponse);
                    mAccountInfoByAddressLiveEvent.postValue(Resource.error(aError.getMessage() != null ? aError.getMessage() : AppConstants.ERROR_GENERIC, iResponse.body()));
                } else if (iThrowableLocalMessage != null) {
                    mAccountInfoByAddressLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                } else {
                    mAccountInfoByAddressLiveEvent.postValue(Resource.error(AppConstants.ERROR_GENERIC, null));
                }
            }
        });
    }

    private void addAccountInfo(GenericRequestBody iRequestBody) {
        mRegisterDeviceIdLiveEvent.postValue(Resource.loading(null));
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
                    mRegisterDeviceIdLiveEvent.postValue(Resource.success(iResponse.body()));
                } else {
                    reportErrorResponse(iResponse, null);
                }
            }

            private void reportErrorResponse(Response<GenericResponse> iResponse, String iThrowableLocalMessage) {
                if (iResponse != null) {
                    ApiError aError = ApiErrorUtils.parseGenericError(iResponse);
                    mRegisterDeviceIdLiveEvent.postValue(Resource.error(aError.getMessage() != null ? aError.getMessage() : AppConstants.ERROR_GENERIC, iResponse.body()));
                } else if (iThrowableLocalMessage != null) {
                    mRegisterDeviceIdLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                } else {
                    mRegisterDeviceIdLiveEvent.postValue(Resource.error(AppConstants.ERROR_GENERIC, null));
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

    public void linkSncSlcAccounts(String iSncRefId, String iSlcRefId, GenericRequestBody iRequestBody) {
        mLinkAccountLiveEvent.postValue(Resource.loading(null));
        mBonusWebService.linkSncSlcAccounts(iSncRefId, iSlcRefId, iRequestBody).enqueue(new Callback<GenericResponse>() {
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
                    mLinkAccountLiveEvent.postValue(Resource.success(iResponse.body()));
                } else {
                    reportErrorResponse(iResponse, null);
                }
            }

            private void reportErrorResponse(Response<GenericResponse> iResponse, String iThrowableLocalMessage) {
                if (iResponse != null) {
                    ApiError aError = ApiErrorUtils.parseGenericError(iResponse);
                    mLinkAccountLiveEvent.postValue(Resource.error(aError.getMessage() != null ? aError.getMessage() : AppConstants.ERROR_GENERIC, iResponse.body()));
                } else if (iThrowableLocalMessage != null) {
                    mLinkAccountLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                } else {
                    mLinkAccountLiveEvent.postValue(Resource.error(AppConstants.ERROR_GENERIC, null));
                }
            }
        });
    }
}