package sentinelgroup.io.sentinel.ui.activity;

import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import com.tbuonomo.viewpagerdotsindicator.WormDotsIndicator;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.adapter.VpnHelperPagerAdapter;
import sentinelgroup.io.sentinel.ui.custom.FadePageTransformer;

public class HelperActivity extends AppCompatActivity implements ViewPager.OnPageChangeListener, View.OnClickListener {
    private ViewPager mVpHelperPager;
    private WormDotsIndicator mVpiIndicator;
    private Button mBtnNext;

    private VpnHelperPagerAdapter mAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_helper);
        getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        initView();
    }

    @Override
    public void onBackPressed() {
        // disables back press
    }

    /*
     * Instantiate all the views used in the XML and perform other instantiation steps (if needed)
     */
    private void initView() {
        mVpHelperPager = findViewById(R.id.vp_helper_pager);
        mVpiIndicator = findViewById(R.id.vpi_helper_dots);
        mBtnNext = findViewById(R.id.btn_next);
        // instantiate ViewPager and ViewPager Indicator
        setupViewPager();
        // add listeners
        mBtnNext.setOnClickListener(this);
    }

    /*
     * Instantiate the ViewPager and set an adapter to it. Also, add the ViewPagerIndicator to the
     * ViewPager
     */
    private void setupViewPager() {
        // Setup ViewPagerAdapter and ViewPager
        mAdapter = new VpnHelperPagerAdapter(this);
        mVpHelperPager.setAdapter(mAdapter);
        mVpHelperPager.setOffscreenPageLimit(2);
        mVpHelperPager.setPageTransformer(false, new FadePageTransformer());
        mVpHelperPager.addOnPageChangeListener(this);
        // setup WormDotsIndicator
        mVpiIndicator.setDotsClickable(true);
        mVpiIndicator.setViewPager(mVpHelperPager);
    }

    // Listener implementations
    @Override
    public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {
    }

    @Override
    public void onPageScrollStateChanged(int state) {
    }

    @Override
    public void onPageSelected(int position) {
        mBtnNext.setText(position == mAdapter.getCount() - 1 ? R.string.got_it : R.string.next);
    }

    @Override
    public void onClick(View v) {
        if (mBtnNext.getText().toString().trim().equals(getString(R.string.got_it))) {
            setResult(RESULT_OK);
            finish();
        } else {
            mVpHelperPager.setCurrentItem(mVpHelperPager.getCurrentItem() + 1, true);
        }
    }
}