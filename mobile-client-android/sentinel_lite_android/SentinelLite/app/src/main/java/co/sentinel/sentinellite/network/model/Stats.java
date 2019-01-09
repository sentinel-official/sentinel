package co.sentinel.sentinellite.network.model;

import com.google.gson.annotations.SerializedName;

public class Stats {
    @SerializedName("received_bytes")
    public long receivedBytes;
    public long duration;
    public double amount;
}
