package sentinelgroup.io.sentinel.ui.adapter;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.List;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.network.model.GenericUrlListItem;

public class GenericUrlListAdapter extends RecyclerView.Adapter<GenericUrlListAdapter.ViewHolder> {

    private OnItemClickListener mItemClickListener;

    private List<GenericUrlListItem> mData;
    private final Context mContext;

    public GenericUrlListAdapter(OnItemClickListener iListener, Context iContext) {
        mItemClickListener = iListener;
        mContext = iContext;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new ViewHolder(LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_generic, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        GenericUrlListItem aItemData = mData.get(position);
        holder.mTvItem.setCompoundDrawablesWithIntrinsicBounds(aItemData.getIconId(), 0, 0, 0);
        holder.mTvItem.setText(aItemData.getItemTextId());
        holder.mTvItem.setOnClickListener(v -> onRootViewClick(aItemData.getUrl()));
    }

    @Override
    public int getItemCount() {
        if (null == mData) return 0;
        return mData.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder {
        TextView mTvItem;

        ViewHolder(View itemView) {
            super(itemView);
            mTvItem = itemView.findViewById(R.id.tv_item);
        }
    }

    public void loadData(List<GenericUrlListItem> iData) {
        if (mData == null)
            mData = iData;
        notifyDataSetChanged();
    }

    // Interface interaction method
    private void onRootViewClick(String iUrl) {
        if (mItemClickListener != null) {
            mItemClickListener.onRootViewClicked(iUrl);
        }
    }

    public interface OnItemClickListener {
        void onRootViewClicked(String iUrl);
    }
}
