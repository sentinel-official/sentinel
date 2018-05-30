package sentinelgroup.io.sentinel.network.model;

import android.arch.persistence.room.Entity;
import android.arch.persistence.room.Index;
import android.arch.persistence.room.PrimaryKey;

import com.google.gson.annotations.SerializedName;

public class Session {
    public String id;
    @SerializedName("account_addr")
    public String accountAddress;
    @SerializedName("received_bytes")
    public long receivedBytes;
    @SerializedName("session_duration")
    public long sessionDuration;
    public double amount;
    public long timestamp;
    @SerializedName("is_paid")
    public boolean isPaid;
    public String sessionId;
}
