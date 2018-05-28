package sentinelgroup.io.sentinel.network.model;

import com.google.gson.annotations.SerializedName;

public class Stats {
    @SerializedName("received_bytes")
    public int receivedBytes;
    public int duration;
    public int amount;
}
