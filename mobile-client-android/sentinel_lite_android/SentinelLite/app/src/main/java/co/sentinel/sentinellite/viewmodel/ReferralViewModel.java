package co.sentinel.sentinellite.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;

import co.sentinel.sentinellite.network.model.BonusInfoEntity;
import co.sentinel.sentinellite.network.model.GenericRequestBody;
import co.sentinel.sentinellite.network.model.GenericResponse;
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
    private final SingleLiveEvent<Resource<GenericResponse>> mAccountInfoByAddressLiveEvent;
    private final SingleLiveEvent<Resource<GenericResponse>> mLinkAccountLiveEvent;

    ReferralViewModel(BonusRepository iBonusRepository, AppVersionRepository iAppVersionRepository) {
        mBonusRepository = iBonusRepository;
        mAppVersionRepository = iAppVersionRepository;
        mBonusInfoLiveData = iBonusRepository.getBonusInfoEntityLiveData();
        mSncVersionInfoLiveEvent = iAppVersionRepository.getSncVersionInfoLiveEvent();
        mAccountInfoByAddressLiveEvent = iBonusRepository.getAccountInfoByAddressLiveEvent();
        mLinkAccountLiveEvent = iBonusRepository.getLinkAccountLiveEvent();
    }

    public LiveData<BonusInfoEntity> getBonusInfoLiveData() {
        return mBonusInfoLiveData;
    }

    public SingleLiveEvent<Resource<VersionInfo>> getSncVersionInfoLiveEvent() {
        return mSncVersionInfoLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getAccountInfoByAddressLiveEvent() {
        return mAccountInfoByAddressLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getLinkAccountLiveEvent() {
        return mLinkAccountLiveEvent;
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

    public void getAccountInfoByAddress(String iAddress) {
        mBonusRepository.fetchAccountInfoByAddress(iAddress);
    }

    public void linkSncSlcAccounts(String iSncRefId, String iSlcRefId, String iSncAddress, String iSlcDeviceId) {
        GenericRequestBody iRequestBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .address(iSncAddress)
                .deviceIdReferral(iSlcDeviceId)
                .build();
        mBonusRepository.linkSncSlcAccounts(iSncRefId, iSlcRefId, iRequestBody);
    }
}