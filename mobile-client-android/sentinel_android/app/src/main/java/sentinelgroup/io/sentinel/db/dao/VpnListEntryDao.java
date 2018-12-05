package sentinelgroup.io.sentinel.db.dao;

import android.arch.lifecycle.LiveData;
import android.arch.persistence.room.Dao;
import android.arch.persistence.room.Insert;
import android.arch.persistence.room.OnConflictStrategy;
import android.arch.persistence.room.Query;

import java.util.List;

import sentinelgroup.io.sentinel.network.model.VpnListEntity;

/**
 * DAO to do CRUD operation related to VPN List.
 */
@Dao
public interface VpnListEntryDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertVpnListEntity(List<VpnListEntity> iEntity);

    @Query("SELECT * FROM vpn_list_entity")
    LiveData<List<VpnListEntity>> getVpnLisEntity();

    @Query("SELECT * FROM vpn_list_entity ORDER BY location_country COLLATE NOCASE ASC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortCountryA();

    @Query("SELECT * FROM vpn_list_entity ORDER BY location_country COLLATE NOCASE DESC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortCountryD();

    @Query("SELECT * FROM vpn_list_entity ORDER BY latency COLLATE NOCASE ASC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortLatencyI();

    @Query("SELECT * FROM vpn_list_entity ORDER BY latency COLLATE NOCASE DESC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortLatencyD();

    @Query("SELECT * FROM vpn_list_entity ORDER BY net_download COLLATE NOCASE ASC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortBandwidthI();

    @Query("SELECT * FROM vpn_list_entity ORDER BY net_download COLLATE NOCASE DESC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortBandwidthD();

    @Query("SELECT * FROM vpn_list_entity ORDER BY pricePerGb COLLATE NOCASE ASC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortPriceI();

    @Query("SELECT * FROM vpn_list_entity ORDER BY pricePerGb COLLATE NOCASE DESC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortPriceD();

    @Query("SELECT * FROM vpn_list_entity ORDER BY rating COLLATE NOCASE ASC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortRatingI();

    @Query("SELECT * FROM vpn_list_entity ORDER BY rating COLLATE NOCASE DESC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortRatingD();

    @Query("SELECT * FROM vpn_list_entity WHERE accountAddress = :iVpnAddress")
    LiveData<VpnListEntity> getVpnEntity(String iVpnAddress);

    @Query("DELETE FROM vpn_list_entity")
    void deleteVpnListEntity();
}