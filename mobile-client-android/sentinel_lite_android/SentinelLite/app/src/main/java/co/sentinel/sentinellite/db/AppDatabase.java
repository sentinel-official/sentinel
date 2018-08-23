package co.sentinel.sentinellite.db;

import android.arch.persistence.room.Database;
import android.arch.persistence.room.Room;
import android.arch.persistence.room.RoomDatabase;
import android.content.Context;
import android.util.Log;

import co.sentinel.sentinellite.db.dao.BonusInfoDao;
import co.sentinel.sentinellite.db.dao.VpnListEntryDao;
import co.sentinel.sentinellite.network.model.BonusInfoEntity;
import co.sentinel.sentinellite.network.model.VpnListEntity;

/**
 * Room Database for storing all the essential application data in it's table defined by the various DAO's.
 */
@Database(entities = {BonusInfoEntity.class, VpnListEntity.class},
        version = 1,
        exportSchema = false)
public abstract class AppDatabase extends RoomDatabase {
    private static final String LOG_TAG = AppDatabase.class.getSimpleName();
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static final String DATABASE_NAME = "sentinel_lite_db";
    private static AppDatabase sInstance;

    public static AppDatabase getInstance(Context context) {
        Log.d(LOG_TAG, "Getting the database");
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = Room
                        .databaseBuilder(context.getApplicationContext(),
                                AppDatabase.class, AppDatabase.DATABASE_NAME)
                        .fallbackToDestructiveMigration()
                        .build();
                Log.d(LOG_TAG, "Made new database");
            }
        }
        return sInstance;
    }

    // The associated DAOs for the database
    public abstract BonusInfoDao getBonusInfoEntryDao();

    public abstract VpnListEntryDao getVpnListEntryDao();
}