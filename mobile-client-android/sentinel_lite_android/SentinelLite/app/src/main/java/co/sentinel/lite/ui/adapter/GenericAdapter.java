package co.sentinel.lite.ui.adapter;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckedTextView;

import java.util.List;

import co.sentinel.lite.R;
import co.sentinel.lite.network.model.GenericListItem;

public class GenericAdapter extends RecyclerView.Adapter<GenericAdapter.ViewHolder> {

    private OnItemClickListener mItemClickListener;

    private List<GenericListItem> mData;
    private final Context mContext;

    public GenericAdapter(OnItemClickListener iListener, Context iContext) {
        mItemClickListener = iListener;
        mContext = iContext;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new ViewHolder(LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_generic_checked, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        GenericListItem aItemData = mData.get(position);
        holder.mTvItem.setChecked(aItemData.isSelected());
        holder.mTvItem.setText(aItemData.getItemDisplayText());
        holder.mTvItem.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                for (int i = 0; i < mData.size(); i++) {
                    mData.get(i).setSelected(holder.getAdapterPosition() == i);
                }
                notifyDataSetChanged();
                onRootViewClick(aItemData);
            }
        });
    }

    @Override
    public int getItemCount() {
        if (null == mData) return 0;
        return mData.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder {
        CheckedTextView mTvItem;

        ViewHolder(View itemView) {
            super(itemView);
            mTvItem = itemView.findViewById(R.id.tv_item);
        }
    }

    public void loadData(List<GenericListItem> iData) {
        if (mData == null)
            mData = iData;
        notifyDataSetChanged();
    }

    // Interface interaction method
    private void onRootViewClick(GenericListItem iItem) {
        if (mItemClickListener != null) {
            mItemClickListener.onRootViewClicked(iItem);
        }
    }

    public interface OnItemClickListener {
        void onRootViewClicked(GenericListItem iItem);
    }
}