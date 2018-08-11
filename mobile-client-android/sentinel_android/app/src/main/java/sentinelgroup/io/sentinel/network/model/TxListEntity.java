package sentinelgroup.io.sentinel.network.model;

import android.arch.persistence.room.Entity;
import android.arch.persistence.room.Ignore;
import android.arch.persistence.room.Index;
import android.arch.persistence.room.PrimaryKey;
import android.arch.persistence.room.TypeConverters;
import android.support.annotation.NonNull;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.List;

import sentinelgroup.io.sentinel.db.typeconverters.TopicsListTypeConverter;

@Entity(tableName = "tx_list_entity", indices = {@Index(value = {"hash"}, unique = true)})
public class TxListEntity implements Serializable {
    @PrimaryKey
    @NonNull
    private String hash;
    private String from;
    private String to;
    @TypeConverters(TopicsListTypeConverter.class)
    private List<String> topics;
    private String value;
    private String data; //the token value
    private String timeStamp;
    private String gasPrice;
    private String isError;
    @SerializedName("txreceipt_status")
    private String txReceiptStatus;
    private boolean isEth;
    @Ignore
    private String transactionHash;

    public TxListEntity(@NonNull String hash, String from, String to, List<String> topics, String value, String data, String timeStamp, String gasPrice, String isError, String txReceiptStatus, boolean isEth) {
        this.hash = hash;
        this.from = from;
        this.to = to;
        this.topics = topics;
        this.value = value;
        this.data = data;
        this.timeStamp = timeStamp;
        this.gasPrice = gasPrice;
        this.isError = isError;
        this.txReceiptStatus = txReceiptStatus;
        this.isEth = isEth;
    }

    @NonNull
    public String getHash() {
        return hash;
    }

    public void setHash(@NonNull String hash) {
        this.hash = hash;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(String timeStamp) {
        this.timeStamp = timeStamp;
    }

    public String getGasPrice() {
        return gasPrice;
    }

    public void setGasPrice(String gasPrice) {
        this.gasPrice = gasPrice;
    }

    public String getIsError() {
        return isError;
    }

    public void setIsError(String isError) {
        this.isError = isError;
    }

    public String getTxReceiptStatus() {
        return txReceiptStatus;
    }

    public void setTxReceiptStatus(String txReceiptStatus) {
        this.txReceiptStatus = txReceiptStatus;
    }

    public boolean isEth() {
        return isEth;
    }

    public void setEth(boolean eth) {
        isEth = eth;
    }

    public String getTransactionHash() {
        return transactionHash;
    }

    public void setTransactionHash(String transactionHash) {
        this.transactionHash = transactionHash;
    }
}