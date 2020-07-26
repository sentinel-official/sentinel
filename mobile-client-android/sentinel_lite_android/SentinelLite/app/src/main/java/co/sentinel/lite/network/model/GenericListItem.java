package co.sentinel.lite.network.model;

import android.support.annotation.Nullable;

import java.io.Serializable;

public class GenericListItem implements Serializable {
    private String mItemDisplayText;
    private String mItemCode;
    private boolean mSelected;

    public GenericListItem(String mItemCode) {
        this.mItemCode = mItemCode;
    }

    public GenericListItem(String iItemDisplayText, String iItemCode, boolean iSelected) {
        mItemDisplayText = iItemDisplayText;
        mItemCode = iItemCode;
        mSelected = iSelected;
    }

    public String getItemDisplayText() {
        return mItemDisplayText;
    }

    public void setItemDisplayText(String iItemDisplayText) {
        this.mItemDisplayText = iItemDisplayText;
    }

    public String getItemCode() {
        return mItemCode;
    }

    public void setItemCode(String iItemCode) {
        this.mItemCode = iItemCode;
    }

    public boolean isSelected() {
        return mSelected;
    }

    public void setSelected(boolean iSelected) {
        this.mSelected = iSelected;
    }

    @Override
    public boolean equals(@Nullable Object obj) {
        return obj instanceof GenericListItem && this.getItemCode().equals(((GenericListItem) obj).getItemCode());
    }

    @Override
    public int hashCode() {
        return this.getItemCode().hashCode();
    }
}