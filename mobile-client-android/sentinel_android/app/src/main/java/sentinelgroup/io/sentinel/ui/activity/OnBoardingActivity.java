package sentinelgroup.io.sentinel.ui.activity;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;

import com.tbuonomo.viewpagerdotsindicator.DotsIndicator;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.adapter.InfoPagerAdapter;
import sentinelgroup.io.sentinel.ui.custom.ZoomOutPageTransformer;

public class OnBoardingActivity extends AppCompatActivity {

    private ViewPager mVpInfoPager;
    private DotsIndicator mVpiInfoDots;
    private TextView mTvNext;

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
        mAdapter = new InfoPagerAdapter(getSupportFragmentManager(), this);
        mVpInfoPager.setAdapter(mAdapter);
        mVpInfoPager.setPageTransformer(true, new ZoomOutPageTransformer());
        mVpInfoPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
            }

            @Override
            public void onPageSelected(int position) {
                mTvNext.setVisibility(position == 1 ? View.VISIBLE : View.GONE);
            }

            @Override
            public void onPageScrollStateChanged(int state) {
            }
        });
        // setup DotsIndicator
        mVpiInfoDots.setDotsClickable(true);
        mVpiInfoDots.setViewPager(mVpInfoPager);
        // Set listeners
        mTvNext.setOnClickListener(v -> openLauncherActivity());
    }

    private void openLauncherActivity() {
        startActivity(new Intent(this, LauncherActivity.class));
        finish();
    }
}
