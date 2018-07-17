package sentinelgroup.io.sentinel.network.model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class VpnFile {
    public List<String> ovpn = null;
    @SerializedName("net_speed")
    public NetSpeed netSpeed;
    public Location location;
}
