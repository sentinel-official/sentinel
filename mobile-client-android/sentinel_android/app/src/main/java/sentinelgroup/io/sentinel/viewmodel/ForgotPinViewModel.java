package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;

import sentinelgroup.io.sentinel.repository.PinRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class ForgotPinViewModel extends ViewModel {
    private final PinRepository mRepository;
    private final SingleLiveEvent<Resource<Boolean>> mIsPasswordCorrectLiveEvent;
    private final SingleLiveEvent<Boolean> mIsPinResetLiveEvent;

    ForgotPinViewModel(PinRepository iRepository) {
        mRepository = iRepository;
        mIsPasswordCorrectLiveEvent = iRepository.getIsPasswordCorrectLiveEvent();
        mIsPinResetLiveEvent = iRepository.getIsPinResetLiveEvent();
    }

    public SingleLiveEvent<Resource<Boolean>> getIsPasswordCorrectLiveEvent() {
        return mIsPasswordCorrectLiveEvent;
    }

    public SingleLiveEvent<Boolean> getIsPinResetLiveEvent() {
        return mIsPinResetLiveEvent;
    }

    public void verifyKeystorePassword(String iPassword) {
        String aFilePath = AppPreferences.getInstance().getString(AppConstants.PREFS_FILE_PATH);
        mRepository.verifyKeystorePassword(iPassword, aFilePath);
    }

    public void resetAppPin(int iNewPin) {
        String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        mRepository.resetAppPin(iNewPin, aAccountAddress);
    }
}
