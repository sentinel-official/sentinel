package sentinelgroup.io.sentinel.network.model;

import com.google.gson.annotations.SerializedName;

public class Tokens {
    public boolean success;
    public String[] errors;
    @SerializedName("tx_hashes")
    public String[] txHashes;
    public String message;
}