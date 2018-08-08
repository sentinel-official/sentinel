package co.sentinel.sentinellite.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;

import co.sentinel.sentinellite.network.model.BonusInfoEntity;
import co.sentinel.sentinellite.network.model.VersionInfo;
import co.sentinel.sentinellite.repository.AppVersionRepository;
import co.sentinel.sentinellite.repository.BonusRepository;
import co.sentinel.sentinellite.util.AppConstants;
import co.sentinel.sentinellite.util.AppPreferences;
import co.sentinel.sentinellite.util.Resource;
import co.sentinel.sentinellite.util.SingleLiveEvent;

public class ReferralViewModel extends ViewModel {
    private final BonusRepository mBonusRepository;
    private final AppVersionRepository mAppVersionRepository;
    private final LiveData<BonusInfoEntity> mBonusInfoLiveData;
    private final SingleLiveEvent<Resource<VersionInfo>> mSncVersionInfoLiveEvent;

    ReferralViewModel(BonusRepository iBonusRepository, AppVersionRepository iAppVersionRepository) {
        mBonusRepository = iBonusRepository;
        mAppVersionRepository = iAppVersionRepository;
        mBonusInfoLiveData = iBonusRepository.getBonusInfoEntityLiveData();
        mSncVersionInfoLiveEvent = iAppVersionRepository.getSncVersionInfoLiveEvent();
    }

    public LiveData<BonusInfoEntity> getBonusInfoLiveData() {
        return mBonusInfoLiveData;
    }

    public SingleLiveEvent<Resource<VersionInfo>> getSncVersionInfoLiveEvent() {
        return mSncVersionInfoLiveEvent;
    }

    public void updateReferralInfo() {
        mBonusRepository.fetchBonusInfo();
    }

    public void fetchSncVersionInfo() {
        mAppVersionRepository.fetchSncVersionInfo();
    }

    public String getReferralId() {
        return AppPreferences.getInstance().getString(AppConstants.PREFS_REF_ID);
    }
}