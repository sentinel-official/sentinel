package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;

import sentinelgroup.io.sentinel.network.model.GenericResponse;
import sentinelgroup.io.sentinel.network.model.VersionInfo;
import sentinelgroup.io.sentinel.repository.AppVersionRepository;
import sentinelgroup.io.sentinel.repository.BonusRepository;
import sentinelgroup.io.sentinel.repository.CreateAuidRepository;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class SplashViewModel extends ViewModel {
    private final BonusRepository mBonusRepository;
    private final AppVersionRepository mRepository;
    private final CreateAuidRepository mCreateAuidRepository;
    private final SingleLiveEvent<Resource<GenericResponse>> mAccountInfoLiveEvent;
    private final SingleLiveEvent<Resource<VersionInfo>> mVersionInfoLiveEvent;

    SplashViewModel(BonusRepository iBonusRepository, AppVersionRepository iAppVersionRepository, CreateAuidRepository iCreateAuidRepository) {
        mBonusRepository = iBonusRepository;
        mRepository = iAppVersionRepository;
        mCreateAuidRepository = iCreateAuidRepository;
        mAccountInfoLiveEvent = iBonusRepository.getAccountInfoLiveEvent();
        mVersionInfoLiveEvent = iAppVersionRepository.getVersionInfoLiveEvent();
    }

    /*
     * Getters
     */
    public SingleLiveEvent<Resource<GenericResponse>> getAccountInfoLiveEvent() {
        fetchAccountInfo();
        return mAccountInfoLiveEvent;
    }

    public SingleLiveEvent<Resource<VersionInfo>> getVersionInfoLiveEvent() {
        return mVersionInfoLiveEvent;
    }

    public void fetchAccountInfo() {
        mBonusRepository.fetchAccountInfo();
    }

    public void fetchSncVersionInfo() {
        mRepository.getVersionInfo();
    }

    public void clearUserSession() {
        mCreateAuidRepository.clearUserSession();
    }
}