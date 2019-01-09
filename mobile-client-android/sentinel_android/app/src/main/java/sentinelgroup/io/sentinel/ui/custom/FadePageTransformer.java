package sentinelgroup.io.sentinel.ui.custom;

import android.support.annotation.NonNull;
import android.support.v4.view.ViewPager;
import android.view.View;

/**
 * A custom page transformer for the helper screens (Alpha + Translation)
 */
public class FadePageTransformer implements ViewPager.PageTransformer {

    @Override
    public void transformPage(@NonNull View view, float position) {
        if (position <= -1.0F || position >= 1.0F) {
            view.setTranslationX(view.getWidth() * position);
            view.setAlpha(0.0F);
        } else if (position == 0.0F) {
            view.setTranslationX(view.getWidth() * position);
            view.setAlpha(1.0F);
        } else {
            // position is between -1.0F & 0.0F OR 0.0F & 1.0F
            view.setTranslationX(view.getWidth() * -position);
            view.setAlpha(1.0F - Math.abs(position));
        }
    }
}
