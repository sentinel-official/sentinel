package sentinelgroup.io.sentinel.db.dao;

import android.arch.lifecycle.LiveData;
import android.arch.persistence.room.Dao;
import android.arch.persistence.room.Insert;
import android.arch.persistence.room.OnConflictStrategy;
import android.arch.persistence.room.Query;

import sentinelgroup.io.sentinel.network.model.GasEstimateEntity;

/**
 * DAO to do CRUD operation related to GAS Estimate.
 */
@Dao
public interface GasEstimateEntryDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertGasEstimateEntity(GasEstimateEntity iEntity);

    @Query("SELECT * FROM gas_estimate_entity")
    LiveData<GasEstimateEntity> getGasEstimateEntity();

    @Query("DELETE FROM gas_estimate_entity")
    void deleteGasEstimateEntity();
}
