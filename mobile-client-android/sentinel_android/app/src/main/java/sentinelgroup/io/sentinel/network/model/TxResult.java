package sentinelgroup.io.sentinel.network.model;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.List;

public class TxResult implements Serializable{
    public String from;
    public String to;
    public List<String> topics;
    public String value;
    public String data; //the token value
    public String hash;
    public String transactionHash;
    public String timeStamp;
    public String gasPrice;
    public String isError;
    @SerializedName("txreceipt_status")
    public String txReceiptStatus;
    public boolean isEth;
}
