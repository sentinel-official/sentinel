package sentinelgroup.io.sentinel.network.model;

import com.google.gson.annotations.SerializedName;

public class Account {
    @SerializedName("success")
    public boolean success;
    @SerializedName("account_addr")
    public String accountAddress;
    @SerializedName("private_key")
    public String privateKey;
    @SerializedName("keystore")
    public String keystoreString;
    @SerializedName("message")
    public String message;
    public String keystoreFilePath;

    /**
     * This is for bonus account
     */
    public String deviceId;
    public String referralId;
    public String address;
    public String referredBy;
    public String addedOn;

}
