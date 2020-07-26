package co.sentinel.lite.viewmodel;

import android.arch.lifecycle.ViewModel;

import co.sentinel.lite.network.model.GenericResponse;
import co.sentinel.lite.repository.BonusRepository;
import co.sentinel.lite.util.Resource;
import co.sentinel.lite.util.SingleLiveEvent;

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
