package sentinelgroup.io.sentinel.ui.adapter;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v4.view.PagerAdapter;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import sentinelgroup.io.sentinel.R;

public class VpnHelperPagerAdapter extends PagerAdapter {

    private LayoutInflater mLayoutInflater;
    private final int[] mResources;

    public VpnHelperPagerAdapter(Context iContext) {
        mLayoutInflater = (LayoutInflater) iContext.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        mResources = new int[]{R.drawable.ic_helper_1, R.drawable.ic_helper_2, R.drawable.ic_helper_3};
    }

    @Override
    public boolean isViewFromObject(@NonNull View view, @NonNull Object object) {
        return view == object;
    }

    @NonNull
    @Override
    public Object instantiateItem(@NonNull ViewGroup container, int position) {
        View itemView = mLayoutInflater.inflate(R.layout.item_helper, container, false);
        ImageView imageView = itemView.findViewById(R.id.iv_helper);
        imageView.setImageResource(mResources[position]);
        imageView.setScaleType(ImageView.ScaleType.FIT_XY);
        container.addView(itemView);
        return itemView;
    }

    @Override
    public void destroyItem(@NonNull ViewGroup container, int position, @NonNull Object object) {
        container.removeView((ImageView) object);
    }

    @Override
    public int getCount() {
        return mResources.length;
    }
}