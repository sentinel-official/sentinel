package sentinelgroup.io.sentinel.db.dao;

import android.arch.lifecycle.LiveData;
import android.arch.persistence.room.Dao;
import android.arch.persistence.room.Insert;
import android.arch.persistence.room.OnConflictStrategy;
import android.arch.persistence.room.Query;

import sentinelgroup.io.sentinel.network.model.ReferralInfoEntity;

/**
 * DAO to do CRUD operation related to Referral Info.
 */
@Dao
public interface ReferralInfoDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertReferralInfoEntity(ReferralInfoEntity iEntity);

    @Query("SELECT * FROM referral_info_entity")
    LiveData<ReferralInfoEntity> getReferralInfoEntity();
}
