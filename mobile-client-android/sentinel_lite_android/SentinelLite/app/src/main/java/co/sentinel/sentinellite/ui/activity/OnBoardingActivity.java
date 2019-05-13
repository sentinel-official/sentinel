package co.sentinel.sentinellite.ui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;

import com.tbuonomo.viewpagerdotsindicator.DotsIndicator;

import java.util.ArrayList;

import co.sentinel.sentinellite.R;
import co.sentinel.sentinellite.network.model.OnBoardingInfo;
import co.sentinel.sentinellite.ui.adapter.InfoPagerAdapter;
import co.sentinel.sentinellite.ui.custom.ZoomOutPageTransformer;

public class OnBoardingActivity extends AppCompatActivity {

    private ViewPager mVpInfoPager;
    private DotsIndicator mVpiInfoDots;
    private TextView mTvNext;
    private ArrayList<OnBoardingInfo> mList = new ArrayList<>();

    private InfoPagerAdapter mAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_on_boarding);
        initView();
    }

    /*
     * Instantiate all the views used in the XML and perform other instantiation steps (if needed)
     */
    private void initView() {
        mVpInfoPager = findViewById(R.id.vp_info_pager);
        mVpiInfoDots = findViewById(R.id.vpi_info_dots);
        mTvNext = findViewById(R.id.btn_next);
        // setup viewpager and its adapter
        initList();
        mAdapter = new InfoPagerAdapter(getSupportFragmentManager(), this, mList);
        mVpInfoPager.setAdapter(mAdapter);
        mVpInfoPager.setPageTransformer(true, new ZoomOutPageTransformer());
        // setup DotsIndicator
        mVpiInfoDots.setVisibility(mList.size() > 1 ? View.VISIBLE : View.GONE);
        mVpiInfoDots.setDotsClickable(true);
        mVpiInfoDots.setViewPager(mVpInfoPager);
        // Set listeners
        mTvNext.setOnClickListener(v -> {
            openLauncherActivity();
        });
    }

    private void initList() {
        mList.add(new OnBoardingInfo(R.drawable.ic_info_vpn, R.string.info_title_2, R.string.info_desc_2));
    }

    private void openLauncherActivity() {
        startActivity(new Intent(this, DeviceRegisterActivity.class));
        finish();
    }
}
