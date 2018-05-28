package sentinelgroup.io.sentinel.network.model;

import com.google.gson.annotations.SerializedName;

public class Session {
    public String id;
    @SerializedName("account_addr")
    public String accountAddress;
    @SerializedName("received_bytes")
    public int receivedBytes;
    @SerializedName("session_duration")
    public int sessionDuration;
    public int amount;
    public int timestamp;
    @SerializedName("is_paid")
    public boolean isPaid;
}
