package co.sentinel.sentinellite.util;

import android.graphics.Color;
import android.graphics.Typeface;
import android.text.SpannableString;
import android.text.style.ForegroundColorSpan;
import android.text.style.RelativeSizeSpan;
import android.text.style.StyleSpan;
import android.text.style.UnderlineSpan;

public class SpannableStringUtil {
    private String string;
    private int startIndex;
    private int endIndex;
    private float relativeSize;
    private int customStyle;
    private boolean isUnderline;
    private int color;

    public SpannableStringUtil(SpannableStringUtilBuilder iBuilder) {
        string = iBuilder.string;
        startIndex = iBuilder.startIndex;
        endIndex = iBuilder.endIndex;
        relativeSize = iBuilder.relativeSize;
        customStyle = iBuilder.customStyle;
        isUnderline = iBuilder.isUnderline;
        color = iBuilder.color;
    }

    // Getter methods
    public String getInputString() {
        return string;
    }

    public int getStartIndex() {
        return startIndex;
    }

    public int getEndIndex() {
        return endIndex;
    }

    public float getRelativeSize() {
        return relativeSize;
    }

    public int getCustomStyle() {
        return customStyle;
    }

    public boolean isUnderline() {
        return isUnderline;
    }

    public int getColor() {
        return color;
    }

    public static class SpannableStringUtilBuilder {
        private String string = null;
        private int startIndex = 0;
        private int endIndex = 0;
        private float relativeSize = 1f;
        private int customStyle = Typeface.NORMAL;
        private boolean isUnderline = false;
        private int color = Color.TRANSPARENT;

        /**
         * Builds a styled string based on the styling params provided.
         *
         * @param string    the entire input string
         * @param subString the sub-string which is to be styled
         */
        public SpannableStringUtilBuilder(String string, String subString) {
            this.string = string;
            this.startIndex = string.indexOf(subString);
            this.endIndex = string.length();
        }

        public SpannableStringUtilBuilder relativeSize(float relativeSize) {
            this.relativeSize = relativeSize;
            return this;
        }

        public SpannableStringUtilBuilder customStyle(int customStyle) {
            this.customStyle = customStyle;
            return this;
        }

        public SpannableStringUtilBuilder underline(boolean underline) {
            isUnderline = underline;
            return this;
        }

        public SpannableStringUtilBuilder color(int color) {
            this.color = color;
            return this;
        }

        public SpannableString build() {
            SpannableString aSpannableString = new SpannableString(string);
            if (relativeSize != 1f)
                aSpannableString.setSpan(new RelativeSizeSpan(relativeSize), startIndex, endIndex, 0);
            if (customStyle != Typeface.NORMAL)
                aSpannableString.setSpan(new StyleSpan(customStyle), startIndex, endIndex, 0);
            if (isUnderline)
                aSpannableString.setSpan(new UnderlineSpan(), startIndex, endIndex, 0);
            if (color != Color.TRANSPARENT)
                aSpannableString.setSpan(new ForegroundColorSpan(color), startIndex, endIndex, 0);
            return aSpannableString;
        }
    }
}
