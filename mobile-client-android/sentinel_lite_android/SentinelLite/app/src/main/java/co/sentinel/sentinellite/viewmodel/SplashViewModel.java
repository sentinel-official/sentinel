package co.sentinel.sentinellite.viewmodel;

import android.arch.lifecycle.ViewModel;

import co.sentinel.sentinellite.network.model.GenericResponse;
import co.sentinel.sentinellite.network.model.VersionInfo;
import co.sentinel.sentinellite.repository.AppVersionRepository;
import co.sentinel.sentinellite.repository.BonusRepository;
import co.sentinel.sentinellite.util.Resource;
import co.sentinel.sentinellite.util.SingleLiveEvent;

public class SplashViewModel extends ViewModel {
    private final BonusRepository mBonusRepository;
    private final AppVersionRepository mAppVersionRepository;
    private final SingleLiveEvent<Resource<GenericResponse>> mAccountInfoLiveEvent;
    private final SingleLiveEvent<Resource<VersionInfo>> mSlcVersionInfoLiveEvent;

    SplashViewModel(BonusRepository iBonusRepository, AppVersionRepository iAppVersionRepository) {
        mBonusRepository = iBonusRepository;
        mAppVersionRepository = iAppVersionRepository;
        mAccountInfoLiveEvent = iBonusRepository.getAccountInfoLiveEvent();
        mSlcVersionInfoLiveEvent = iAppVersionRepository.getSlcVersionInfoLiveEvent();
    }

    /*
     * Getters
     */
    public SingleLiveEvent<Resource<GenericResponse>> getAccountInfoLiveEvent() {
        return mAccountInfoLiveEvent;
    }

    public SingleLiveEvent<Resource<VersionInfo>> getSlcVersionInfoLiveEvent() {
        return mSlcVersionInfoLiveEvent;
    }

    public void reload() {
        mBonusRepository.getAccountDetails();
    }

    public void fetchSlcVersionInfo() {
        mAppVersionRepository.fetchSlcVersionInfo();
    }

}