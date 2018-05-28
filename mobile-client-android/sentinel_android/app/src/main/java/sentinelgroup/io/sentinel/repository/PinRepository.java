package sentinelgroup.io.sentinel.repository;

import org.web3j.crypto.CipherException;
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
    private final SingleLiveEvent<Resource<Boolean>> mIsPinSetLiveEvent;
    private final SingleLiveEvent<Resource<Boolean>> mIsPinResetLiveEvent;
    private final SingleLiveEvent<Boolean> mIsPinCorrectLiveEvent;

    private PinRepository(PinEntryDao iDao, AppExecutors iAppExecutors) {
        mDao = iDao;
        mAppExecutors = iAppExecutors;
        mIsPinSetLiveEvent = new SingleLiveEvent<>();
        mIsPinResetLiveEvent = new SingleLiveEvent<>();
        mIsPinCorrectLiveEvent = new SingleLiveEvent<>();
    }

    public static PinRepository getInstance(PinEntryDao iDao, AppExecutors iAppExecutors) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new PinRepository(iDao, iAppExecutors);
            }
        }
        return sInstance;
    }

    public SingleLiveEvent<Resource<Boolean>> getIsPinSetLiveEvent() {
        return mIsPinSetLiveEvent;
    }

    public SingleLiveEvent<Boolean> getIsPinCorrectLiveEvent() {
        return mIsPinCorrectLiveEvent;
    }

    public SingleLiveEvent<Resource<Boolean>> getIsPinResetLiveEvent() {
        return mIsPinResetLiveEvent;
    }

    public void setAppPin(PinEntity iEntity) {
        mIsPinSetLiveEvent.postValue(Resource.loading(null));
        mAppExecutors.diskIO().execute(() -> {
            long aInsertedId = mDao.insertPinEntity(iEntity);
            mIsPinSetLiveEvent.postValue(Resource.success(aInsertedId > 0));
        });
    }

    public void verifyAppPin(int iPin, String iAccountAddress) {
        mAppExecutors.diskIO().execute(() -> {
            int iEntries = mDao.getPinEntity(iPin, iAccountAddress);
            mIsPinCorrectLiveEvent.postValue(iEntries == 1);
        });
    }

    public void resetAppPin(int iOldPin, int iNewPin, String iAccountAddress) {
        mIsPinResetLiveEvent.postValue(Resource.loading(null));
        mAppExecutors.diskIO().execute(() -> {
            int iNumberOfRows = mDao.updatePin(iOldPin, iNewPin, iAccountAddress);
            mIsPinResetLiveEvent.postValue((Resource.success(iNumberOfRows == 1)));
        });
    }

    public void resetAppPin(int iNewPin, String iAccountAddress) {
        mIsPinResetLiveEvent.postValue(Resource.loading(null));
        mAppExecutors.diskIO().execute(() -> {
            int iNumberOfRows = mDao.updatePin(iNewPin, iAccountAddress);
            mIsPinResetLiveEvent.postValue((Resource.success(iNumberOfRows == 1)));
        });
    }
}
