package co.sentinel.lite.ui.activity;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.TextView;

import com.tbuonomo.viewpagerdotsindicator.DotsIndicator;

import java.util.ArrayList;

import co.sentinel.lite.R;
import co.sentinel.lite.network.model.OnBoardingInfo;
import co.sentinel.lite.ui.adapter.InfoAdapter;
import co.sentinel.lite.ui.custom.ZoomOutPageTransformer;

public class OnBoardingActivity extends AppCompatActivity {

    private ViewPager mVpInfoPager;
    private DotsIndicator mVpiInfoDots;
    private TextView mTvNext,mTvWebsite;
    private ArrayList<OnBoardingInfo> mList = new ArrayList<>();
    int pagenum;
    private InfoAdapter mAdapter;

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
        mTvWebsite = findViewById(R.id.btn_website);
        //link to website
        Intent socialIntent = new Intent();
        socialIntent.setAction(Intent.ACTION_VIEW);
        socialIntent.addCategory(Intent.CATEGORY_BROWSABLE);
        // setup viewpager and its adapter
        initList();
        mAdapter = new InfoAdapter(getSupportFragmentManager(), this, mList);
        mVpInfoPager.setAdapter(mAdapter);
        mVpInfoPager.setPageTransformer(true, new ZoomOutPageTransformer());
        // setup DotsIndicator
        mVpiInfoDots.setVisibility(mList.size() > 1 ? View.VISIBLE : View.GONE);
        mVpiInfoDots.setDotsClickable(true);
        mVpiInfoDots.setViewPager(mVpInfoPager);
        pagenum = 0;
        // Set listeners
        mTvNext.setOnClickListener(v -> {
            if(pagenum<4){
                pagenum+=1;
                mVpInfoPager.setCurrentItem(pagenum);
            }else{
                openLauncherActivity();
            }
        });

        mTvWebsite.setOnClickListener(v -> {
            socialIntent.setData(Uri.parse(getString(R.string.website_url)));
            startActivity(socialIntent);
        });

        mVpInfoPager.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int i, float v, int i1) {

            }

            @Override
            public void onPageSelected(int i) {
            pagenum=i;
            }

            @Override
            public void onPageScrollStateChanged(int i) {

            }
        });
    }

    private void initList() {
        mList.add(new OnBoardingInfo(R.drawable.info1, R.string.info_title_1, R.string.info_desc_1));
        mList.add(new OnBoardingInfo(R.drawable.info2, R.string.info_title_2, R.string.info_desc_2));
        mList.add(new OnBoardingInfo(R.drawable.info3, R.string.info_title_3, R.string.info_desc_3));
        mList.add(new OnBoardingInfo(R.drawable.info4, R.string.info_title_4, R.string.info_desc_4));
        mList.add(new OnBoardingInfo(R.drawable.info5, R.string.info_title_5, R.string.info_desc_5));
    }

    private void openLauncherActivity() {
        startActivity(new Intent(this, DeviceRegisterActivity.class));
        finish();
    }
}
