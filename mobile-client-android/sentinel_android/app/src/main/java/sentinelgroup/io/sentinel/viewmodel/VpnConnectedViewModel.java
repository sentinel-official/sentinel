package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;

import sentinelgroup.io.sentinel.network.model.VpnListEntity;
import sentinelgroup.io.sentinel.repository.VpnRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

public class VpnConnectedViewModel extends ViewModel {
    private final LiveData<VpnListEntity> mVpnLiveData;
    private VpnRepository mRepository;

    VpnConnectedViewModel(VpnRepository iRepository) {
        mRepository = iRepository;
        mVpnLiveData = iRepository.getVpnLiveDataByVpnAddress(AppPreferences.getInstance().getString(AppConstants.PREFS_VPN_ADDRESS));
    }

    public LiveData<VpnListEntity> getVpnLiveData() {
        return mVpnLiveData;
    }

    public void toggleVpnBookmark(String iAccountAddress, String iIP) {
        mRepository.toggleVpnBookmark(iAccountAddress, iIP);
        if (mVpnLiveData.getValue() != null)
            mVpnLiveData.getValue().setBookmarked(!mVpnLiveData.getValue().isBookmarked());
    }
}
