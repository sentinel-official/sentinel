package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;

import sentinelgroup.io.sentinel.network.model.VersionInfo;
import sentinelgroup.io.sentinel.repository.AppVersionRepository;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class SplashViewModel extends ViewModel {
    private final AppVersionRepository mRepository;
    private final SingleLiveEvent<Resource<VersionInfo>> mVersionInfoLiveEvent;

    SplashViewModel(AppVersionRepository iRepository) {
        mRepository = iRepository;
        mVersionInfoLiveEvent = iRepository.getVersionInfoLiveEvent();
    }

    /*
     * Getters
     */
    public SingleLiveEvent<Resource<VersionInfo>> getVersionInfoLiveEvent() {
        return mVersionInfoLiveEvent;
    }

    public void reload() {
        mRepository.getVersionInfo();
    }
}