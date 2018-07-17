package sentinelgroup.io.sentinel.repository;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.MutableLiveData;

import com.google.gson.Gson;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import sentinelgroup.io.sentinel.db.dao.GasEstimateEntryDao;
import sentinelgroup.io.sentinel.network.api.WebService;
import sentinelgroup.io.sentinel.network.model.GasEstimateEntity;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.PayError;
import sentinelgroup.io.sentinel.network.model.PayResponse;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

/**
 * Repository class to handle Outgoing Transaction related data
 */
public class SendRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static SendRepository sInstance;
    private final GasEstimateEntryDao mDao;
    private final WebService mWebService;
    private final AppExecutors mAppExecutors;
    private final MutableLiveData<GasEstimateEntity> mGasEstimateMutableLieData;
    private final SingleLiveEvent<Resource<PayResponse>> mTransactionLiveEvent;

    private SendRepository(GasEstimateEntryDao iDao, WebService iWebService, AppExecutors iAppExecutors) {
        mDao = iDao;
        mWebService = iWebService;
        mAppExecutors = iAppExecutors;
        mTransactionLiveEvent = new SingleLiveEvent<>();
        mGasEstimateMutableLieData = new MutableLiveData<>();

        LiveData<GasEstimateEntity> aGasEstimateServerData = getGasEstimateMutableLieData();
        aGasEstimateServerData.observeForever(gas -> {
            mAppExecutors.diskIO().execute(() -> {
                if (gas != null)
                    mDao.insertGasEstimateEntity(gas);
            });
        });
    }

    public static SendRepository getInstance(GasEstimateEntryDao iDao, WebService iWebService, AppExecutors iAppExecutors) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new SendRepository(iDao, iWebService, iAppExecutors);
            }
        }
        return sInstance;
    }

    private MutableLiveData<GasEstimateEntity> getGasEstimateMutableLieData() {
        return mGasEstimateMutableLieData;
    }

    public LiveData<GasEstimateEntity> getGasEstimateLiveData(String iUrl) {
        getGasPriceEstimate(iUrl);
        return mDao.getGasEstimateEntity();
    }

    public SingleLiveEvent<Resource<PayResponse>> getTransactionLiveEvent() {
        return mTransactionLiveEvent;
    }

    // Network Call
    public void makeRawTransaction(GenericRequestBody iRequestBody) {
        mTransactionLiveEvent.postValue(Resource.loading(null));
        mWebService.makeRawTransaction(iRequestBody).enqueue(new Callback<PayResponse>() {
            @Override
            public void onResponse(Call<PayResponse> call, Response<PayResponse> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<PayResponse> call, Throwable t) {
                reportErrorResponse(null, t.getLocalizedMessage());
            }

            private void reportSuccessResponse(Response<PayResponse> response) {
                if (response != null && response.body() != null) {
                    if (response.body().success)
                        mTransactionLiveEvent.postValue(Resource.success(response.body()));
                    else
                        reportErrorResponse(response, null);
                } else {
                    reportErrorResponse(null, null);
                }
            }

            private void reportErrorResponse(Response<PayResponse> response, String iThrowableLocalMessage) {
                if (response != null && response.body() != null) {
                    Gson aGson = new Gson();
                    PayError aPayError = aGson.fromJson(response.body().error.error, PayError.class);
                    String aErrorMessage = (aPayError != null && !aPayError.message.isEmpty()) ? aPayError.message : response.body().message;
                    mTransactionLiveEvent.postValue(Resource.error(aErrorMessage, response.body()));
                } else if (iThrowableLocalMessage != null)
                    mTransactionLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mTransactionLiveEvent.postValue(Resource.error(AppConstants.GENERIC_ERROR, null));
            }
        });
    }

    public void makeVpnPayment(GenericRequestBody iRequestBody) {
        mTransactionLiveEvent.postValue(Resource.loading(null));
        mWebService.makeVpnUsagePayment(iRequestBody).enqueue(new Callback<PayResponse>() {
            @Override
            public void onResponse(Call<PayResponse> call, Response<PayResponse> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<PayResponse> call, Throwable t) {
                reportErrorResponse(null, t.getLocalizedMessage());
            }

            private void reportSuccessResponse(Response<PayResponse> response) {
                if (response != null && response.body() != null) {
                    if (response.body().success)
                        mTransactionLiveEvent.postValue(Resource.success(response.body()));
                    else
                        reportErrorResponse(response, null);
                } else {
                    reportErrorResponse(null, null);
                }
            }

            private void reportErrorResponse(Response<PayResponse> response, String iThrowableLocalMessage) {
                if (response != null && response.body() != null) {
                    String aErrorMessage;
                    if (response.body().errors != null && response.body().errors.size() > 0) {
                        PayError aPayError = response.body().errors.get(0);
                        aErrorMessage = (aPayError != null && aPayError.error != null && !aPayError.error.isEmpty()) ? aPayError.error : response.body().message;
                    } else {
                        aErrorMessage = (response.body().message != null && !response.body().message.isEmpty() ? response.body().message : AppConstants.GENERIC_ERROR);
                    }
                    mTransactionLiveEvent.postValue(Resource.error(aErrorMessage, response.body()));
                } else if (iThrowableLocalMessage != null)
                    mTransactionLiveEvent.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mTransactionLiveEvent.postValue(Resource.error(AppConstants.GENERIC_ERROR, null));
            }
        });
    }

    private void getGasPriceEstimate(String iUrl) {
        mWebService.getGasPriceEstimate(iUrl).enqueue(new Callback<GasEstimateEntity>() {
            @Override
            public void onResponse(Call<GasEstimateEntity> call, Response<GasEstimateEntity> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<GasEstimateEntity> call, Throwable t) {
                t.printStackTrace();
            }

            private void reportSuccessResponse(Response<GasEstimateEntity> response) {
                if (response != null && response.body() != null)
                    mGasEstimateMutableLieData.postValue(response.body());
            }
        });
    }
}
