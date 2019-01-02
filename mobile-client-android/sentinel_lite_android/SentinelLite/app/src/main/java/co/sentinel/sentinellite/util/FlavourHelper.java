package co.sentinel.sentinellite.util;

import co.sentinel.sentinellite.BuildConfig;

public class FlavourHelper {

    private static final String FLAVOUR_LANG_ALL = "langAll";
    private static final String FLAVOUR_LANG_TURKISH = "langTurkish";

    private static final String CODE_LANG_ALL = "en";
    private static final String CODE_LANG_TURKISH = "tr";

    public static boolean isMainFlavour() {
        return BuildConfig.FLAVOR.equals(FLAVOUR_LANG_ALL);
    }

    public static String getDefaultLanguageCode() {

        if (BuildConfig.FLAVOR.equals(FLAVOUR_LANG_TURKISH)) {
            return CODE_LANG_TURKISH;
        }

        return CODE_LANG_ALL;
    }
}
