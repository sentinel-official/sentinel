package co.sentinel.sentinellite.network.model;

import android.arch.persistence.room.Embedded;
import android.arch.persistence.room.Entity;
import android.arch.persistence.room.Index;
import android.arch.persistence.room.PrimaryKey;
import android.support.annotation.NonNull;

@Entity(tableName = "bonus_info_entity", indices = {@Index(value = {"deviceId"}, unique = true)})
public class BonusInfoEntity {
    @PrimaryKey
    @NonNull
    private String deviceId;
    private boolean success;
    @Embedded(prefix = "info_")
    private Bonuses bonuses;
    private long refCount;
    private boolean canClaim;
    private String canClaimAfter;

    public BonusInfoEntity(@NonNull String deviceId, boolean success, Bonuses bonuses, long refCount, boolean canClaim, String canClaimAfter) {
        this.deviceId = deviceId;
        this.success = success;
        this.bonuses = bonuses;
        this.refCount = refCount;
        this.canClaim = canClaim;
        this.canClaimAfter = canClaimAfter;
    }

    @NonNull
    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(@NonNull String deviceId) {
        this.deviceId = deviceId;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Bonuses getBonuses() {
        return bonuses;
    }

    public void setBonuses(Bonuses bonuses) {
        this.bonuses = bonuses;
    }

    public long getRefCount() {
        return refCount;
    }

    public void setRefCount(long refCount) {
        this.refCount = refCount;
    }

    public boolean isCanClaim() {
        return canClaim;
    }

    public void setCanClaim(boolean canClaim) {
        this.canClaim = canClaim;
    }

    public String getCanClaimAfter() {
        return canClaimAfter;
    }

    public void setCanClaimAfter(String canClaimAfter) {
        this.canClaimAfter = canClaimAfter;
    }
}