package sentinelgroup.io.sentinel.repository;

import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import sentinelgroup.io.sentinel.network.api.GenericWebService;
import sentinelgroup.io.sentinel.network.model.TxHistory;
import sentinelgroup.io.sentinel.network.model.TxResult;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Converter;
import sentinelgroup.io.sentinel.util.NoConnectivityException;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class TxHistoryRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static TxHistoryRepository sInstance;
    // TODO declare dao
    private final GenericWebService mGenericWebService;
    private final AppExecutors mAppExecutors;
    private final SingleLiveEvent<Resource<List<TxResult>>> mTxHistoryLiveEvent;


    private TxHistoryRepository(GenericWebService iGenericWebService, AppExecutors iAppExecutors) {
        mGenericWebService = iGenericWebService;
        mAppExecutors = iAppExecutors;
        mTxHistoryLiveEvent = new SingleLiveEvent<>();
    }

    public static TxHistoryRepository getInstance(GenericWebService iGenericWebService, AppExecutors iAppExecutors) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new TxHistoryRepository(iGenericWebService, iAppExecutors);
            }
        }
        return sInstance;
    }


    // public getter methods for LiveData & SingleLiveEvent
    public SingleLiveEvent<Resource<List<TxResult>>> getTxHistoryLiveEvent(boolean isEthTransaction) {
        reloadTxHistory(isEthTransaction);
        return mTxHistoryLiveEvent;
    }

    public void reloadTxHistory(boolean isEthTransaction) {
        String aAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        mAppExecutors.networkIO().execute(() -> {
            String aUrl;
            if (isEthTransaction) {
                aUrl = String.format(Locale.US, AppConstants.ETH_TX_URL_BUILDER, aAddress);
            } else {
                String a64bitAddress = Converter.get64bitAddress(aAddress.substring(2));
                aUrl = String.format(Locale.US, AppConstants.SENT_TX_URL_BUILDER, a64bitAddress, a64bitAddress);
            }
            getTxHistory(isEthTransaction, aUrl);
        });
    }

    // Network call
    private void getTxHistory(boolean isEthTransaction, String iUrl) {
        mTxHistoryLiveEvent.postValue(Resource.loading(null));
        mGenericWebService.getTransactionHistory(iUrl).enqueue(new Callback<TxHistory>() {
            @Override
            public void onResponse(Call<TxHistory> call, Response<TxHistory> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<TxHistory> call, Throwable t) {
                reportErrorResponse(t instanceof NoConnectivityException ? t.getLocalizedMessage() : null);
            }

            private void reportSuccessResponse(Response<TxHistory> response) {
                if (response != null && response.body() != null) {
                    if (response.body().status.equals("1")) {
                        if (response.body().result != null && response.body().result.size() > 0)
                            for (int i = 0; i < response.body().result.size(); i++) {
                                response.body().result.get(i).isEth = isEthTransaction;
                            }
                        mTxHistoryLiveEvent.postValue(Resource.success(response.body().result));
                    } else {
                        reportErrorResponse(response.body().message);
                    }
                } else
                    reportErrorResponse(null);
            }

            private void reportErrorResponse(String iThrowableLocalMessage) {
                if (iThrowableLocalMessage != null)
                    mTxHistoryLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mTxHistoryLiveEvent.postValue(Resource.error(AppConstants.GENERIC_ERROR, null));
            }
        });
    }
}
