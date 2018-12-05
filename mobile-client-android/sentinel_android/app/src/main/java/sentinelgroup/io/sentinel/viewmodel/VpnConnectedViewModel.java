package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;

import sentinelgroup.io.sentinel.network.model.VpnListEntity;
import sentinelgroup.io.sentinel.repository.VpnRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

public class VpnConnectedViewModel extends ViewModel {
    private final LiveData<VpnListEntity> mVpnLiveData;

    VpnConnectedViewModel(VpnRepository iRepository) {
        mVpnLiveData = iRepository.getVpnLiveDataByVpnAddress(AppPreferences.getInstance().getString(AppConstants.PREFS_VPN_ADDRESS));
    }

    public LiveData<VpnListEntity> getVpnLiveData() {
        return mVpnLiveData;
    }
}
