package sentinelgroup.io.sentinel.repository;

import android.support.annotation.NonNull;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import sentinelgroup.io.sentinel.db.dao.DeleteTableDao;
import sentinelgroup.io.sentinel.network.api.GenericWebService;
import sentinelgroup.io.sentinel.network.api.BonusWebService;
import sentinelgroup.io.sentinel.network.model.Account;
import sentinelgroup.io.sentinel.network.model.ApiError;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.GenericResponse;
import sentinelgroup.io.sentinel.util.ApiErrorUtils;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.util.NoConnectivityException;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

/**
 * Repository class to handle Account related data
 */
public class CreateAuidRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static CreateAuidRepository sInstance;
    private final DeleteTableDao mDao;
    private final GenericWebService mGenericWebService;
    private final BonusWebService mBonusWebService;
    private final AppExecutors mAppExecutors;
    private final SingleLiveEvent<Resource<Account>> mAccountLiveEvent;
    private final SingleLiveEvent<Resource<GenericResponse>> mReferralLiveEvent;
    private final SingleLiveEvent<Boolean> mSessionClearedLiveEvent;

    private CreateAuidRepository(DeleteTableDao iDao, GenericWebService iGenericWebService, BonusWebService iBonusWebService, AppExecutors iAppExecutors) {
        mDao = iDao;
        mGenericWebService = iGenericWebService;
        mBonusWebService = iBonusWebService;
        mAppExecutors = iAppExecutors;
        mAccountLiveEvent = new SingleLiveEvent<>();
        mReferralLiveEvent = new SingleLiveEvent<>();
        mSessionClearedLiveEvent = new SingleLiveEvent<>();
    }

    public static CreateAuidRepository getInstance(DeleteTableDao iDao, GenericWebService iGenericWebService, BonusWebService iBonusWebService, AppExecutors iAppExecutors) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new CreateAuidRepository(iDao, iGenericWebService, iBonusWebService, iAppExecutors);
            }
        }
        return sInstance;
    }

    /*
     * public getter methods for LiveData and SingleLiveEvents
     */
    public SingleLiveEvent<Resource<Account>> getAccountLiveEvent() {
        return mAccountLiveEvent;
    }

    public SingleLiveEvent<Boolean> getSessionClearedLiveEvent() {
        clearUserSession();
        return mSessionClearedLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getReferralLiveEvent() {
        return mReferralLiveEvent;
    }

    /*
     * Database call
     */
    private void clearUserSession() {
        mAppExecutors.diskIO().execute(() -> {
            mDao.deletePinEntities();
            mDao.deleteVpnListEntities();
            mDao.deleteVpnUsageEntities();
            mDao.deleteBalanceEntities();
            mDao.deleteBonusInfoEntity();
            mSessionClearedLiveEvent.postValue(true);
        });
    }

    /*
     * Network call
     */
    public void createNewAccount(GenericRequestBody iRequestBody) {
        mAccountLiveEvent.postValue(Resource.loading(null));
        mGenericWebService.createNewAccount(iRequestBody).enqueue(new Callback<Account>() {
            @Override
            public void onResponse(@NonNull Call<Account> call, @NonNull Response<Account> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<Account> call, Throwable t) {
                reportErrorResponse(null, t instanceof NoConnectivityException ? t.getLocalizedMessage() : null);
            }

            private void reportSuccessResponse(Response<Account> iResponse) {
                if (iResponse.isSuccessful()) {
                    mAccountLiveEvent.postValue(Resource.success(iResponse.body()));
                } else {
                    reportErrorResponse(iResponse, null);
                }
            }

            private void reportErrorResponse(Response<Account> iResponse, String iThrowableLocalMessage) {
                if (iResponse != null) {
                    ApiError aError = ApiErrorUtils.parseGenericError(iResponse);
                    mAccountLiveEvent.postValue(Resource.error(aError.getMessage(), iResponse.body()));
                } else if (iThrowableLocalMessage != null)
                    mAccountLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mAccountLiveEvent.postValue(Resource.error(AppConstants.GENERIC_ERROR, null));
            }
        });
    }

    public void addReferralAddress(GenericRequestBody iRequestBody) {
        mReferralLiveEvent.postValue(Resource.loading(null));
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
                    mReferralLiveEvent.postValue(Resource.success(iResponse.body()));
                } else {
                    reportErrorResponse(iResponse, null);
                }
            }

            private void reportErrorResponse(Response<GenericResponse> iResponse, String iThrowableLocalMessage) {
                if (iResponse != null) {
                    ApiError aError = ApiErrorUtils.parseGenericError(iResponse);
                    mReferralLiveEvent.postValue(Resource.error(aError.getMessage(), iResponse.body()));
                } else if (iThrowableLocalMessage != null) {
                    mReferralLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                } else {
                    mReferralLiveEvent.postValue(Resource.error(AppConstants.GENERIC_ERROR, null));
                }
            }
        });
    }
}