package sentinelgroup.io.sentinel.ui.adapter;

import android.content.Context;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.fragment.InfoFragment;

public class InfoPagerAdapter extends FragmentPagerAdapter {

    private Context mContext;

    public InfoPagerAdapter(FragmentManager fm, Context iContext) {
        super(fm);
        mContext = iContext;
    }

    @Override
    public int getCount() {
        return 2;
    }

    @Override
    public Fragment getItem(int position) {
        Fragment aFragment = null;
        switch (position) {
            case 0:
                aFragment = InfoFragment.newInstance(R.drawable.ic_info_referral, -1, R.string.info_title_1, R.string.info_desc_1);
                break;
            case 1:
                aFragment = InfoFragment.newInstance(R.drawable.menu_vpn_unselected, R.drawable.menu_wallet_unselected, R.string.info_title_2, R.string.info_desc_2);
                break;
        }
        return aFragment;
    }
}
