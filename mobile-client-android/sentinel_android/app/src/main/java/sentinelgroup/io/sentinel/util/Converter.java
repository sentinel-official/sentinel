package sentinelgroup.io.sentinel.util;

import android.support.annotation.NonNull;

import java.math.BigInteger;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

public class Converter {
    public static String getFileSize(long iSizeInBytes) {
        if (iSizeInBytes <= 0)
            return "0 B";
        final String[] units = new String[]{"B", "KB", "MB", "GB", "TB"};
        int digitGroups = (int) (Math.log10(iSizeInBytes) / Math.log10(1024));
        return new DecimalFormat("#,##0.#").format(iSizeInBytes / Math.pow(1024, digitGroups)) + " " + units[digitGroups];
    }

    public static String getDuration(long iSeconds) {
        DecimalFormat df2 = new DecimalFormat(".##");
        double hours = iSeconds / (double) (60 * 60);
        double minutes = iSeconds / (double) 60;
        if (hours >= 1)
            return String.valueOf(df2.format(hours)) + (hours == 1 ? " hr" : " hrs");
        else if (minutes >= 1)
            return String.valueOf(df2.format(minutes)) + (minutes == 1 ? " min" : " mins");
        else
            return String.valueOf(iSeconds) + (iSeconds == 1 ? " sec" : " secs");
    }

    public static String getLongDuration(long iSeconds) {
        long day = TimeUnit.SECONDS.toDays(iSeconds);
        long hours = TimeUnit.SECONDS.toHours(iSeconds) - (day * 24);
        long minute = TimeUnit.SECONDS.toMinutes(iSeconds) - (TimeUnit.SECONDS.toHours(iSeconds) * 60);
        long second = TimeUnit.SECONDS.toSeconds(iSeconds) - (TimeUnit.SECONDS.toMinutes(iSeconds) * 60);
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

    public static String convertEpochToDate(long iEpochTimeInSeconds) {
        // Thu 11 May 2018    10:30:47 GMT
        String formatString = "EEE, dd MMM yyyy   HH:mm:ss z";
        SimpleDateFormat format = new SimpleDateFormat(formatString, Locale.US);
        return format.format(new Date(iEpochTimeInSeconds * 1000));

    }

    public static String getSentString(double iSentValue) {
        iSentValue /= Math.pow(10, 8);
        return String.format(Locale.US, iSentValue % 1 == 0 ? "%.0f" : "%.8f", iSentValue);
    }

    public static String getCountryCode(String iCountryName) {
        String[] isoCountryCodes = Locale.getISOCountries();
        for (String code : isoCountryCodes) {
            Locale locale = new Locale("", code);
            if (iCountryName.equalsIgnoreCase(locale.getDisplayCountry(Locale.US))) {
                return code;
            }
        }
        return "";
    }

    public static BigInteger getTokenValue(String iValue) {
        return BigInteger.valueOf((long) (Double.parseDouble(iValue) * Math.pow(10, 8)));
    }

    public static String get64bitAddress(String iAddress) {
        int requiredLength = 64;
        char padChar = '0';
        if (iAddress.length() > requiredLength) {
            return iAddress;
        } else {
            String aAddress = new String(new char[requiredLength - iAddress.length()]).replace('\0', padChar) + iAddress;
            return "0x" + aAddress;
        }
    }

    public static String convertHexToString(@NonNull String iData) {
        String s = iData.substring(2).replaceFirst("^0+(?!$)", "");
        return String.valueOf(Long.parseLong(s, 16));
    }


    public static String getFormattedSentBalance(double iSentValue) {
        iSentValue /= Math.pow(10, 8);
        return String.format(Locale.US, iSentValue % 1 == 0 ? "%.0f" : "%.7f", iSentValue);
    }
}