package co.sentinel.lite.util;

import android.support.annotation.NonNull;

import java.math.BigInteger;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
import java.util.concurrent.TimeUnit;

public class Converter {
    /**
     * Convert file size in bytes to other units on the go depending on the file size
     *
     * @param iSizeInBytes [long] The file size in bytes
     * @return The file size along with the unit as a String
     */
    public static String getFileSize(long iSizeInBytes) {
        if (iSizeInBytes <= 0)
            return "0 B";
        final String[] aUnits = new String[]{"B", "KB", "MB", "GB", "TB"};
        int aDigitGroups = (int) (Math.log10(iSizeInBytes) / Math.log10(1024));
        return new DecimalFormat("#,##0.#").format(iSizeInBytes / Math.pow(1024, aDigitGroups)) + " " + aUnits[aDigitGroups];
    }

    /**
     * Convert the input duration in seconds to hours/minutes/seconds format
     *
     * @param iSeconds [long] The input duration in seconds
     * @return A string which is represented in hours/minutes/seconds format
     */
    public static String getDuration(long iSeconds) {
        DecimalFormat df2 = new DecimalFormat(".#");
        double hours = iSeconds / (double) (60 * 60);
        double minutes = iSeconds / (double) 60;
        if (hours >= 1)
            return String.valueOf(df2.format(hours)) + (hours == 1 ? " hr" : " hrs");
        else if (minutes >= 1)
            return String.valueOf(df2.format(minutes)) + (minutes == 1 ? " min" : " mins");
        else
            return String.valueOf(iSeconds) + (iSeconds == 1 ? " sec" : " secs");
    }

    /**
     * Convert the input duration in seconds to days-hours-minutes-seconds format
     *
     * @param iSeconds [long] The input duration in seconds
     * @return A string which is represented in days-hours-minutes-seconds format
     */
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

    /**
     * Converts epoch time in seconds to a formatted date string
     *
     * @param iEpochTimeInSeconds [long] Epoch time in seconds
     * @return Formatted date string such as - Thu 11 May 2018    10:30:47 GMT
     */
    public static String convertEpochToDate(long iEpochTimeInSeconds) {
        String aFormatString = "EEE, dd MMM yyyy   HH:mm:ss z";
        SimpleDateFormat aFormat = new SimpleDateFormat(aFormatString, Locale.getDefault());
        return aFormat.format(new Date(iEpochTimeInSeconds * 1000));
    }

    /**
     * Extracts the ISO country code from the country name
     *
     * @param iCountryName [String] Country name (in English)
     * @return ISO country code
     */
    public static String getCountryCode(String iCountryName) {
        String[] isoCountryCodes = Locale.getISOCountries();
        for (String aCode : isoCountryCodes) {
            Locale locale = new Locale("", aCode);
            if (iCountryName.equalsIgnoreCase(locale.getDisplayCountry(Locale.US))) {
                return aCode;
            }
        }
        return "";
    }

    /**
     * Convert the Wallet address to a 64 bit address
     *
     * @param iAddress [String] The wallet address
     * @return 64bit Wallet address with zeros padded to its front
     */
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

    /**
     * Convert the hex data to a String
     *
     * @param iData [String] The hex data
     * @return Formatted String data
     */
    public static String convertHexToString(@NonNull String iData) {
        String s = iData.substring(2).replaceFirst("^0+(?!$)", "");
        return String.valueOf(Long.parseLong(s, 16));
    }

    /**
     * Converts the token value to a BigInteger which is required to process token transaction
     *
     * @param iValue [String] The token value
     * @return BigInteger token value which can be passed to the contract function for further
     * processing
     */
    public static BigInteger getTokenValue(String iValue) {
        return BigInteger.valueOf((long) (Double.parseDouble(iValue) * Math.pow(10, 8)));
    }

    /**
     * Converts the token value to a formatted string which can be displayed
     *
     * @param iSentValue [double] The token value
     * @return Formatted string
     */
    public static String getFormattedTokenString(double iSentValue) {
        iSentValue /= Math.pow(10, 8);
        return String.format(Locale.US, iSentValue % 1 == 0 ? "%.0f" : "%.8f", iSentValue);
    }

    public static String getFormattedTimeInUTC(String iZuluTime) {
        SimpleDateFormat aInputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
        aInputFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        SimpleDateFormat aOutputFormat = new SimpleDateFormat("EEE, dd MMM yyyy   HH:mm:ss z", Locale.US);
        String aFormattedDateString = null;
        try {
            aFormattedDateString = aOutputFormat.format(aInputFormat.parse(iZuluTime));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return aFormattedDateString;
    }
}