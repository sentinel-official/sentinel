package sentinelgroup.io.sentinel.repository;

import org.web3j.crypto.CipherException;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.WalletUtils;

import java.io.IOException;

import sentinelgroup.io.sentinel.db.PinEntity;
import sentinelgroup.io.sentinel.db.PinEntryDao;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class PinRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static PinRepository sInstance;
    private final PinEntryDao mDao;
    private final AppExecutors mAppExecutors;
    private final SingleLiveEvent<Boolean> mIsPinSetLiveEvent;
    private final SingleLiveEvent<Boolean> mIsPinResetLiveEvent;
    private final SingleLiveEvent<Boolean> mIsPinCorrectLiveEvent;
    private final SingleLiveEvent<Resource<Boolean>> mIsPasswordCorrectLiveEvent;

    private PinRepository(PinEntryDao iDao, AppExecutors iAppExecutors) {
        mDao = iDao;
        mAppExecutors = iAppExecutors;
        mIsPinSetLiveEvent = new SingleLiveEvent<>();
        mIsPinResetLiveEvent = new SingleLiveEvent<>();
        mIsPinCorrectLiveEvent = new SingleLiveEvent<>();
        mIsPasswordCorrectLiveEvent = new SingleLiveEvent<>();
    }

    public static PinRepository getInstance(PinEntryDao iDao, AppExecutors iAppExecutors) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new PinRepository(iDao, iAppExecutors);
            }
        }
        return sInstance;
    }

    public SingleLiveEvent<Boolean> getIsPinSetLiveEvent() {
        return mIsPinSetLiveEvent;
    }

    public SingleLiveEvent<Boolean> getIsPinCorrectLiveEvent() {
        return mIsPinCorrectLiveEvent;
    }

    public SingleLiveEvent<Boolean> getIsPinResetLiveEvent() {
        return mIsPinResetLiveEvent;
    }

    public SingleLiveEvent<Resource<Boolean>> getIsPasswordCorrectLiveEvent() {
        return mIsPasswordCorrectLiveEvent;
    }

    public void setAppPin(PinEntity iEntity) {
        mAppExecutors.diskIO().execute(() -> {
            long aInsertedId = mDao.insertPinEntity(iEntity);
            mIsPinSetLiveEvent.postValue(aInsertedId > 0L);
        });
    }

    public void verifyAppPin(int iPin, String iAccountAddress) {
        mAppExecutors.diskIO().execute(() -> {
            int iEntries = mDao.getPinEntity(iPin, iAccountAddress);
            mIsPinCorrectLiveEvent.postValue(iEntries == 1);
        });
    }

    public void resetAppPin(int iOldPin, int iNewPin, String iAccountAddress) {
        mAppExecutors.diskIO().execute(() -> {
            int iNumberOfRows = mDao.updatePin(iOldPin, iNewPin, iAccountAddress);
            mIsPinResetLiveEvent.postValue(iNumberOfRows == 1);
        });
    }

    public void resetAppPin(int iNewPin, String iAccountAddress) {
        mAppExecutors.diskIO().execute(() -> {
            int iNumberOfRows = mDao.updatePin(iNewPin, iAccountAddress);
            mIsPinResetLiveEvent.postValue(iNumberOfRows == 1);
        });
    }

    public void verifyKeystorePassword(String iPassword, String iFilePath) {
        mIsPasswordCorrectLiveEvent.postValue(Resource.loading(null));
        mAppExecutors.diskIO().execute(() -> {
            try {
                WalletUtils.loadCredentials(iPassword, iFilePath);
                mIsPasswordCorrectLiveEvent.postValue(Resource.success(true));
            } catch (IOException | CipherException e) {
                mIsPasswordCorrectLiveEvent.postValue(Resource.error(e.getLocalizedMessage(), null));
            }
        });
    }
}
