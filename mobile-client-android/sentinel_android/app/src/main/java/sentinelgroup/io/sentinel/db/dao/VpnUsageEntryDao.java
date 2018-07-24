package sentinelgroup.io.sentinel.db.dao;

import android.arch.lifecycle.LiveData;
import android.arch.persistence.room.Dao;
import android.arch.persistence.room.Insert;
import android.arch.persistence.room.OnConflictStrategy;
import android.arch.persistence.room.Query;

import java.util.List;

import sentinelgroup.io.sentinel.network.model.Session;
import sentinelgroup.io.sentinel.network.model.VpnUsage;
import sentinelgroup.io.sentinel.network.model.VpnUsageEntity;

/**
 * DAO to do CRUD operation related to VPN usage.
 */
@Dao
public interface VpnUsageEntryDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertVpnUsageEntity(VpnUsageEntity iEntity);

    @Query("SELECT * FROM vpn_usage_entity")
    LiveData<VpnUsageEntity> getVpnUsageEntity();
}
