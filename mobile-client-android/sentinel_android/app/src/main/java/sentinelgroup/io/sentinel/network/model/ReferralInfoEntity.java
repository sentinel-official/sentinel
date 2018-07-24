package sentinelgroup.io.sentinel.network.model;

import android.arch.persistence.room.Embedded;
import android.arch.persistence.room.Entity;
import android.arch.persistence.room.Index;
import android.arch.persistence.room.PrimaryKey;
import android.support.annotation.NonNull;

@Entity(tableName = "referral_info_entity", indices = {@Index(value = {"address"}, unique = true)})
public class ReferralInfoEntity {
    @PrimaryKey
    @NonNull
    private String address;
    private boolean success;
    private boolean isClaimed;
    private int joinBonus;
    @Embedded(prefix = "info_")
    private Referral referral;

    public ReferralInfoEntity(@NonNull String address, boolean success, boolean isClaimed, int joinBonus, Referral referral) {
        this.address = address;
        this.success = success;
        this.isClaimed = isClaimed;
        this.joinBonus = joinBonus;
        this.referral = referral;
    }

    @NonNull
    public String getAddress() {
        return address;
    }

    public void setAddress(@NonNull String address) {
        this.address = address;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public boolean isClaimed() {
        return isClaimed;
    }

    public void setClaimed(boolean claimed) {
        isClaimed = claimed;
    }

    public int getJoinBonus() {
        return joinBonus;
    }

    public void setJoinBonus(int joinBonus) {
        this.joinBonus = joinBonus;
    }

    public Referral getReferral() {
        return referral;
    }

    public void setReferral(Referral referral) {
        this.referral = referral;
    }
}