package co.sentinel.sentinellite.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;

import co.sentinel.sentinellite.network.model.VpnListEntity;
import co.sentinel.sentinellite.repository.VpnRepository;
import co.sentinel.sentinellite.util.AppConstants;
import co.sentinel.sentinellite.util.AppPreferences;

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
