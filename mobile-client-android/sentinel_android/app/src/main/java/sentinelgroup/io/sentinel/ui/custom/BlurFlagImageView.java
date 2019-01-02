package sentinelgroup.io.sentinel.ui.custom;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.renderscript.Allocation;
import android.renderscript.Element;
import android.renderscript.RenderScript;
import android.renderscript.ScriptIntrinsicBlur;
import android.support.v7.widget.AppCompatImageView;
import android.util.AttributeSet;
import android.util.Log;

import com.haipq.android.flagkit.FlagImageView;

import java.util.Locale;

import sentinelgroup.io.sentinel.R;


public class BlurFlagImageView extends AppCompatImageView {
    private static final String TAG = FlagImageView.class.getCanonicalName();
    private String countryCode;

    public BlurFlagImageView(Context context) {
        super(context);
        this.init(null);
    }

    public BlurFlagImageView(Context context, AttributeSet attrs) {
        super(context, attrs);
        this.init(attrs);
    }

    public BlurFlagImageView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        this.init(attrs);
    }

    private void init(AttributeSet attrs) {
        super.setScaleType(ScaleType.CENTER_CROP);
        super.setAdjustViewBounds(true);
        if (!this.isInEditMode()) {
            if (attrs != null) {
                TypedArray typedArray = this.getContext().obtainStyledAttributes(attrs, R.styleable.BlurFlagImageView, 0, 0);

                try {
                    String countryCode = typedArray.getString(R.styleable.BlurFlagImageView_countryCode);
                    if (countryCode != null && !countryCode.isEmpty()) {
                        this.setCountryCode(countryCode);
                    } else {
                        this.defaultLocal();
                    }
                } finally {
                    typedArray.recycle();
                }
            }

        }
    }

    /**
     * @deprecated
     */
    @Deprecated
    public void setScaleType(ScaleType scaleType) {
    }

    /**
     * @deprecated
     */
    @Deprecated
    public void setAdjustViewBounds(boolean adjustViewBounds) {
    }

    public void defaultLocal() {
        this.setCountryCode(Locale.getDefault().getCountry());
        Log.d(TAG, " defaultLocal " + Locale.getDefault().getCountry());
    }

    public String getCountryCode() {
        return this.countryCode;
    }

    public void setCountryCode(String countryCode) {
        countryCode = countryCode != null && !countryCode.isEmpty() ? countryCode.toLowerCase() : "";
        if (!countryCode.equals(this.countryCode)) {
            this.countryCode = countryCode;
            this.updateDrawableWithCountryCode();
        }
    }

    public void setCountryCode(Locale locale) {
        this.setCountryCode(locale.getCountry());
    }

    private void updateDrawableWithCountryCode() {
        if (this.countryCode.isEmpty()) {
            this.setImageResource(0);
        } else {
            Resources resources = this.getResources();
            String resName = "flag_" + this.countryCode;
            int resourceId = resources.getIdentifier(resName, "drawable", this.getContext().getPackageName());
            if (resourceId == 0) {
                Log.w(TAG, " CountryCode is Wrong ");
            }

            BitmapDrawable drawable = (BitmapDrawable) getResources().getDrawable(resourceId);
            this.setImageBitmap(blurRenderScript(this.getContext(), drawable.getBitmap(), 5));

        }
    }

    @SuppressLint("NewApi")
    public static Bitmap blurRenderScript(Context context, Bitmap smallBitmap, int radius) {
        try {
            smallBitmap = RGB565toARGB888(smallBitmap);
        } catch (Exception e) {
            e.printStackTrace();
        }

        Bitmap bitmap = Bitmap.createBitmap(
                smallBitmap.getWidth(), smallBitmap.getHeight(),
                Bitmap.Config.ARGB_8888);

        RenderScript renderScript = RenderScript.create(context);

        Allocation blurInput = Allocation.createFromBitmap(renderScript, smallBitmap);
        Allocation blurOutput = Allocation.createFromBitmap(renderScript, bitmap);

        ScriptIntrinsicBlur blur = ScriptIntrinsicBlur.create(renderScript,
                Element.U8_4(renderScript));
        blur.setInput(blurInput);
        blur.setRadius(radius); // radius must be 0 < r <= 25
        blur.forEach(blurOutput);

        blurOutput.copyTo(bitmap);
        renderScript.destroy();

        return bitmap;

    }

    private static Bitmap RGB565toARGB888(Bitmap img) throws Exception {
        int numPixels = img.getWidth() * img.getHeight();
        int[] pixels = new int[numPixels];

        //Get JPEG pixels.  Each int is the color values for one pixel.
        img.getPixels(pixels, 0, img.getWidth(), 0, 0, img.getWidth(), img.getHeight());

        //Create a Bitmap of the appropriate format.
        Bitmap result = Bitmap.createBitmap(img.getWidth(), img.getHeight(), Bitmap.Config.ARGB_8888);

        //Set RGB pixels.
        result.setPixels(pixels, 0, result.getWidth(), 0, 0, result.getWidth(), result.getHeight());
        return result;
    }

}
