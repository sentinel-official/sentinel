package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;
import android.os.Environment;

import org.web3j.crypto.CipherException;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.WalletUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.channels.FileChannel;

import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.GenericResponse;
import sentinelgroup.io.sentinel.repository.BonusRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class RestoreKeystoreViewModel extends ViewModel {
    private final AppExecutors mAppExecutors;
    private final BonusRepository mBonusRepository;
    private final SingleLiveEvent<Resource<String>> mRestoreLiveEvent;
    private final SingleLiveEvent<Resource<GenericResponse>> mAddAccountLiveEvent;
    private final SingleLiveEvent<Resource<GenericResponse>> mUpdateAccountLiveEvent;
    private final SingleLiveEvent<Resource<GenericResponse>> mAccountInfoLiveEvent;
    private final String mDeviceId;

    RestoreKeystoreViewModel(AppExecutors iAppExecutors, BonusRepository iBonusRepository, String iDeviceId) {
        mAppExecutors = iAppExecutors;
        mBonusRepository = iBonusRepository;
        mRestoreLiveEvent = new SingleLiveEvent<>();
        mAddAccountLiveEvent = iBonusRepository.getAddAccountLiveEvent();
        mUpdateAccountLiveEvent = iBonusRepository.getUpdateAccountLiveEvent();
        mAccountInfoLiveEvent = iBonusRepository.getAccountInfoLiveEvent();
        mDeviceId = iDeviceId;
    }

    /**
     * Public Getters
     */

    public SingleLiveEvent<Resource<GenericResponse>> getAccountInfoLiveEvent() {
        return mAccountInfoLiveEvent;
    }

    public LiveData<Resource<String>> getRestoreLiveEvent() {
        return mRestoreLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getAddAccountLiveEvent() {
        return mAddAccountLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getUpdateAccountLiveEvent() {
        return mUpdateAccountLiveEvent;
    }

    public void fetchAccountInfo() {
        mBonusRepository.fetchAccountInfo();
    }

    public void restoreKeystoreFile(String iPassword, String iKeystorePath) {
        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState())) {
            restoreKeystoreFile(iPassword, iKeystorePath, AppPreferences.getInstance().getString(AppConstants.PREFS_FILE_PATH));
        } else {
            mRestoreLiveEvent.postValue(Resource.error("Storage not found. Unable to store keystore file.", null));
        }
    }

    private void restoreKeystoreFile(String iPassword, String iKeystorePath, String iFilePath) {
        mRestoreLiveEvent.postValue(Resource.loading(null));
        mAppExecutors.diskIO().execute(() -> {
            File aSrcFile = new File(iKeystorePath);
            // Create Keystore File
            File aDstFile = new File(iFilePath);
            // Copy Keystore File
            try {
                if (!aDstFile.exists())
                    aDstFile.createNewFile();
                FileChannel aSourceChannel = new FileInputStream(aSrcFile).getChannel();
                FileChannel aDestinationChannel = new FileOutputStream(aDstFile).getChannel();
                aDestinationChannel.transferFrom(aSourceChannel, 0, aSourceChannel.size());
                aSourceChannel.close();
                aDestinationChannel.close();
                Credentials aCredentials = WalletUtils.loadCredentials(iPassword, iKeystorePath);
                String aAccountAddress = aCredentials.getAddress();
                AppPreferences.getInstance().saveString(AppConstants.PREFS_ACCOUNT_ADDRESS, aAccountAddress);
                mRestoreLiveEvent.postValue(Resource.success(aAccountAddress));
            } catch (IOException | CipherException e) {
                mRestoreLiveEvent.postValue(Resource.error(e.getLocalizedMessage(), null));
            }
        });
    }

    public void addAccountInfo(String iAccountAddress, String iReferredBy) {
        GenericRequestBody aBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .deviceIdReferral(mDeviceId)
                .address(iAccountAddress)
                .referredBy(iReferredBy)
                .build();
        mBonusRepository.addAccountInfo(aBody);
    }

    public void updateAccountInfo(String iAccountAddress) {
        GenericRequestBody aBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .deviceIdReferral(mDeviceId)
                .address(iAccountAddress)
                .build();
        mBonusRepository.updateAccount(aBody);
    }

}