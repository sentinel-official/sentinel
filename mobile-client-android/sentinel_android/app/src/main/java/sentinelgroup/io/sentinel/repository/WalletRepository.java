package sentinelgroup.io.sentinel.repository;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.MutableLiveData;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import sentinelgroup.io.sentinel.db.dao.BalanceEntryDao;
import sentinelgroup.io.sentinel.network.api.WebService;
import sentinelgroup.io.sentinel.network.model.Balance;
import sentinelgroup.io.sentinel.network.model.Chains;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.Tokens;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

/**
 * Repository class to handle Wallet related data
 */
public class WalletRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static WalletRepository sInstance;
    private final BalanceEntryDao mDao;
    private final WebService mWebService;
    private final AppExecutors mAppExecutors;
    private final MutableLiveData<Balance> mBalanceMutableLiveData;
    private final SingleLiveEvent<String> mBalanceErrorLiveEvent;
    private final SingleLiveEvent<Boolean> mTokenAlertLiveEvent;

    private WalletRepository(BalanceEntryDao iDao, WebService iWebService, AppExecutors iAppExecutors) {
        mDao = iDao;
        mWebService = iWebService;
        mAppExecutors = iAppExecutors;
        mBalanceMutableLiveData = new MutableLiveData<>();
        mTokenAlertLiveEvent = new SingleLiveEvent<>();
        mBalanceErrorLiveEvent = new SingleLiveEvent<>();

        MutableLiveData<Balance> aBalanceLiveData = getBalanceMutableLiveData();
        aBalanceLiveData.observeForever(balance -> {
            mAppExecutors.diskIO().execute(() -> {
                if (balance != null && balance.success) {
                    mDao.insertBalanceEntity(balance.balances);
                }
            });
        });
    }

    public static WalletRepository getInstance(BalanceEntryDao iDao, WebService iWebService, AppExecutors iAppExecutors) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new WalletRepository(iDao, iWebService, iAppExecutors);
            }
        }
        return sInstance;
    }

    private MutableLiveData<Balance> getBalanceMutableLiveData() {
        return mBalanceMutableLiveData;
    }

    // public getter methods for LiveData & SingleLiveEvent
    public LiveData<Chains> getBalanceLiveData(GenericRequestBody iBody) {
        getAccountBalance(iBody);
        if (!AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_FIRST_TIME))
            getFreeTokens(iBody);
        return mDao.getBalanceEntity();
    }

    public SingleLiveEvent<String> getBalanceErrorLiveEvent() {
        return mBalanceErrorLiveEvent;
    }

    public SingleLiveEvent<Boolean> getTokenAlertLiveEvent() {
        return mTokenAlertLiveEvent;
    }

    public void updateBalance(GenericRequestBody iBody) {
        getAccountBalance(iBody);
    }

    // Network call
    private void getAccountBalance(GenericRequestBody iBody) {
        mWebService.getAccountBalance(iBody).enqueue(new Callback<Balance>() {
            @Override
            public void onResponse(Call<Balance> call, Response<Balance> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<Balance> call, Throwable t) {
                reportErrorResponse(t.getLocalizedMessage());
            }

            private void reportSuccessResponse(Response<Balance> response) {
                if (response != null && response.body() != null) {
                    if (response.body().success)
                        mBalanceMutableLiveData.postValue(response.body());
                } else {
                    reportErrorResponse(null);
                }
            }

            private void reportErrorResponse(String iThrowableLocalMessage) {
                if (iThrowableLocalMessage != null)
                    mBalanceErrorLiveEvent.postValue(iThrowableLocalMessage);
                else
                    mBalanceErrorLiveEvent.postValue(AppConstants.GENERIC_ERROR);
            }
        });
    }

    private void getFreeTokens(GenericRequestBody iBody) {
        mWebService.getFreeTokens(iBody).enqueue(new Callback<Tokens>() {
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
                    AppPreferences.getInstance().saveBoolean(AppConstants.PREFS_IS_FIRST_TIME, true);
                }
            }
        });
    }
}
