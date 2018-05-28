package sentinelgroup.io.sentinel.network.model;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public class NetSpeed implements Serializable{
    public double download;
    public double upload;
    @SerializedName("best_server")
    public BestServer bestServer;
}
