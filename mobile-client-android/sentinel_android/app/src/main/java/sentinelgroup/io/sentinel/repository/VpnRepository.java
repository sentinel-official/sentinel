package sentinelgroup.io.sentinel.repository;

import android.arch.lifecycle.MutableLiveData;
import android.content.res.Resources;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.network.api.WebService;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.Vpn;
import sentinelgroup.io.sentinel.network.model.VpnCredentials;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class VpnRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static VpnRepository sInstance;
    private final WebService mWebService;
    private final MutableLiveData<Resource<Vpn>> mVpnListMutableLiveData;
    private final SingleLiveEvent<Resource<VpnCredentials>> mVpnGetServerCredentials;

    private VpnRepository(WebService iWebService) {
        mWebService = iWebService;
        mVpnListMutableLiveData = new MutableLiveData<>();
        mVpnGetServerCredentials = new SingleLiveEvent<>();
    }

    public static VpnRepository getInstance(WebService iWebService) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new VpnRepository(iWebService);
            }
        }
        return sInstance;
    }

    public MutableLiveData<Resource<Vpn>> getVpnListMutableLiveData() {
        getUnoccupiedVpnList();
        return mVpnListMutableLiveData;
    }

    public SingleLiveEvent<Resource<VpnCredentials>> getVpnGetServerCredentials() {
        return mVpnGetServerCredentials;
    }

    // Network call
    private void getUnoccupiedVpnList() {
        mVpnListMutableLiveData.postValue(Resource.loading(null));
        mWebService.getUnoccupiedVpnList().enqueue(new Callback<Vpn>() {
            @Override
            public void onResponse(Call<Vpn> call, Response<Vpn> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<Vpn> call, Throwable t) {
                reportErrorResponse(t.getLocalizedMessage());
            }

            private void reportSuccessResponse(Response<Vpn> response) {
                if (response != null && response.body() != null) {
                    if (response.body().success)
                        mVpnListMutableLiveData.postValue(Resource.success(response.body()));
                    else
                        reportErrorResponse(Resources.getSystem().getString(R.string.empty_vpn_list));
                }
            }

            private void reportErrorResponse(String iThrowableLocalMessage) {
                if (iThrowableLocalMessage != null)
                    mVpnListMutableLiveData.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mVpnListMutableLiveData.postValue(Resource.error(AppConstants.GENERIC_ERROR, null));
            }
        });
    }

    public void getVpnServerCredentials(GenericRequestBody iRequestBody) {
        mVpnGetServerCredentials.postValue(Resource.loading(null));
        mWebService.getVpnServerCredentials(iRequestBody).enqueue(new Callback<VpnCredentials>() {
            @Override
            public void onResponse(Call<VpnCredentials> call, Response<VpnCredentials> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<VpnCredentials> call, Throwable t) {
                reportErrorResponse(null, t.getLocalizedMessage());
            }

            private void reportSuccessResponse(Response<VpnCredentials> response) {
                if (response != null && response.body() != null) {
                    if (response.body().success)
                        mVpnGetServerCredentials.postValue(Resource.success(response.body()));
                    else
                        reportErrorResponse(response, null);
                } else {
                    reportErrorResponse(null,null);
                }
            }

            private void reportErrorResponse(Response<VpnCredentials> response, String iThrowableLocalMessage) {
                if (response != null && response.body() != null) {
                    mVpnGetServerCredentials.postValue(Resource.error(response.body().message, null));
                } else if (iThrowableLocalMessage != null)
                    mVpnGetServerCredentials.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mVpnGetServerCredentials.postValue(Resource.error(AppConstants.GENERIC_ERROR, null));
            }
        });
    }
}
