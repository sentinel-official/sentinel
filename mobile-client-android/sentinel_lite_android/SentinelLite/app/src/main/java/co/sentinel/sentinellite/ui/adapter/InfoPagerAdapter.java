package co.sentinel.sentinellite.ui.adapter;

import android.content.Context;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

import co.sentinel.sentinellite.R;
import co.sentinel.sentinellite.ui.fragment.InfoFragment;

public class InfoPagerAdapter extends FragmentPagerAdapter {

    private Context mContext;

    public InfoPagerAdapter(FragmentManager fm, Context iContext) {
        super(fm);
        mContext = iContext;
    }

    @Override
    public int getCount() {
        return 1;
    }

    @Override
    public Fragment getItem(int position) {
        Fragment aFragment = null;
        switch (position) {
            case 0:
                aFragment = InfoFragment.newInstance(R.drawable.ic_info_vpn, R.string.info_title_2, R.string.info_desc_2);
                break;
        }
        return aFragment;
    }
}
