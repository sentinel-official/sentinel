package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;

import sentinelgroup.io.sentinel.repository.PinRepository;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class VerifyPinViewModel extends ViewModel {
    private final PinRepository mRepository;
    private final SingleLiveEvent<Boolean> mIsPinCorrectLiveEvent;

    VerifyPinViewModel(PinRepository iRepository) {
        mRepository = iRepository;
        mIsPinCorrectLiveEvent = mRepository.getIsPinCorrectLiveEvent();
    }

    public SingleLiveEvent<Boolean> getIsPinCorrectLiveEvent() {
        return mIsPinCorrectLiveEvent;
    }

    public void verifyAppPin(int iPin, String iAccountAddress) {
        mRepository.verifyAppPin(iPin, iAccountAddress);
    }
}