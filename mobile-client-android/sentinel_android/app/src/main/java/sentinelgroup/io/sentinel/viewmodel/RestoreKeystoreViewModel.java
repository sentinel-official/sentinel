package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;
import android.os.Environment;

import sentinelgroup.io.sentinel.repository.RestoreKeystoreRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class RestoreKeystoreViewModel extends ViewModel {
    private final RestoreKeystoreRepository mRepository;
    private final SingleLiveEvent<Resource<String>> mRestoreLiveEvent;

    public RestoreKeystoreViewModel(RestoreKeystoreRepository iRepository) {
        mRepository = iRepository;
        mRestoreLiveEvent = iRepository.getRestoreLiveEvent();
    }

    public LiveData<Resource<String>> getRestoreLiveEvent() {
        return mRestoreLiveEvent;
    }

    public void restoreKeystoreFile(String iPassword, String iKeystorePath) {
        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState())) {
            mRepository.restoreKeystoreFile(iPassword,iKeystorePath, AppPreferences.getInstance().getString(AppConstants.PREF_FILE_PATH));
        } else {
            mRestoreLiveEvent.setValue(Resource.error("Storage not found. Unable to store keystore file.", null));
        }
    }
}