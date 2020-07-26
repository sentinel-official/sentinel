package co.sentinel.lite.viewmodel;

import android.arch.lifecycle.ViewModel;

import co.sentinel.lite.network.model.GenericResponse;
import co.sentinel.lite.network.model.VersionInfo;
import co.sentinel.lite.repository.AppVersionRepository;
import co.sentinel.lite.repository.BonusRepository;
import co.sentinel.lite.util.Resource;
import co.sentinel.lite.util.SingleLiveEvent;

public class SplashViewModel extends ViewModel {
    private final BonusRepository mBonusRepository;
    private final AppVersionRepository mAppVersionRepository;
    private final SingleLiveEvent<Resource<GenericResponse>> mAccountInfoByDeviceIdLiveEvent;
    private final SingleLiveEvent<Resource<VersionInfo>> mSlcVersionInfoLiveEvent;

    SplashViewModel(BonusRepository iBonusRepository, AppVersionRepository iAppVersionRepository) {
        mBonusRepository = iBonusRepository;
        mAppVersionRepository = iAppVersionRepository;
        mAccountInfoByDeviceIdLiveEvent = iBonusRepository.getAccountInfoByDeviceIdLiveEvent();
        mSlcVersionInfoLiveEvent = iAppVersionRepository.getSlcVersionInfoLiveEvent();
    }

    /*
     * Getters
     */
    public SingleLiveEvent<Resource<GenericResponse>> getAccountInfoByDeviceIdLiveEvent() {
        fetchAccountInfo();
        return mAccountInfoByDeviceIdLiveEvent;
    }

    public SingleLiveEvent<Resource<VersionInfo>> getSlcVersionInfoLiveEvent() {
        return mSlcVersionInfoLiveEvent;
    }

    public void fetchAccountInfo() {
        mBonusRepository.fetchAccountInfoByDeviceId();
    }

    public void fetchSlcVersionInfo() {
        mAppVersionRepository.fetchSlcVersionInfo();
    }

}