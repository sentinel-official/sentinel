package sentinelgroup.io.sentinel.ui.activity;

import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import com.github.vivchar.viewpagerindicator.ViewPagerIndicator;

import sentinelgroup.io.sentinel.R;
import sentinelgroup.io.sentinel.ui.adapter.VpnHelperPagerAdapter;
import sentinelgroup.io.sentinel.ui.custom.PageFadeTransformer;

public class HelperActivity extends AppCompatActivity implements ViewPager.OnPageChangeListener, View.OnClickListener {
    private ViewPager mVpHelper;
    private ViewPagerIndicator mVpiIndicator;
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
        mVpHelper = findViewById(R.id.vp_helper);
        mVpiIndicator = findViewById(R.id.vpi_indicator);
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
        mAdapter = new VpnHelperPagerAdapter(this);
        mVpHelper.setAdapter(mAdapter);
        mVpHelper.setOffscreenPageLimit(2);
        mVpHelper.setPageTransformer(false, new PageFadeTransformer());
        mVpiIndicator.setupWithViewPager(mVpHelper);
        mVpiIndicator.addOnPageChangeListener(this);
    }

    // Listener implementations
    @Override
    public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {}

    @Override
    public void onPageScrollStateChanged(int state) {}

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
            mVpHelper.setCurrentItem(mVpHelper.getCurrentItem() + 1, true);
        }
    }
}