package co.sentinel.sentinellite.network.model;

import android.arch.persistence.room.Entity;
import android.arch.persistence.room.Index;
import android.arch.persistence.room.PrimaryKey;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.Arrays;

@Entity(tableName = "bookmark_entity", indices = {@Index(value = {"accountAddress"}, unique = true)})
public class BookmarkEntity implements Serializable {
    @PrimaryKey
    @NonNull
    @SerializedName("account_addr")
    private String accountAddress;
    private String ip;

    public BookmarkEntity(@NonNull String accountAddress, String ip) {
        this.accountAddress = accountAddress;
        this.ip = ip;
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

    @Override
    public boolean equals(@Nullable Object obj) {
        return obj instanceof BookmarkEntity && this.accountAddress.equals(((BookmarkEntity) obj).accountAddress) && this.ip.equals(((BookmarkEntity) obj).ip);
    }

    @Override
    public int hashCode() {
        return (accountAddress + ip).hashCode();
    }
}
