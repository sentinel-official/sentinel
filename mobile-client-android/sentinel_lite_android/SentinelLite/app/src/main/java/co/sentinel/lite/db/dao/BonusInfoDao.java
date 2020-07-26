package co.sentinel.lite.db.dao;

import android.arch.lifecycle.LiveData;
import android.arch.persistence.room.Dao;
import android.arch.persistence.room.Insert;
import android.arch.persistence.room.OnConflictStrategy;
import android.arch.persistence.room.Query;

import co.sentinel.lite.network.model.BonusInfoEntity;

/**
 * DAO to do CRUD operation related to Referral Bonus Info.
 */
@Dao
public interface BonusInfoDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertBonusInfoEntity(BonusInfoEntity iEntity);

    @Query("SELECT * FROM bonus_info_entity")
    LiveData<BonusInfoEntity> getBonusInfoEntity();
}
