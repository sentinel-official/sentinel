package co.sentinel.sentinellite.ui.adapter;

import android.content.Context;
import android.graphics.Typeface;
import android.support.annotation.NonNull;
import android.support.v4.content.ContextCompat;
import android.support.v7.util.DiffUtil;
import android.support.v7.widget.AppCompatImageButton;
import android.support.v7.widget.RecyclerView;
import android.text.SpannableString;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import com.haipq.android.flagkit.FlagImageView;

import java.util.List;
import java.util.Locale;

import co.sentinel.sentinellite.R;
import co.sentinel.sentinellite.network.model.VpnListEntity;
import co.sentinel.sentinellite.util.AppConstants;
import co.sentinel.sentinellite.util.Convert;
import co.sentinel.sentinellite.util.Converter;
import co.sentinel.sentinellite.util.SpannableStringUtil;

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
        holder.mTvLocation.setText(aItemData.getLocation().country);
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
        String aEncryptionValue = aItemData.getEncryptionMethod();
        String aEncryption = mContext.getString(R.string.vpn_enc_method, aEncryptionValue);
        SpannableString aStyledEncryption = new SpannableStringUtil.SpannableStringUtilBuilder(aEncryption, aEncryptionValue)
                .color(ContextCompat.getColor(mContext, R.color.colorTextWhite))
                .customStyle(Typeface.BOLD)
                .build();
        holder.mTvEncMethod.setText(aStyledEncryption);
        // Construct and set - Latency SpannableString
        String aLatencyValue = mContext.getString(R.string.vpn_latency_value, aItemData.getLatency());
        String aLatency = mContext.getString(R.string.vpn_latency, aLatencyValue);
        SpannableString aStyleLatency = new SpannableStringUtil.SpannableStringUtilBuilder(aLatency, aLatencyValue)
                .color(ContextCompat.getColor(mContext, R.color.colorTextWhite))
                .customStyle(Typeface.BOLD)
                .build();
        holder.mTvLatency.setText(aStyleLatency);
        // Construct and set - Node Version SpannableString
        String aVersion = mContext.getString(R.string.vpn_node_version, aItemData.getVersion());
        SpannableString aStyleVersion = new SpannableStringUtil.SpannableStringUtilBuilder(aVersion, aItemData.getVersion())
                .color(ContextCompat.getColor(mContext, R.color.colorTextWhite))
                .customStyle(Typeface.BOLD)
                .build();
        holder.mTvNodeVersion.setText(aStyleVersion);
        // Construct and set - Node Rating SpannableString
        String aRatingValue;
        if (aItemData.getRating() == 0.0) {
            aRatingValue = "N/A";
        } else {
            aRatingValue = String.format(Locale.getDefault(), "%.1f / %.1f", aItemData.getRating(), AppConstants.MAX_NODE_RATING);
        }
        String aRating = mContext.getString(R.string.vpn_node_rating, aRatingValue);
        SpannableString aStyleRating = new SpannableStringUtil.SpannableStringUtilBuilder(aRating, aRatingValue)
                .color(ContextCompat.getColor(mContext, R.color.colorTextWhite))
                .customStyle(Typeface.BOLD)
                .build();
        holder.mTvNodeRating.setText(aStyleRating);
        holder.mIbBookmark.setImageResource(aItemData.isBookmarked() ? R.drawable.ic_bookmark_active : R.drawable.ic_bookmark_inactive);
    }

    @Override
    public int getItemCount() {
        if (null == mData) return 0;
        return mData.size();
    }

    class ViewHolder extends RecyclerView.ViewHolder {
        View mRootView;
        FlagImageView mFvFlag;
        TextView mTvLocation, mTvBandwidth, mTvEncMethod, mTvLatency, mTvNodeVersion, mTvNodeRating;
        Button mBtnConnect;
        AppCompatImageButton mIbBookmark;

        ViewHolder(View itemView) {
            super(itemView);
            mRootView = itemView.getRootView();
            mFvFlag = itemView.findViewById(R.id.fv_flag);
            mTvLocation = itemView.findViewById(R.id.tv_location);
            mTvBandwidth = itemView.findViewById(R.id.tv_bandwidth);
            mTvEncMethod = itemView.findViewById(R.id.tv_enc_method);
            mTvLatency = itemView.findViewById(R.id.tv_latency);
            mTvNodeVersion = itemView.findViewById(R.id.tv_node_version);
            mTvNodeRating = itemView.findViewById(R.id.tv_node_rating);
            mBtnConnect = itemView.findViewById(R.id.btn_connect);
            mIbBookmark = itemView.findViewById(R.id.ib_bookmark);

            // Set listeners
            mRootView.setOnClickListener(v -> onRootViewClick(mData.get(getAdapterPosition())));
            mBtnConnect.setOnClickListener(v -> onConnectClick(mData.get(getAdapterPosition()).getAccountAddress()));
            mIbBookmark.setOnClickListener(v -> onBookmarkClicked(mData.get(getAdapterPosition())));
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

    private void onBookmarkClicked(VpnListEntity iItemData) {
        if (mItemClickListener != null) {
            mItemClickListener.onBookmarkClicked(iItemData);
            iItemData.setBookmarked(!iItemData.isBookmarked());
            notifyDataSetChanged();
        }
    }

    public interface OnItemClickListener {
        void onRootViewClicked(VpnListEntity iItemData);

        void onConnectClicked(String iVpnAddress);

        void onBookmarkClicked(VpnListEntity iItemData);
    }
}
