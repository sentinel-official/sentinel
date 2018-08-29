package co.sentinel.sentinellite.viewmodel;

import android.arch.lifecycle.ViewModel;

import co.sentinel.sentinellite.network.model.VpnUsage;
import co.sentinel.sentinellite.repository.VpnRepository;
import co.sentinel.sentinellite.util.Resource;
import co.sentinel.sentinellite.util.SingleLiveEvent;

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
