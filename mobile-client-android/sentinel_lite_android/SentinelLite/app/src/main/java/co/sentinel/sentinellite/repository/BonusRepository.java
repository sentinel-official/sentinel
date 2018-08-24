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
    private final SingleLiveEvent<Resource<GenericResponse>> mAccountInfoLiveEvent;
    private final SingleLiveEvent<Resource<GenericResponse>> mRegisterDeviceIdLiveEvent;
    private final MutableLiveData<BonusInfoEntity> mBonusInfoMutableLiveData;

    private BonusRepository(BonusInfoDao iDao, BonusWebService iReferralWebService, AppExecutors iAppExecutors, String iDeviceId) {
        this.mDao = iDao;
        this.mBonusWebService = iReferralWebService;
        this.mAppExecutors = iAppExecutors;
        mDeviceId = iDeviceId;
        mAccountInfoLiveEvent = new SingleLiveEvent<>();
        mRegisterDeviceIdLiveEvent = new SingleLiveEvent<>();
        mBonusInfoMutableLiveData = new MutableLiveData<>();

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
    public SingleLiveEvent<Resource<GenericResponse>> getAccountInfoLiveEvent() {
        return mAccountInfoLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getRegisterDeviceIdLiveEvent() {
        return mRegisterDeviceIdLiveEvent;
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
        mBonusWebService.getAccountInfo(mDeviceId).enqueue(new Callback<GenericResponse>() {
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
                } else if (iThrowableLocalMessage != null) {
                    mAccountInfoLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                } else {
                    mAccountInfoLiveEvent.postValue(Resource.error(AppConstants.ERROR_GENERIC, null));
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
}