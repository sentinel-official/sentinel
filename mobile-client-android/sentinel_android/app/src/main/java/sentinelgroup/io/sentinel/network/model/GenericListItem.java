package sentinelgroup.io.sentinel.network.model;

import java.io.Serializable;

public class GenericListItem implements Serializable {
    private String mItemDisplayText;
    private String mItemCode;
    private boolean mSelected;

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
}