package co.sentinel.lite.db;

import android.arch.persistence.db.SupportSQLiteDatabase;
import android.arch.persistence.room.Database;
import android.arch.persistence.room.Room;
import android.arch.persistence.room.RoomDatabase;
import android.arch.persistence.room.migration.Migration;
import android.content.Context;
import android.support.annotation.NonNull;
import android.util.Log;

import co.sentinel.lite.db.dao.BonusInfoDao;
import co.sentinel.lite.db.dao.BookmarkDao;
import co.sentinel.lite.db.dao.VpnListEntryDao;
import co.sentinel.lite.network.model.BonusInfoEntity;
import co.sentinel.lite.network.model.BookmarkEntity;
import co.sentinel.lite.network.model.VpnListEntity;

/**
 * Room Database for storing all the essential application data in it's table defined by the various DAO's.
 */
@Database(entities = {BonusInfoEntity.class, VpnListEntity.class, BookmarkEntity.class},
        version = 4,
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
                        .addMigrations(MIGRATION_2_3)
                        .addMigrations(MIGRATION_3_4)
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

    public abstract BookmarkDao getBookmarkDao();

    private static final Migration MIGRATION_2_3 = new Migration(2, 3) {
        @Override
        public void migrate(@NonNull SupportSQLiteDatabase database) {
            database.execSQL("ALTER TABLE vpn_list_entity ADD COLUMN rating REAL NOT NULL DEFAULT 0.0");
        }
    };

    private static final Migration MIGRATION_3_4 = new Migration(3, 4) {
        @Override
        public void migrate(@NonNull SupportSQLiteDatabase database) {
            database.execSQL("ALTER TABLE vpn_list_entity ADD COLUMN serverSequence INTEGER NOT NULL DEFAULT 0");
            database.execSQL("ALTER TABLE vpn_list_entity ADD COLUMN isBookmarked INTEGER NOT NULL DEFAULT 0");
            database.execSQL("CREATE TABLE bookmark_entity (accountAddress TEXT NOT NULL, ip TEXT, PRIMARY KEY(accountAddress))");
            database.execSQL("CREATE UNIQUE INDEX index_bookmark_entity_accountAddress ON bookmark_entity (accountAddress)");
        }
    };
}