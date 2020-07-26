package co.sentinel.lite.ui.adapter;

import android.content.Context;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.view.LayoutInflater;
import android.view.View;

import co.sentinel.lite.R;
import co.sentinel.lite.ui.fragment.VpnFragment;
import co.sentinel.lite.ui.fragment.VpnUsageFragment;

public class VpnSelectAdapter extends FragmentPagerAdapter {

    private final int TAB_TITLES[] = new int[]{R.string.view_vpn_list, R.string.usage};
    private Context mContext;

    public VpnSelectAdapter(FragmentManager fm, Context iContext) {
        super(fm);
        mContext = iContext;
    }

    @Override
    public Fragment getItem(int position) {
        Fragment aFragment = null;
        switch (position) {
            case 0:
                aFragment = VpnFragment.newInstance();
                break;
            case 1:
                aFragment = VpnUsageFragment.newInstance();
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

    /**
     * Customize the Tab item background based on the position/index of the data
     *
     * @param iPosition [int] Position of the data
     * @return [View] The customised view for the item which is to be displayed
     */
    public View getTabView(int iPosition) {
        View aView = LayoutInflater.from(mContext).inflate(R.layout.item_tab, null);
        return aView;
    }
}
