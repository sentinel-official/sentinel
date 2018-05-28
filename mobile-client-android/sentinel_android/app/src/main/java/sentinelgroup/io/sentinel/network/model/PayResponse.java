package sentinelgroup.io.sentinel.network.model;

import com.google.gson.annotations.SerializedName;

public class PayResponse {
    public boolean success;
    @SerializedName("tx_hash")
    public String txHash;
    @SerializedName("tx_hashes")
    public String[] txHashes;
    public String message;
    public PayError error;
    public PayError[] errors;
}
