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

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery")
    LiveData<List<VpnListEntity>> getVpnLisEntity(String iSearchQuery);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery AND isBookmarked = :toFilterByBookmark")
    LiveData<List<VpnListEntity>> getVpnLisEntity(String iSearchQuery, boolean toFilterByBookmark);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery ORDER BY location_country COLLATE NOCASE ASC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortCountryA(String iSearchQuery);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery AND isBookmarked = :toFilterByBookmark ORDER BY location_country COLLATE NOCASE ASC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortCountryA(String iSearchQuery, boolean toFilterByBookmark);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery ORDER BY location_country COLLATE NOCASE DESC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortCountryD(String iSearchQuery);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery AND isBookmarked = :toFilterByBookmark ORDER BY location_country COLLATE NOCASE DESC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortCountryD(String iSearchQuery, boolean toFilterByBookmark);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery ORDER BY latency COLLATE NOCASE ASC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortLatencyI(String iSearchQuery);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery AND isBookmarked = :toFilterByBookmark ORDER BY latency COLLATE NOCASE ASC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortLatencyI(String iSearchQuery, boolean toFilterByBookmark);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery ORDER BY latency COLLATE NOCASE DESC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortLatencyD(String iSearchQuery);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery AND isBookmarked = :toFilterByBookmark ORDER BY latency COLLATE NOCASE DESC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortLatencyD(String iSearchQuery, boolean toFilterByBookmark);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery ORDER BY net_download COLLATE NOCASE ASC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortBandwidthI(String iSearchQuery);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery AND isBookmarked = :toFilterByBookmark ORDER BY net_download COLLATE NOCASE ASC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortBandwidthI(String iSearchQuery, boolean toFilterByBookmark);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery ORDER BY net_download COLLATE NOCASE DESC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortBandwidthD(String iSearchQuery);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery AND isBookmarked = :toFilterByBookmark ORDER BY net_download COLLATE NOCASE DESC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortBandwidthD(String iSearchQuery, boolean toFilterByBookmark);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery ORDER BY pricePerGb COLLATE NOCASE ASC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortPriceI(String iSearchQuery);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery AND isBookmarked = :toFilterByBookmark ORDER BY pricePerGb COLLATE NOCASE ASC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortPriceI(String iSearchQuery, boolean toFilterByBookmark);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery ORDER BY pricePerGb COLLATE NOCASE DESC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortPriceD(String iSearchQuery);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery AND isBookmarked = :toFilterByBookmark ORDER BY pricePerGb COLLATE NOCASE DESC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortPriceD(String iSearchQuery, boolean toFilterByBookmark);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery ORDER BY rating COLLATE NOCASE ASC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortRatingI(String iSearchQuery);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery AND isBookmarked = :toFilterByBookmark ORDER BY rating COLLATE NOCASE ASC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortRatingI(String iSearchQuery, boolean toFilterByBookmark);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery ORDER BY rating COLLATE NOCASE DESC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortRatingD(String iSearchQuery);

    @Query("SELECT * FROM vpn_list_entity WHERE location_country LIKE :iSearchQuery AND isBookmarked = :toFilterByBookmark ORDER BY rating COLLATE NOCASE DESC")
    LiveData<List<VpnListEntity>> getVpnLisEntitySortRatingD(String iSearchQuery, boolean toFilterByBookmark);

    @Query("SELECT * FROM vpn_list_entity WHERE accountAddress = :iVpnAddress")
    LiveData<VpnListEntity> getVpnEntity(String iVpnAddress);

    @Query("UPDATE vpn_list_entity SET isBookmarked = :isBookmarked WHERE accountAddress = :iVpnAddress AND ip = :iIP")
    void updateBookmark(boolean isBookmarked, String iVpnAddress, String iIP);

    @Query("DELETE FROM vpn_list_entity")
    void deleteVpnListEntity();
}