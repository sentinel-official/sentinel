package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;

import sentinelgroup.io.sentinel.repository.PinRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class ResetPinViewModel extends ViewModel {
    private final PinRepository mRepository;
    private final SingleLiveEvent<Boolean> mIsPinCorrectLiveEvent;
    private final SingleLiveEvent<Boolean> mIsPinResetLiveEvent;

    ResetPinViewModel(PinRepository iRepository) {
        mRepository = iRepository;
        mIsPinCorrectLiveEvent = iRepository.getIsPinCorrectLiveEvent();
        mIsPinResetLiveEvent = iRepository.getIsPinResetLiveEvent();
    }

    public SingleLiveEvent<Boolean> getIsPinCorrectLiveEvent() {
        return mIsPinCorrectLiveEvent;
    }

    public SingleLiveEvent<Boolean> getIsPinResetLiveEvent() {
        return mIsPinResetLiveEvent;
    }

    public void verifyOldPin(int iOldPin) {
        String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        mRepository.verifyAppPin(iOldPin, aAccountAddress);
    }

    public void resetAppPin(int iOldPin, int iNewPin) {
        String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        mRepository.resetAppPin(iOldPin, iNewPin, aAccountAddress);
    }
}
