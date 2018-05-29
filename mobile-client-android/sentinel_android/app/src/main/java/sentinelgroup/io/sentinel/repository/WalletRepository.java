package sentinelgroup.io.sentinel.repository;

import android.arch.lifecycle.MutableLiveData;
import android.content.res.Resources;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.network.api.WebService;
import sentinelgroup.io.sentinel.network.model.Balance;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.Tokens;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class WalletRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static WalletRepository sInstance;
    private final WebService mWebService;
    private final MutableLiveData<Resource<Balance>> mBalanceMutableLiveData;
    private final SingleLiveEvent<Boolean> mTokenAlertLiveEvent;

    private WalletRepository(WebService iWebService) {
        mWebService = iWebService;
        mBalanceMutableLiveData = new MutableLiveData<>();
        mTokenAlertLiveEvent = new SingleLiveEvent<>();
    }

    public static WalletRepository getInstance(WebService iWebService) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new WalletRepository(iWebService);
            }
        }
        return sInstance;
    }

    public MutableLiveData<Resource<Balance>> getBalanceMutableLiveData(GenericRequestBody iBody) {
        getAccountBalance(iBody);
        if (!AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_FIRST_TIME))
            getFreeTokens(iBody);
        return mBalanceMutableLiveData;
    }

    public SingleLiveEvent<Boolean> getTokenAlertLiveEvent() {
        return mTokenAlertLiveEvent;
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
                        mBalanceMutableLiveData.postValue(Resource.success(response.body()));
                } else {
                    reportErrorResponse(null);
                }
            }

            private void reportErrorResponse(String iThrowableLocalMessage) {
                if (iThrowableLocalMessage != null)
                    mBalanceMutableLiveData.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mBalanceMutableLiveData.postValue(Resource.error(AppConstants.GENERIC_ERROR, null));
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
