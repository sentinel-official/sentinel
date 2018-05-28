package sentinelgroup.io.sentinel.network.model;

import com.google.gson.annotations.SerializedName;

public class VpnCredentials {
    public boolean success;
    public String ip;
    public int port;
    public String token;
    @SerializedName("vpn_addr")
    public String vpnAddress;
    @SerializedName("account_addr")
    public String accountAddress;
    public String message;
}
