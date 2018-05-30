package sentinelgroup.io.sentinel.util;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

public class Converter {
    public static String getFileSize(long size) {
        if (size <= 0)
            return "0 B";
        final String[] units = new String[]{"B", "KB", "MB", "GB", "TB"};
        int digitGroups = (int) (Math.log10(size) / Math.log10(1024));
        return new DecimalFormat("#,##0.#").format(size / Math.pow(1024, digitGroups)) + " " + units[digitGroups];
    }

    public static String getDuration(long seconds) {
        DecimalFormat df2 = new DecimalFormat(".##");
        double hours = seconds / (double) (60 * 60);
        double minutes = seconds / (double) 60;
        if (hours >= 1)
            return String.valueOf(df2.format(hours)) + (hours == 1 ? " hr" : " hrs");
        else if (minutes >= 1)
            return String.valueOf(df2.format(minutes)) + (minutes == 1 ? " min" : " mins");
        else
            return String.valueOf(seconds) + (seconds == 1 ? " sec" : " secs");
    }

    public static String getLongDuration(long seconds) {
        long day = TimeUnit.SECONDS.toDays(seconds);
        long hours = TimeUnit.SECONDS.toHours(seconds) - (day * 24);
        long minute = TimeUnit.SECONDS.toMinutes(seconds) - (TimeUnit.SECONDS.toHours(seconds) * 60);
        long second = TimeUnit.SECONDS.toSeconds(seconds) - (TimeUnit.SECONDS.toMinutes(seconds) * 60);
        if (day >= 1)
            return day + (day == 1 ? " day " : " days ")
                    + hours + (hours == 1 ? " hr " : " hrs ")
                    + minute + (minute == 1 ? " min " : " mins ")
                    + second + (second == 1 ? " sec" : " secs");
        else if (hours >= 1)
            return hours + (hours == 1 ? " hr " : " hrs ")
                    + minute + (minute == 1 ? " min " : " mins ")
                    + second + (second == 1 ? " sec" : " secs");
        else if (minute >= 1)
            return minute + (minute == 1 ? " min " : " mins ")
                    + second + (second == 1 ? " sec" : " secs");
        else
            return second + (second == 1 ? " sec" : " secs");
    }

    public static String convertEpochToDate(long time) {
        // Thu 11 May 2018    10:30:47 GMT
        String formatString = "EEE, dd MMM yyyy   HH:mm:ss z";
        SimpleDateFormat format = new SimpleDateFormat(formatString, Locale.getDefault());
        return format.format(new Date(time * 1000));

    }

    public static String getSentString(double iSentValue) {
        iSentValue /= Math.pow(10, 8);
        return String.format(Locale.getDefault(), iSentValue % 1 == 0 ? "%.0f" : "%.7f", iSentValue);
    }
}
