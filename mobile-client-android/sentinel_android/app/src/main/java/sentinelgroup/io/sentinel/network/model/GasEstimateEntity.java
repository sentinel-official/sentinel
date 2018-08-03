package sentinelgroup.io.sentinel.network.model;

import android.arch.persistence.room.Entity;
import android.arch.persistence.room.Index;
import android.arch.persistence.room.PrimaryKey;

@Entity(tableName = "gas_estimate_entity", indices = {@Index(value = {"id"}, unique = true)})
public class GasEstimateEntity {
    @PrimaryKey
    private int id = 1;
    private String safeLow;
    private String standard;
    private String fast;
    private String fastest;

    public GasEstimateEntity(String safeLow, String standard, String fast, String fastest) {
        this.safeLow = safeLow;
        this.standard = standard;
        this.fast = fast;
        this.fastest = fastest;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSafeLow() {
        return safeLow;
    }

    public void setSafeLow(String safeLow) {
        this.safeLow = safeLow;
    }

    public String getStandard() {
        return standard;
    }

    public void setStandard(String standard) {
        this.standard = standard;
    }

    public String getFast() {
        return fast;
    }

    public void setFast(String fast) {
        this.fast = fast;
    }

    public String getFastest() {
        return fastest;
    }

    public void setFastest(String fastest) {
        this.fastest = fastest;
    }
}
