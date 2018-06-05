package sentinelgroup.io.sentinel.network.model;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class PayResponse {
    public boolean success;
    @SerializedName("tx_hash")
    public String txHash;
    @SerializedName("tx_hashes")
    public List<String> txHashes;
    public PayError error;
    public List<PayError> errors;
    public String message;
}
