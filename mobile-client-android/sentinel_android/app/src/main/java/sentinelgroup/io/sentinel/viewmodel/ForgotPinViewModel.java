package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;

import org.web3j.crypto.CipherException;
import org.web3j.crypto.WalletUtils;

import java.io.IOException;

import sentinelgroup.io.sentinel.repository.PinRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class ForgotPinViewModel extends ViewModel {
    private final PinRepository mRepository;
    private final AppExecutors mAppExecutors;
    private final SingleLiveEvent<Resource<Boolean>> mIsPasswordCorrectLiveEvent;
    private final SingleLiveEvent<Resource<Boolean>> mIsPinResetLiveEvent;

    ForgotPinViewModel(PinRepository iRepository, AppExecutors iAppExecutors) {
        mRepository = iRepository;
        mAppExecutors = iAppExecutors;
        mIsPasswordCorrectLiveEvent = new SingleLiveEvent<>();
        mIsPinResetLiveEvent = iRepository.getIsPinResetLiveEvent();
    }

    public SingleLiveEvent<Resource<Boolean>> getIsPasswordCorrectLiveEvent() {
        return mIsPasswordCorrectLiveEvent;
    }

    public SingleLiveEvent<Resource<Boolean>> getIsPinResetLiveEvent() {
        return mIsPinResetLiveEvent;
    }

    public void verifyKeystorePassword(String iPassword) {
        mIsPasswordCorrectLiveEvent.postValue(Resource.loading(null));
        String aFilePath = AppPreferences.getInstance().getString(AppConstants.PREFS_FILE_PATH);
        mAppExecutors.diskIO().execute(() -> {
            try {
                WalletUtils.loadCredentials(iPassword, aFilePath);
                mIsPasswordCorrectLiveEvent.postValue(Resource.success(true));
            } catch (IOException | CipherException e) {
                mIsPasswordCorrectLiveEvent.postValue(Resource.error(e.getLocalizedMessage(), null));
            }
        });
    }

    public void resetAppPin(int iNewPin) {
        String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        mRepository.resetAppPin(iNewPin, aAccountAddress);
    }
}
