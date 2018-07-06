package sentinelgroup.io.sentinel.network.model;

import java.io.Serializable;

public class GenericListItem implements Serializable {
    private int mItemTextId;
    private boolean mIsSelected;
    private String mItemCode;

    public GenericListItem(int iItemTextId, boolean iIsSet, String iItemCode) {
        this.mItemTextId = iItemTextId;
        this.mIsSelected = iIsSet;
        this.mItemCode = iItemCode;
    }

    public int getItemTextId() {
        return mItemTextId;
    }

    public void setItemTextId(int iItemTextId) {
        this.mItemTextId = iItemTextId;
    }

    public String getItemCode() {
        return mItemCode;
    }

    public void setItemCode(String iItemCode) {
        this.mItemCode = iItemCode;
    }

    public boolean isSelected() {
        return mIsSelected;
    }

    public void setIsSet(boolean iIsSet) {
        this.mIsSelected = iIsSet;
    }
}
