package co.sentinel.lite.network.model;

import android.arch.persistence.room.Ignore;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

public class NetSpeed implements Serializable{
    public double download;
    public double upload;
    @Ignore
    @SerializedName("best_server")
    public BestServer bestServer;
}
