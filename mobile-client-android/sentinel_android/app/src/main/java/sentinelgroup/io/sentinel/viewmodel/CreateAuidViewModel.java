package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.os.Environment;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

import sentinelgroup.io.sentinel.network.model.Account;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.GenericResponse;
import sentinelgroup.io.sentinel.repository.BonusRepository;
import sentinelgroup.io.sentinel.repository.CreateAuidRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;


public class CreateAuidViewModel extends ViewModel {
    private final CreateAuidRepository mRepository;
    private final AppExecutors mAppExecutors;
    private final BonusRepository mBonusRepository;
    private final SingleLiveEvent<Resource<Account>> mAccountLiveEvent;
    private final SingleLiveEvent<Resource<Account>> mKeystoreFileLiveEvent;
    private final SingleLiveEvent<Boolean> mSessionClearedLiveEvent;
    private final SingleLiveEvent<Resource<GenericResponse>> mAddAccountLiveEvent;
    private final SingleLiveEvent<Resource<GenericResponse>> mUpdateAccountLiveEvent;
    private final String mDeviceId;

    CreateAuidViewModel(CreateAuidRepository iRepository, AppExecutors iAppExecutors, BonusRepository iBonusRepository, String iDeviceId) {
        mRepository = iRepository;
        mAppExecutors = iAppExecutors;
        mBonusRepository = iBonusRepository;
        mAccountLiveEvent = iRepository.getAccountLiveEvent();
        mUpdateAccountLiveEvent = iBonusRepository.getUpdateAccountLiveEvent();
        mSessionClearedLiveEvent = iRepository.getSessionClearedLiveEvent();
        mKeystoreFileLiveEvent = new SingleLiveEvent<>();
        mDeviceId = iDeviceId;
        mAddAccountLiveEvent = iBonusRepository.getAddAccountLiveEvent();
    }

    /*
     * Getters
     */
    public SingleLiveEvent<Resource<Account>> getAccountLiveEvent() {
        return mAccountLiveEvent;
    }

    public SingleLiveEvent<Resource<Account>> getKeystoreFileLiveEvent() {
        return mKeystoreFileLiveEvent;
    }

    public SingleLiveEvent<Boolean> getSessionClearedLiveEvent() {
        return mSessionClearedLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getAddAccountLiveEvent() {
        return mAddAccountLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getUpdateAccountLiveEvent() {
        return mUpdateAccountLiveEvent;
    }

    /*
     * Other functions
     */
    public void createNewAccount(String iPassword) {
        GenericRequestBody aBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .password(iPassword)
                .build();
        mRepository.createNewAccount(aBody);
    }

    public void addAccountInfo(String iAccountAddress, String iReferredBy) {
        GenericRequestBody aBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .deviceIdMain(mDeviceId)
                .address(iAccountAddress)
                .referredBy(iReferredBy)
                .build();
        mBonusRepository.addAccountInfo(aBody);
    }

    public void updateAccountInfo(String iAccountAddress) {
        GenericRequestBody aBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .deviceIdMain(mDeviceId)
                .address(iAccountAddress)
                .build();
        mBonusRepository.updateAccount(aBody);
    }

    public void saveAccount(Account iData) {
        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState())) {
            saveKeystoreFile(iData, AppPreferences.getInstance().getString(AppConstants.PREFS_FILE_PATH));
        } else {
            mKeystoreFileLiveEvent.postValue(Resource.error(AppConstants.STORAGE_ERROR, null));
        }
    }

    private void saveKeystoreFile(Account iData, String iFilePath) {
        mAppExecutors.diskIO().execute(() -> {
            // Create folder
            File aFolder = new File(Environment.getExternalStorageDirectory(), AppConstants.FOLDER_NAME);
            if (!aFolder.exists())
                aFolder.mkdir();
            // Create Keystore File
            File aFile = new File(aFolder, AppConstants.FILE_NAME);
            File aInternalFile = new File(iFilePath);
            // Write to the Keystore File
            try {
                if (!aFile.exists())
                    aFile.createNewFile();
                if (!aInternalFile.exists())
                    aInternalFile.createNewFile();
                FileOutputStream aFileStream = new FileOutputStream(aFile);
                FileOutputStream aInternalFileStream = new FileOutputStream(aInternalFile);
                OutputStreamWriter aFileWriter = new OutputStreamWriter(aFileStream);
                OutputStreamWriter aInternalFileWriter = new OutputStreamWriter(aInternalFileStream);
                aFileWriter.append(iData.keystoreString);
                aInternalFileWriter.append(iData.keystoreString);
                aFileWriter.close();
                aInternalFileWriter.close();
                aFileStream.close();
                aInternalFileStream.close();

                iData.keystoreFilePath = aFile.getAbsolutePath();
                mKeystoreFileLiveEvent.postValue(Resource.success(iData));
            } catch (IOException e) {
                mKeystoreFileLiveEvent.postValue(Resource.error(e.getLocalizedMessage(), null));
            }
        });
    }
}