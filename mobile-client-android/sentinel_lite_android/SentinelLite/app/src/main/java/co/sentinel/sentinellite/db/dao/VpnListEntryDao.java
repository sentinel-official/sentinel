package co.sentinel.sentinellite.db.dao;

import android.arch.lifecycle.LiveData;
import android.arch.persistence.room.Dao;
import android.arch.persistence.room.Insert;
import android.arch.persistence.room.OnConflictStrategy;
import android.arch.persistence.room.Query;

import java.util.List;

import co.sentinel.sentinellite.network.model.VpnListEntity;

/**
 * DAO to do CRUD operation related to VPN List.
 */
@Dao
public interface VpnListEntryDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertVpnListEntity(List<VpnListEntity> iEntity);

    @Query("SELECT * FROM vpn_list_entity")
    LiveData<List<VpnListEntity>> getVpnLisEntity();

    @Query("SELECT * FROM vpn_list_entity WHERE accountAddress = :iVpnAddress")
    LiveData<VpnListEntity> getVpnEntity(String iVpnAddress);

    @Query("DELETE FROM vpn_list_entity")
    void deleteVpnListEntity();
}