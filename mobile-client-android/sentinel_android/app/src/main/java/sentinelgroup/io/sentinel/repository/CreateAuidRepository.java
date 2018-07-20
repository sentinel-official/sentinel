package sentinelgroup.io.sentinel.repository;

import android.support.annotation.NonNull;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import sentinelgroup.io.sentinel.db.dao.DeleteTableDao;
import sentinelgroup.io.sentinel.network.api.WebService;
import sentinelgroup.io.sentinel.network.model.Account;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppExecutors;
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
    private final WebService mWebService;
    private final AppExecutors mAppExecutors;
    private final SingleLiveEvent<Resource<Account>> mAccountLiveEvent;
    private final SingleLiveEvent<Boolean> mSessionClearedLiveEvent;

    private CreateAuidRepository(DeleteTableDao iDao, WebService iWebService, AppExecutors iAppExecutors) {
        mDao = iDao;
        mWebService = iWebService;
        mAppExecutors = iAppExecutors;
        mAccountLiveEvent = new SingleLiveEvent<>();
        mSessionClearedLiveEvent = new SingleLiveEvent<>();
    }

    public static CreateAuidRepository getInstance(DeleteTableDao iDao, WebService iWebService, AppExecutors iAppExecutors) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new CreateAuidRepository(iDao, iWebService, iAppExecutors);
            }
        }
        return sInstance;
    }

    public SingleLiveEvent<Resource<Account>> getAccountLiveEvent() {
        return mAccountLiveEvent;
    }


    public SingleLiveEvent<Boolean> getmSessionClearedLiveEvent() {
        clearUserSession();
        return mSessionClearedLiveEvent;
    }

    // Database call
    private void clearUserSession() {
        mAppExecutors.diskIO().execute(() -> {
            mDao.deletePinEntities();
            mDao.deleteBalanceEntities();
            mDao.deleteVpnUsageEntities();
            mSessionClearedLiveEvent.postValue(true);
        });
    }

    // Network call
    public void createNewAccount(GenericRequestBody iRequestBody) {
        mAccountLiveEvent.postValue(Resource.loading(null));
        mWebService.createNewAccount(iRequestBody).enqueue(new Callback<Account>() {
            @Override
            public void onResponse(@NonNull Call<Account> call, @NonNull Response<Account> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<Account> call, Throwable t) {
                reportErrorResponse(null, t.getLocalizedMessage());
            }

            private void reportSuccessResponse(Response<Account> response) {
                if (response != null && response.body() != null) {
                    if (response.body().success)
                        mAccountLiveEvent.postValue(Resource.success(response.body()));
                    else
                        reportErrorResponse(response, null);
                } else {
                    reportErrorResponse(null, null);
                }
            }

            private void reportErrorResponse(Response<Account> response, String iThrowableLocalMessage) {
                if (response != null && response.body() != null)
                    mAccountLiveEvent.postValue(Resource.error(response.body().message, response.body()));
                else if (iThrowableLocalMessage != null)
                    mAccountLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mAccountLiveEvent.postValue(Resource.error(AppConstants.GENERIC_ERROR, null));
            }
        });
    }
}