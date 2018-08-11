package co.sentinel.sentinellite.viewmodel;

import android.arch.lifecycle.ViewModel;

import co.sentinel.sentinellite.network.model.GenericResponse;
import co.sentinel.sentinellite.repository.BonusRepository;
import co.sentinel.sentinellite.util.Resource;
import co.sentinel.sentinellite.util.SingleLiveEvent;

public class DeviceRegisterViewModel extends ViewModel {
    private final BonusRepository mBonusRepository;
    private final SingleLiveEvent<Resource<GenericResponse>> mAccountInfoLiveEvent;
    private final SingleLiveEvent<Resource<GenericResponse>> mRegisterDeviceIdLiveEvent;

    DeviceRegisterViewModel(BonusRepository iBonusRepository) {
        mBonusRepository = iBonusRepository;
        mAccountInfoLiveEvent = iBonusRepository.getAccountInfoLiveEvent();
        mRegisterDeviceIdLiveEvent = mBonusRepository.getRegisterDeviceIdLiveEvent();
    }

    /*
     * Getters
     */
    public SingleLiveEvent<Resource<GenericResponse>> getAccountInfoLiveEvent() {
        return mAccountInfoLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getRegisterDeviceIdLiveEvent() {
        return mRegisterDeviceIdLiveEvent;
    }

    public void registerDeviceId(String iReferralCode) {
        mBonusRepository.registerDeviceId(iReferralCode);
    }

    public void fetchAccountInfo() {
        mBonusRepository.fetchAccountInfo();
    }
}
