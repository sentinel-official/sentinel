package co.sentinel.sentinellite.ui.adapter;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.util.DiffUtil;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.Collections;
import java.util.List;

import co.sentinel.sentinellite.R;
import co.sentinel.sentinellite.network.model.Session;
import co.sentinel.sentinellite.util.Converter;

public class VpnUsageListAdapter extends RecyclerView.Adapter<VpnUsageListAdapter.ViewHolder> {

    private List<Session> mData;
    private final Context mContext;

    public VpnUsageListAdapter(Context iContext) {
        mContext = iContext;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new ViewHolder(LayoutInflater.from(mContext).inflate(R.layout.item_vpn_history, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Session aSession = mData.get(position);
        holder.mTvSessionId.setText(aSession.sessionId);
        holder.mTvReceivedData.setText(Converter.getFileSize(aSession.receivedBytes));
        holder.mTvDuration.setText(Converter.getLongDuration(aSession.sessionDuration));
        holder.mTvDateTime.setText(Converter.convertEpochToDate(aSession.timestamp));
    }

    @Override
    public int getItemCount() {
        if (null == mData) return 0;
        return mData.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder {
        TextView mTvSessionId, mTvReceivedData, mTvDuration, mTvDateTime;

        ViewHolder(View itemView) {
            super(itemView);
            mTvSessionId = itemView.findViewById(R.id.tv_session_id);
            mTvReceivedData = itemView.findViewById(R.id.tv_received_data);
            mTvDuration = itemView.findViewById(R.id.tv_duration);
            mTvDateTime = itemView.findViewById(R.id.tv_date_time);
        }
    }

    public void loadData(List<Session> iData) {
        Collections.reverse(iData);
        if (mData == null) {
            mData = iData;
            notifyDataSetChanged();
        } else {
            DiffUtil.DiffResult aResult = DiffUtil.calculateDiff(new DiffUtil.Callback() {
                @Override
                public int getOldListSize() {
                    return mData.size();
                }

                @Override
                public int getNewListSize() {
                    return iData.size();
                }

                @Override
                public boolean areItemsTheSame(int oldItemPosition, int newItemPosition) {
                    Session aOldData = mData.get(oldItemPosition);
                    Session aNewData = iData.get(newItemPosition);
                    return aOldData.sessionId.equals(aNewData.sessionId);
                }

                @Override
                public boolean areContentsTheSame(int oldItemPosition, int newItemPosition) {
                    Session aOldData = mData.get(oldItemPosition);
                    Session aNewData = iData.get(newItemPosition);
                    return aOldData.isPaid == aNewData.isPaid
                            && aOldData.amount == aNewData.amount
                            && aOldData.timestamp == aNewData.timestamp;
                }
            });
            mData.clear();
            mData.addAll(iData);
            aResult.dispatchUpdatesTo(this);
        }
    }
}