package co.sentinel.sentinellite.viewmodel;

import android.arch.lifecycle.ViewModel;

import co.sentinel.sentinellite.network.model.GenericResponse;
import co.sentinel.sentinellite.repository.BonusRepository;
import co.sentinel.sentinellite.util.Resource;
import co.sentinel.sentinellite.util.SingleLiveEvent;

public class DeviceRegisterViewModel extends ViewModel {
    private final BonusRepository mBonusRepository;
    private final SingleLiveEvent<Resource<GenericResponse>> mAccountInfoByDeviceIdLiveEvent;
    private final SingleLiveEvent<Resource<GenericResponse>> mRegisterDeviceIdLiveEvent;

    DeviceRegisterViewModel(BonusRepository iBonusRepository) {
        mBonusRepository = iBonusRepository;
        mAccountInfoByDeviceIdLiveEvent = iBonusRepository.getAccountInfoByDeviceIdLiveEvent();
        mRegisterDeviceIdLiveEvent = mBonusRepository.getRegisterDeviceIdLiveEvent();
    }

    /*
     * Getters
     */
    public SingleLiveEvent<Resource<GenericResponse>> getAccountInfoByDeviceIdLiveEvent() {
        return mAccountInfoByDeviceIdLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getRegisterDeviceIdLiveEvent() {
        return mRegisterDeviceIdLiveEvent;
    }

    public void registerDeviceId(String iReferralCode) {
        mBonusRepository.registerDeviceId(iReferralCode);
    }

    public void fetchAccountInfo() {
        mBonusRepository.fetchAccountInfoByDeviceId();
    }
}
