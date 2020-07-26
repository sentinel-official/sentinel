package co.sentinel.lite.viewmodel;

import android.arch.lifecycle.ViewModel;

import co.sentinel.lite.network.model.VpnUsage;
import co.sentinel.lite.repository.VpnRepository;
import co.sentinel.lite.util.Resource;
import co.sentinel.lite.util.SingleLiveEvent;

public class VpnUsageViewModel extends ViewModel {
    private final VpnRepository mRepository;
    private final SingleLiveEvent<Resource<VpnUsage>> mVpnUsageLiveEvent;

    VpnUsageViewModel(VpnRepository iRepository) {
        mRepository = iRepository;
        mVpnUsageLiveEvent = iRepository.getVpnUsageLiveEvent();
    }

    public SingleLiveEvent<Resource<VpnUsage>> getVpnUsageLiveEvent() {
        return mVpnUsageLiveEvent;
    }

    public void reloadVpnUsage() {
        mRepository.getVpnUsageForUser();
    }
}
