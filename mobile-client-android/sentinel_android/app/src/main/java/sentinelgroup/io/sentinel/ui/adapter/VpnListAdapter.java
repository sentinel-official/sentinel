package sentinelgroup.io.sentinel.ui.adapter;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Typeface;
import android.support.annotation.NonNull;
import android.support.v4.content.ContextCompat;
import android.support.v7.util.DiffUtil;
import android.support.v7.widget.RecyclerView;
import android.text.SpannableString;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.haipq.android.flagkit.FlagImageView;

import java.util.List;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.network.model.VpnListEntity;
import sentinelgroup.io.sentinel.util.Convert;
import sentinelgroup.io.sentinel.util.Converter;
import sentinelgroup.io.sentinel.util.SpannableStringUtil;

public class VpnListAdapter extends RecyclerView.Adapter<VpnListAdapter.ViewHolder> {

    private OnItemClickListener mItemClickListener;

    private List<VpnListEntity> mData;
    private final Context mContext;


    public VpnListAdapter(OnItemClickListener iListener, Context iContext) {
        mItemClickListener = iListener;
        mContext = iContext;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        return new ViewHolder(LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_vpn, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        VpnListEntity aItemData = mData.get(position);
        holder.mTvLocation.setText(mContext.getString(R.string.vpn_location, aItemData.getLocation().city, aItemData.getLocation().country));
        // Set country flag
        holder.mFvFlag.setCountryCode(Converter.getCountryCode(aItemData.getLocation().country));
        // Construct and set - Bandwidth SpannableString
        String aBandwidthValue = mContext.getString(R.string.vpn_bandwidth_value, Convert.fromBitsPerSecond(aItemData.getNetSpeed().download, Convert.DataUnit.MBPS));
        String aBandwidth = mContext.getString(R.string.vpn_bandwidth, aBandwidthValue);
        SpannableString aStyledBandwidth = new SpannableStringUtil.SpannableStringUtilBuilder(aBandwidth, aBandwidthValue)
                .color(ContextCompat.getColor(mContext, R.color.colorTextWhite))
                .customStyle(Typeface.BOLD)
                .build();
        holder.mTvBandwidth.setText(aStyledBandwidth);
        // Construct and set - Price SpannableString
        String aPriceValue = mContext.getString(R.string.vpn_price_value, aItemData.getPricePerGb());
        String aPrice = mContext.getString(R.string.vpn_price, aPriceValue);
        SpannableString aStyledPrice = new SpannableStringUtil.SpannableStringUtilBuilder(aPrice, aPriceValue)
                .color(ContextCompat.getColor(mContext, R.color.colorTextWhite))
                .customStyle(Typeface.BOLD)
                .build();
        holder.mTvPrice.setText(aStyledPrice);
        // Construct and set - Latency SpannableString
        String aLatencyValue = mContext.getString(R.string.vpn_latency_value, aItemData.getLatency());
        String aLatency = mContext.getString(R.string.vpn_latency, aLatencyValue);
        SpannableString aStyleLatency = new SpannableStringUtil.SpannableStringUtilBuilder(aLatency, aLatencyValue)
                .color(ContextCompat.getColor(mContext, R.color.colorTextWhite))
                .customStyle(Typeface.BOLD)
                .build();
        holder.mTvLatency.setText(aStyleLatency);
        // Set listeners
        holder.mRootView.setOnClickListener(v -> onRootViewClick(aItemData));
        holder.mBtnConnect.setOnClickListener(v -> onConnectClick(aItemData.getAccountAddress()));
    }

    @Override
    public int getItemCount() {
        if (null == mData) return 0;
        return mData.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder {
        View mRootView;
        FlagImageView mFvFlag;
        TextView mTvLocation, mTvBandwidth, mTvPrice, mTvLatency;
        Button mBtnConnect;

        ViewHolder(View itemView) {
            super(itemView);
            mRootView = itemView.getRootView();
            mFvFlag = itemView.findViewById(R.id.fv_flag);
            mTvLocation = itemView.findViewById(R.id.tv_location);
            mTvBandwidth = itemView.findViewById(R.id.tv_bandwidth);
            mTvPrice = itemView.findViewById(R.id.tv_price);
            mTvLatency = itemView.findViewById(R.id.tv_latency);
            mBtnConnect = itemView.findViewById(R.id.btn_connect);
        }
    }

    public void loadData(List<VpnListEntity> iData) {
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
                    VpnListEntity aOldData = mData.get(oldItemPosition);
                    VpnListEntity aNewData = iData.get(newItemPosition);
                    return aOldData.getAccountAddress().equals(aNewData.getAccountAddress());
                }

                @Override
                public boolean areContentsTheSame(int oldItemPosition, int newItemPosition) {
                    VpnListEntity aOldData = mData.get(oldItemPosition);
                    VpnListEntity aNewData = iData.get(newItemPosition);
                    return aOldData.getLatency() == aNewData.getLatency()
                            && aOldData.getPricePerGb() == aNewData.getPricePerGb()
                            && aOldData.getNetSpeed().download == aNewData.getNetSpeed().download
                            && aOldData.getNetSpeed().upload == aNewData.getNetSpeed().upload;
                }
            });
            mData.clear();
            mData.addAll(iData);
            aResult.dispatchUpdatesTo(this);
        }
    }

    // Interface interaction method
    private void onRootViewClick(VpnListEntity iItemData) {
        if (mItemClickListener != null) {
            mItemClickListener.onRootViewClicked(iItemData);
        }
    }

    private void onConnectClick(String iVpnAddress) {
        if (mItemClickListener != null) {
            mItemClickListener.onConnectClicked(iVpnAddress);
        }
    }

    public interface OnItemClickListener {
        void onRootViewClicked(VpnListEntity iItemData);

        void onConnectClicked(String iVpnAddress);
    }
}
