package co.sentinel.sentinellite.ui.adapter;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.List;

import co.sentinel.sentinellite.R;
import co.sentinel.sentinellite.network.model.VpnDetailListData;

public class VpnDetailListAdapter extends RecyclerView.Adapter<VpnDetailListAdapter.ViewHolder>{

    private List<VpnDetailListData> mData;
    private final Context mContext;

    public VpnDetailListAdapter(Context iContext, List<VpnDetailListData> iData) {
        mContext = iContext;
        mData=iData;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new ViewHolder(LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_vpn_details, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        VpnDetailListData aData = mData.get(position);
        holder.mTvTitle.setText(aData.title);
        holder.mTvDescription.setText(aData.description);
    }

    @Override
    public int getItemCount() {
        if (null == mData) return 0;
        return mData.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder{
        TextView mTvTitle, mTvDescription;

        ViewHolder(View itemView) {
            super(itemView);
            mTvTitle = itemView.findViewById(R.id.tv_title);
            mTvDescription=itemView.findViewById(R.id.tv_desc);
        }
    }
}
