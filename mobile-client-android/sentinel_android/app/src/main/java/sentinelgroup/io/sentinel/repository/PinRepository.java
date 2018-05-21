package sentinelgroup.io.sentinel.repository;

import sentinelgroup.io.sentinel.db.PinEntity;
import sentinelgroup.io.sentinel.db.PinEntryDao;
import sentinelgroup.io.sentinel.util.AppExecutors;
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

    public SingleLiveEvent<Boolean> getIsPinSetLiveEvent() {
        return mIsPinSetLiveEvent;
    }

    public SingleLiveEvent<Boolean> getIsPinResetLiveEvent() {
        return mIsPinResetLiveEvent;
    }

    public SingleLiveEvent<Boolean> getIsPinCorrectLiveEvent() {
        return mIsPinCorrectLiveEvent;
    }

    public void setAppPin(PinEntity iEntity) {
        mAppExecutors.diskIO().execute(() -> {
            long aInsertedId = mDao.insertPinEntity(iEntity);
            mIsPinSetLiveEvent.postValue(aInsertedId > 0L);
        });
    }

    public void resetAppPin(int iOldPin, int iNewPin, String iAccountAddress) {
        mAppExecutors.diskIO().execute(() -> {
            int iNumberOfRows = mDao.updatePin(iOldPin, iNewPin, iAccountAddress);
            mIsPinResetLiveEvent.postValue(iNumberOfRows == 1);
        });
    }

    public void verifyAppPin(int iPin, String iAccountAddress) {
        mAppExecutors.diskIO().execute(() -> {
            int iEntries = mDao.getPinEntity(iPin, iAccountAddress);
            mIsPinCorrectLiveEvent.postValue(iEntries == 1);
        });
    }
}
