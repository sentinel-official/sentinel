package sentinelgroup.io.sentinel.network.model;

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

    public BonusInfoEntity(@NonNull String deviceId, boolean success, Bonuses bonuses, long refCount) {
        this.deviceId = deviceId;
        this.success = success;
        this.bonuses = bonuses;
        this.refCount = refCount;
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
}