package co.sentinel.sentinellite.ui.adapter;

import android.content.Context;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.content.ContextCompat;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;

import co.sentinel.sentinellite.R;
import co.sentinel.sentinellite.ui.fragment.Socks5ListFragment;
import co.sentinel.sentinellite.ui.fragment.VpnListFragment;

public class VpnSelectPagerAdapter extends FragmentPagerAdapter {

    private final int TAB_TITLES[] = new int[]{R.string.view_vpn_list, R.string.view_socks5_list,};
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
                aFragment = Socks5ListFragment.newInstance();
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
        TextView aTvTabItem = aView.findViewById(R.id.tv_tab_item);
        aTvTabItem.setBackground(ContextCompat.getDrawable(mContext, iPosition == 0 ? R.drawable.selector_tab_item_left : R.drawable.selector_tab_item_right));
        aTvTabItem.setText(mContext.getString(TAB_TITLES[iPosition]));
        return aView;
    }
}
