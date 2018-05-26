package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.os.Environment;

import sentinelgroup.io.sentinel.network.model.Account;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.repository.CreateAuidRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;


public class CreateAuidViewModel extends ViewModel {
    private final CreateAuidRepository mRepository;
    private final SingleLiveEvent<Resource<Account>> mAccountLiveEvent;
    private final SingleLiveEvent<Resource<Account>> mKeystoreFileLiveEvent;

    CreateAuidViewModel(CreateAuidRepository iRepository) {
        mRepository = iRepository;
        mAccountLiveEvent = iRepository.getAccountLiveEvent();
        mKeystoreFileLiveEvent = iRepository.getKeystoreFileLiveEvent();
    }

    public SingleLiveEvent<Resource<Account>> getAccountLiveEvent() {
        return mAccountLiveEvent;
    }

    public SingleLiveEvent<Resource<Account>> getKeystoreFileLiveEvent() {
        return mKeystoreFileLiveEvent;
    }

    public void createNewAccount(String iPassword) {
        GenericRequestBody aBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .password(iPassword).build();
        mRepository.createNewAccount(aBody);
    }

    public void saveAccount(Account iData) {
        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState())) {
            mRepository.saveKeystoreFile(iData, AppPreferences.getInstance().getString(AppConstants.PREFS_FILE_PATH));
        } else {
            mKeystoreFileLiveEvent.setValue(Resource.error("Storage not found. Unable to store keystore file.", null));
        }
    }
}