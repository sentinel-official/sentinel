package sentinelgroup.io.sentinel.network.model;

import com.google.gson.annotations.SerializedName;

public class ReportPay {
    public boolean success;
    @SerializedName("tx_hash")
    public String txHash;
    public String message;
}
