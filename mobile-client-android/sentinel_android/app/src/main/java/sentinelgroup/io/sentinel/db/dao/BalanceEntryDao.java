package sentinelgroup.io.sentinel.db.dao;

import android.arch.lifecycle.LiveData;
import android.arch.persistence.room.Dao;
import android.arch.persistence.room.Insert;
import android.arch.persistence.room.OnConflictStrategy;
import android.arch.persistence.room.Query;

import sentinelgroup.io.sentinel.network.model.Chains;
import sentinelgroup.io.sentinel.network.model.Net;

@Dao
public interface BalanceEntryDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertBalanceEntity(Chains iEntity);

    @Query("SELECT * FROM balance_entity")
    LiveData<Chains> getBalanceEntity();

    @Query("DELETE FROM balance_entity")
    void deleteBalanceEntity();
}
