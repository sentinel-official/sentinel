package co.sentinel.lite.network.model;

import java.io.Serializable;

public class GenericUrlListItem implements Serializable {
    private int mIconId;
    private int mItemTextId;
    private String mUrl;

    public GenericUrlListItem(int iIconId, int iItemTextId, String iUrl) {
        this.mIconId = iIconId;
        this.mItemTextId = iItemTextId;
        this.mUrl = iUrl;
    }

    public int getIconId() {
        return mIconId;
    }

    public void setIconId(int mIconId) {
        this.mIconId = mIconId;
    }

    public int getItemTextId() {
        return mItemTextId;
    }

    public void setItemTextId(int mItemTextId) {
        this.mItemTextId = mItemTextId;
    }

    public String getUrl() {
        return mUrl;
    }

    public void setUrl(String mUrl) {
        this.mUrl = mUrl;
    }
}
