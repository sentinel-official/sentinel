package sentinelgroup.io.sentinel.network.model;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public class Session implements Serializable {
    @SerializedName("id")
    public String sessionId;
    @SerializedName("account_addr")
    public String accountAddress;
    @SerializedName("received_bytes")
    public long receivedBytes;
    @SerializedName("session_duration")
    public long sessionDuration;
    public long amount;
    public long timestamp;
    @SerializedName("is_paid")
    public boolean isPaid;
}
