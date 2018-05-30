package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;

import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.Vpn;
import sentinelgroup.io.sentinel.network.model.VpnCredentials;
import sentinelgroup.io.sentinel.repository.VpnRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class VpnListViewModel extends ViewModel {
    private final VpnRepository mRepository;
    private final LiveData<Resource<Vpn>> mVpnListLiveData;
    private final SingleLiveEvent<Resource<VpnCredentials>> mVpnGetServerCredentialsLiveEvent;

    VpnListViewModel(VpnRepository iRepository) {
        mRepository = iRepository;
        mVpnListLiveData = iRepository.getVpnListMutableLiveData();
        mVpnGetServerCredentialsLiveEvent = iRepository.getVpnGetServerCredentialsLiveEvent();
    }

    public LiveData<Resource<Vpn>> getVpnListLiveData() {
        return mVpnListLiveData;
    }

    public SingleLiveEvent<Resource<VpnCredentials>> getVpnGetServerCredentials() {
        return mVpnGetServerCredentialsLiveEvent;
    }

    public void getVpnServerCredentials(String iVPnAddress) {
        String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        GenericRequestBody aBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .accountAddress(aAccountAddress)
                .vpnAddress(iVPnAddress)
                .build();
        mRepository.getVpnServerCredentials(aBody);
    }
}
