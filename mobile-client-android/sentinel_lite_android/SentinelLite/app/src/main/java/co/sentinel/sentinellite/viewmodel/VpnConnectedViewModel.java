package co.sentinel.sentinellite.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;

import co.sentinel.sentinellite.network.model.VpnListEntity;
import co.sentinel.sentinellite.repository.VpnRepository;
import co.sentinel.sentinellite.util.AppConstants;
import co.sentinel.sentinellite.util.AppPreferences;

public class VpnConnectedViewModel extends ViewModel {
    private final LiveData<VpnListEntity> mVpnLiveData;

    VpnConnectedViewModel(VpnRepository iRepository) {
        mVpnLiveData = iRepository.getVpnLiveData(AppPreferences.getInstance().getString(AppConstants.PREFS_VPN_ADDRESS));
    }

    public LiveData<VpnListEntity> getVpnLiveData() {
        return mVpnLiveData;
    }
}
