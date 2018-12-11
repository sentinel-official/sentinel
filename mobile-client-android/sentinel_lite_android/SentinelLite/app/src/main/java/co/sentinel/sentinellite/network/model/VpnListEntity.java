package co.sentinel.sentinellite.network.model;

import android.arch.persistence.room.Embedded;
import android.arch.persistence.room.Entity;
import android.arch.persistence.room.Index;
import android.arch.persistence.room.PrimaryKey;
import android.support.annotation.NonNull;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

@Entity(tableName = "vpn_list_entity", indices = {@Index(value = {"accountAddress"}, unique = true)})
public class VpnListEntity implements Serializable {
    @PrimaryKey
    @NonNull
    @SerializedName("account_addr")
    private String accountAddress;
    private String ip;
    private double latency;
    @Embedded(prefix = "location_")
    private Location location;
    @Embedded(prefix = "net_")
    @SerializedName("net_speed")
    private NetSpeed netSpeed;
    @SerializedName("enc_method")
    private String encryptionMethod;
    @SerializedName("price_per_GB")
    private double pricePerGb;
    private String version;
    private double rating;
    private int serverSequence;
    private boolean isBookmarked;

    public VpnListEntity(@NonNull String accountAddress, String ip, double latency, Location location, NetSpeed netSpeed, String encryptionMethod, double pricePerGb, String version, double rating, int serverSequence, boolean isBookmarked) {
        this.accountAddress = accountAddress;
        this.ip = ip;
        this.latency = latency;
        this.location = location;
        this.netSpeed = netSpeed;
        this.encryptionMethod = encryptionMethod;
        this.pricePerGb = pricePerGb;
        this.version = version;
        this.rating = rating;
        this.serverSequence = serverSequence;
        this.isBookmarked = isBookmarked;
    }

    @NonNull
    public String getAccountAddress() {
        return accountAddress;
    }

    public void setAccountAddress(@NonNull String accountAddress) {
        this.accountAddress = accountAddress;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public double getLatency() {
        return latency;
    }

    public void setLatency(double latency) {
        this.latency = latency;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public NetSpeed getNetSpeed() {
        return netSpeed;
    }

    public void setNetSpeed(NetSpeed netSpeed) {
        this.netSpeed = netSpeed;
    }

    public String getEncryptionMethod() {
        return encryptionMethod;
    }

    public void setEncryptionMethod(String encryptionMethod) {
        this.encryptionMethod = encryptionMethod;
    }

    public double getPricePerGb() {
        return pricePerGb;
    }

    public void setPricePerGb(double pricePerGb) {
        this.pricePerGb = pricePerGb;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getServerSequence() {
        return serverSequence;
    }

    public void setServerSequence(int serverSequence) {
        this.serverSequence = serverSequence;
    }

    public boolean isBookmarked() {
        return isBookmarked;
    }

    public void setBookmarked(boolean bookmarked) {
        isBookmarked = bookmarked;
    }
}