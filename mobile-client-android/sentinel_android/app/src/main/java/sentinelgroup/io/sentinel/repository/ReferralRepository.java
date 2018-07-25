package sentinelgroup.io.sentinel.repository;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.MutableLiveData;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import sentinelgroup.io.sentinel.db.dao.ReferralInfoDao;
import sentinelgroup.io.sentinel.network.api.ReferralWebService;
import sentinelgroup.io.sentinel.network.model.ApiError;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.GenericResponse;
import sentinelgroup.io.sentinel.network.model.ReferralInfoEntity;
import sentinelgroup.io.sentinel.util.ApiErrorUtils;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.NoConnectivityException;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

/**
 * Repository class to handle Referral related data
 */
public class ReferralRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static ReferralRepository sInstance;
    private final ReferralInfoDao mDao;
    private final ReferralWebService mReferralWebService;
    private final AppExecutors mAppExecutors;
    private final MutableLiveData<ReferralInfoEntity> mReferralInfoMutableLiveData;
    private final SingleLiveEvent<Resource<GenericResponse>> mReferralClaimLiveEvent;

    private ReferralRepository(ReferralInfoDao iDao, ReferralWebService iReferralWebService, AppExecutors iAppExecutors) {
        this.mDao = iDao;
        this.mReferralWebService = iReferralWebService;
        this.mAppExecutors = iAppExecutors;
        mReferralInfoMutableLiveData = new MutableLiveData<>();
        mReferralClaimLiveEvent = new SingleLiveEvent<>();

        LiveData<ReferralInfoEntity> aReferralInfoEntityLiveData = getReferralInfoMutableLiveData();
        aReferralInfoEntityLiveData.observeForever(referralInfoEntity -> {
            mAppExecutors.diskIO().execute(() -> {
                if (referralInfoEntity != null && referralInfoEntity.isSuccess()) {
                    mDao.insertReferralInfoEntity(referralInfoEntity);
                }
            });
        });
    }

    public static ReferralRepository getInstance(ReferralInfoDao iDao, ReferralWebService iReferralWebService, AppExecutors iAppExecutors) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new ReferralRepository(iDao, iReferralWebService, iAppExecutors);
            }
        }
        return sInstance;
    }

    private MutableLiveData<ReferralInfoEntity> getReferralInfoMutableLiveData() {
        String aAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        getReferralInfo(aAddress);
        return mReferralInfoMutableLiveData;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getReferralClaimLiveEvent() {
        return mReferralClaimLiveEvent;
    }

    /*
     * Public getter methods for LiveData and SingleLiveEvents
     */
    public LiveData<ReferralInfoEntity> getReferralInfoEntityLiveData() {
        return mDao.getReferralInfoEntity();
    }

    public void updateReferralInfo(String iAddress) {
        getReferralInfo(iAddress);
    }

    /*
     * Network call
     */
    private void getReferralInfo(String iAddress) {
        mReferralWebService.getReferralInfo(iAddress).enqueue(new Callback<ReferralInfoEntity>() {
            @Override
            public void onResponse(Call<ReferralInfoEntity> call, Response<ReferralInfoEntity> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<ReferralInfoEntity> call, Throwable t) {
                reportSuccessResponse(null);
            }

            private void reportSuccessResponse(Response<ReferralInfoEntity> iResponse) {
                if (iResponse.isSuccessful()) {
                    if (iResponse.body() != null) {
                        iResponse.body().setAddress(iAddress);
                        mReferralInfoMutableLiveData.postValue(iResponse.body());
                    }
                }
            }
        });
    }

    public void claimReferralBonus(GenericRequestBody iRequestBody) {
        mReferralClaimLiveEvent.postValue(Resource.loading(null));
        mReferralWebService.claimReferralBonus(iRequestBody).enqueue(new Callback<GenericResponse>() {
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
                    mReferralClaimLiveEvent.postValue(Resource.success(iResponse.body()));
                } else {
                    reportErrorResponse(iResponse, null);
                }

            }

            private void reportErrorResponse(Response<GenericResponse> iResponse, String iThrowableLocalMessage) {
                if (iResponse != null) {
                    ApiError aError = ApiErrorUtils.parseGenericError(iResponse);
                    mReferralClaimLiveEvent.postValue(Resource.error(aError.getMessage(), iResponse.body()));
                } else if (iThrowableLocalMessage != null) {
                    mReferralClaimLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                } else {
                    mReferralClaimLiveEvent.postValue(Resource.error(AppConstants.GENERIC_ERROR, null));
                }
            }
        });
    }
}