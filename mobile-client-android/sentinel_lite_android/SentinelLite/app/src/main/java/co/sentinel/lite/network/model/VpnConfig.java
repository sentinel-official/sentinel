package co.sentinel.lite.network.model;

import com.google.gson.annotations.SerializedName;

public class VpnConfig {
    public boolean success;
    public VpnNode node;
    @SerializedName("session_name")
    public String sessionName;
}
