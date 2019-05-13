package co.sentinel.sentinellite.ui.adapter;

import android.content.Context;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;

import java.util.ArrayList;

import co.sentinel.sentinellite.network.model.OnBoardingInfo;
import co.sentinel.sentinellite.ui.fragment.InfoFragment;

public class InfoPagerAdapter extends FragmentPagerAdapter {

    private Context mContext;
    private ArrayList<OnBoardingInfo> mList;

    public InfoPagerAdapter(FragmentManager fm, Context iContext, ArrayList<OnBoardingInfo> iList) {
        super(fm);
        mContext = iContext;
        this.mList = iList;
    }

    @Override
    public int getCount() {
        return mList.size();
    }

    @Override
    public Fragment getItem(int position) {
        Fragment aFragment = InfoFragment.newInstance(mList.get(position));
        return aFragment;
    }
}
