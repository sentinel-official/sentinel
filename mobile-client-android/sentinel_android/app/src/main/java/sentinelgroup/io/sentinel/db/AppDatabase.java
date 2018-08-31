package sentinelgroup.io.sentinel.db;

import android.arch.persistence.db.SupportSQLiteDatabase;
import android.arch.persistence.room.Database;
import android.arch.persistence.room.Room;
import android.arch.persistence.room.RoomDatabase;
import android.arch.persistence.room.migration.Migration;
import android.content.Context;
import android.support.annotation.NonNull;
import android.util.Log;

import sentinelgroup.io.sentinel.db.dao.BalanceEntryDao;
import sentinelgroup.io.sentinel.db.dao.BonusInfoDao;
import sentinelgroup.io.sentinel.db.dao.DeleteTableDao;
import sentinelgroup.io.sentinel.db.dao.GasEstimateEntryDao;
import sentinelgroup.io.sentinel.db.dao.PinEntryDao;
import sentinelgroup.io.sentinel.db.dao.VpnListEntryDao;
import sentinelgroup.io.sentinel.db.dao.VpnUsageEntryDao;
import sentinelgroup.io.sentinel.network.model.BonusInfoEntity;
import sentinelgroup.io.sentinel.network.model.Chains;
import sentinelgroup.io.sentinel.network.model.GasEstimateEntity;
import sentinelgroup.io.sentinel.network.model.PinEntity;
import sentinelgroup.io.sentinel.network.model.ReferralInfoEntity;
import sentinelgroup.io.sentinel.network.model.VpnListEntity;
import sentinelgroup.io.sentinel.network.model.VpnUsageEntity;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;

/**
 * Room Database for storing all the essential application data in it's table defined by the various DAO's.
 */
@Database(entities = {Chains.class, GasEstimateEntity.class, PinEntity.class, VpnListEntity.class, VpnUsageEntity.class, BonusInfoEntity.class},
        version = 9,
        exportSchema = false)
public abstract class AppDatabase extends RoomDatabase {
    private static final String LOG_TAG = AppDatabase.class.getSimpleName();
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static final String DATABASE_NAME = "sentinel_db";
    private static AppDatabase sInstance;

    public static AppDatabase getInstance(Context context) {
        Log.d(LOG_TAG, "Getting the database");
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = Room
                        .databaseBuilder(context.getApplicationContext(),
                                AppDatabase.class, AppDatabase.DATABASE_NAME)
                        .addMigrations(MIGRATION_8_9)
                        .fallbackToDestructiveMigration()
                        .build();
                Log.d(LOG_TAG, "Made new database");
            }
        }
        return sInstance;
    }

    // The associated DAOs for the database
    public abstract PinEntryDao getPinEntryDao();

    public abstract VpnListEntryDao getVpnListEntryDao();

    public abstract GasEstimateEntryDao getGasEstimateEntryDao();

    public abstract VpnUsageEntryDao getVpnUsageEntryDao();

    public abstract BalanceEntryDao getBalanceEntryDao();

    public abstract BonusInfoDao getBonusInfoEntryDao();

    public abstract DeleteTableDao deleteTableDao();

    private static final Migration MIGRATION_7_8 = new Migration(7, 8) {
        @Override
        public void migrate(@NonNull SupportSQLiteDatabase database) {
            database.execSQL("ALTER TABLE referral_info_entity RENAME TO bonus_info_entity");
            database.execSQL("ALTER TABLE bonus_info_entity ADD COLUMN canClaim INTEGER");
            database.execSQL("ALTER TABLE bonus_info_entity ADD COLUMN canClaimAfter TEXT");
            database.execSQL("ALTER TABLE vpn_list_entity ADD COLUMN version TEXT");
            database.execSQL("ALTER TABLE vpn_list_entity ADD COLUMN encryptionMethod TEXT");
        }
    };

    private static final Migration MIGRATION_8_9 = new Migration(8, 9) {
        @Override
        public void migrate(@NonNull SupportSQLiteDatabase database) {
            database.execSQL("ALTER TABLE vpn_list_entity ADD COLUMN rating REAL NOT NULL DEFAULT 0.0");
        }
    };
}