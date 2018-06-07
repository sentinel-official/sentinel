package sentinelgroup.io.sentinel.ui.adapter;

import android.content.Context;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.content.ContextCompat;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.fragment.VpnListFragment;
import sentinelgroup.io.sentinel.ui.fragment.VpnMapFragment;

public class VpnSelectPagerAdapter extends FragmentPagerAdapter {

    private final int TAB_TITLES[] = new int[]{R.string.view_list, R.string.view_map,};
    private Context mContext;

    public VpnSelectPagerAdapter(FragmentManager fm, Context iContext) {
        super(fm);
        mContext = iContext;
    }

    @Override
    public Fragment getItem(int position) {
        Fragment aFragment = null;
        switch (position) {
            case 0:
                aFragment = VpnListFragment.newInstance();
                break;
            case 1:
                aFragment = VpnMapFragment.newInstance("", "");
                break;
        }
        return aFragment;
    }

    @Override
    public int getCount() {
        return TAB_TITLES.length;
    }

    @Nullable
    @Override
    public CharSequence getPageTitle(int position) {
        return mContext.getString(TAB_TITLES[position]);
    }

    public View getTabView(int position) {
        View aView = LayoutInflater.from(mContext).inflate(R.layout.item_tab, null);
        TextView aTvTabItem = aView.findViewById(R.id.tv_tab_item);
        aTvTabItem.setBackground(ContextCompat.getDrawable(mContext, position == 0 ? R.drawable.selector_tab_item_left : R.drawable.selector_tab_item_right));
        aTvTabItem.setText(mContext.getString(TAB_TITLES[position]));
        return aView;
    }
}
