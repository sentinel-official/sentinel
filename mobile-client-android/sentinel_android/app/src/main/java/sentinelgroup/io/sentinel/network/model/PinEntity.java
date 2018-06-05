package sentinelgroup.io.sentinel.network.model;

import android.arch.persistence.room.Entity;
import android.arch.persistence.room.Index;
import android.arch.persistence.room.PrimaryKey;

@Entity(tableName = "pin_entity", indices = {@Index(value = {"accountAddress"}, unique = true)})
public class PinEntity {
    @PrimaryKey
    private long id = 1;
    private String accountAddress;
    private int appPin;

    public PinEntity(String accountAddress, int appPin) {
        this.accountAddress = accountAddress;
        this.appPin = appPin;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getAccountAddress() {
        return accountAddress;
    }

    public void setAccountAddress(String accountAddress) {
        this.accountAddress = accountAddress;
    }

    public int getAppPin() {
        return appPin;
    }

    public void setAppPin(int appPin) {
        this.appPin = appPin;
    }
}
