package sentinelgroup.io.sentinel.db.dao;

import android.arch.persistence.room.Dao;
import android.arch.persistence.room.Query;

@Dao
public interface DeleteTableDao {
    @Query("DELETE FROM pin_entity")
    void deletePinEntities();

    @Query("DELETE FROM vpn_list_entity")
    void deleteVpnListEntities();

    @Query("DELETE FROM vpn_usage_entity")
    void deleteVpnUsageEntities();

    @Query("DELETE FROM balance_entity")
    void deleteBalanceEntities();

    @Query("DELETE FROM referral_info_entity")
    void deleteReferralInfoEntity();
}
