package sentinelgroup.io.sentinel.ui.adapter;

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

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.network.model.Session;
import sentinelgroup.io.sentinel.util.Converter;

public class VpnHistoryListAdapter extends RecyclerView.Adapter<VpnHistoryListAdapter.ViewHolder> {

    private final OnItemClickListener mItemClickListener;

    private List<Session> mData;
    private final Context mContext;

    public VpnHistoryListAdapter(OnItemClickListener iListener, Context iContext) {
        mItemClickListener = iListener;
        mContext = iContext;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new ViewHolder(LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_vpn_history, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Session aSession = mData.get(position);
        holder.mTvVpnPayState.setVisibility(aSession.isPaid ? View.GONE : View.VISIBLE);
        holder.mTvSessionId.setText(aSession.sessionId);
        holder.mTvReceivedData.setText(Converter.getFileSize(aSession.receivedBytes));
        holder.mTvDuration.setText(Converter.getLongDuration(aSession.sessionDuration));
        holder.mTvDateTime.setText(Converter.convertEpochToDate(aSession.timestamp));
        holder.mTvPayValue.setVisibility(aSession.isPaid ? View.GONE : View.VISIBLE);
        if (!aSession.isPaid) {
            holder.mTvPayValue.setText(mContext.getString(R.string.pay_sents, Converter.getSentString(aSession.amount)));
        }
        holder.mTvPayValue.setOnClickListener(v -> onPayClick(Converter.getSentString(aSession.amount), aSession.sessionId));
        holder.mRootView.setOnClickListener(v -> onRootViewClick(aSession));
    }

    @Override
    public int getItemCount() {
        if (null == mData) return 0;
        return mData.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder {
        View mRootView;
        TextView mTvVpnPayState, mTvSessionId, mTvReceivedData, mTvDuration, mTvDateTime, mTvPayValue;

        ViewHolder(View itemView) {
            super(itemView);
            mRootView = itemView.getRootView();
            mTvVpnPayState = itemView.findViewById(R.id.tv_vpn_pay_state);
            mTvSessionId = itemView.findViewById(R.id.tv_session_id);
            mTvReceivedData = itemView.findViewById(R.id.tv_received_data);
            mTvDuration = itemView.findViewById(R.id.tv_duration);
            mTvDateTime = itemView.findViewById(R.id.tv_date_time);
            mTvPayValue = itemView.findViewById(R.id.tv_pay_value);
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

    // Interface interaction method
    private void onRootViewClick(Session iSession) {
        if (mItemClickListener != null) {
            mItemClickListener.onRootViewClicked(iSession);
        }
    }

    private void onPayClick(String iValue, String iSessionId) {
        if (mItemClickListener != null) {
            mItemClickListener.onPayClicked(iValue, iSessionId);
        }
    }

    public interface OnItemClickListener {
        void onRootViewClicked(Session iSession);

        void onPayClicked(String iValue, String iSessionId);
    }
}