package sentinelgroup.io.sentinel.repository;

import android.content.res.Resources;

import com.google.gson.Gson;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.network.api.WebService;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.PayError;
import sentinelgroup.io.sentinel.network.model.PayResponse;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class SendRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static SendRepository sInstance;
    private final WebService mWebService;
    private final SingleLiveEvent<Resource<PayResponse>> mTransactionLiveEvent;

    private SendRepository(WebService iWebService) {
        mWebService = iWebService;
        mTransactionLiveEvent = new SingleLiveEvent<>();
    }

    public static SendRepository getInstance(WebService iWebService) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new SendRepository(iWebService);
            }
        }
        return sInstance;
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
                    mTransactionLiveEvent.postValue(Resource.error(Resources.getSystem().getString(R.string.generic_error_message), null));
            }
        });
    }
}
