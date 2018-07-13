package sentinelgroup.io.sentinel.ui.adapter;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.Collections;
import java.util.List;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.network.model.TxResult;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Convert;
import sentinelgroup.io.sentinel.util.Converter;

public class TxHistoryListAdapter extends RecyclerView.Adapter<TxHistoryListAdapter.ViewHolder> {

    private final OnItemClickListener mItemClickListener;

    private List<TxResult> mData;
    private final Context mContext;
    private final String mAddress;

    public TxHistoryListAdapter(OnItemClickListener iListener, Context iContext) {
        mItemClickListener = iListener;
        mContext = iContext;
        mAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new ViewHolder(LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_transaction_history, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        TxResult aTxResult = mData.get(position);
        if (aTxResult.isEth) {
            boolean isReceivedTransaction = aTxResult.to.equalsIgnoreCase(mAddress);
            holder.mIvSource.setImageDrawable(ContextCompat.getDrawable(mContext, isReceivedTransaction ? R.drawable.shape_state_blue : R.drawable.shape_state_grey));
            holder.mTvSource.setText(isReceivedTransaction ? R.string.receive_eth : R.string.send_eth);
            String aValue = Convert.fromWei(aTxResult.value, Convert.EtherUnit.ETHER).toPlainString();
            holder.mTvSourceEarnings.setText(isReceivedTransaction
                    ? mContext.getString(R.string.earning_positive, aValue)
                    : aValue.equals("0") ? aValue : mContext.getString(R.string.earning_neagtive, aValue));
            holder.mTvDateTime.setText(Converter.convertEpochToDate(Long.parseLong(aTxResult.timeStamp)));
            holder.mTvTxStatus.setText(aTxResult.txReceiptStatus.equals("1") ? R.string.status_success : R.string.status_fail);
        } else {
            String aReceivedAddress = aTxResult.topics.get(2);
            String aMyAddress = Converter.get64bitAddress(mAddress.substring(2));
            boolean isReceivedTransaction = aReceivedAddress.equalsIgnoreCase(aMyAddress);
            holder.mIvSource.setImageDrawable(ContextCompat.getDrawable(mContext, isReceivedTransaction ? R.drawable.shape_state_blue : R.drawable.shape_state_grey));
            holder.mTvSource.setText(isReceivedTransaction ? R.string.receive_sent : R.string.send_sent);
            String aValue = Converter.getFormattedTokenString(Double.parseDouble(Converter.convertHexToString(aTxResult.data)));
            holder.mTvSourceEarnings.setText(isReceivedTransaction
                    ? mContext.getString(R.string.earning_positive, aValue)
                    : mContext.getString(R.string.earning_neagtive, aValue));
            String aTimeStamp = Converter.convertHexToString(aTxResult.timeStamp);
            holder.mTvDateTime.setText(Converter.convertEpochToDate(Long.parseLong(aTimeStamp)));
            holder.mTvTxStatus.setText(R.string.status_success);
        }
        holder.mRootView.setOnClickListener(v -> onRootViewClick(aTxResult));
    }

    @Override
    public int getItemCount() {
        if (null == mData) return 0;
        return mData.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder {
        View mRootView;
        ImageView mIvSource;
        TextView mTvSource, mTvSourceEarnings, mTvDateTime, mTvTxStatus;

        ViewHolder(View itemView) {
            super(itemView);
            mRootView = itemView.getRootView();
            mIvSource = itemView.findViewById(R.id.iv_source);
            mTvSource = itemView.findViewById(R.id.tv_source);
            mTvSourceEarnings = itemView.findViewById(R.id.tv_source_earnings);
            mTvDateTime = itemView.findViewById(R.id.tv_date_time);
            mTvTxStatus = itemView.findViewById(R.id.tv_tx_status);
        }
    }

    public void loadData(List<TxResult> iData) {
        Collections.reverse(iData);
        if (mData != null)
            mData.clear();
        mData = iData;
        notifyDataSetChanged();
    }

    // Interface interaction method
    private void onRootViewClick(TxResult iTxData) {
        if (mItemClickListener != null) {
            mItemClickListener.onRootViewClicked(iTxData);
        }
    }

    public interface OnItemClickListener {
        void onRootViewClicked(TxResult iTxData);
    }
}
