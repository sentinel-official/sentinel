package sentinelgroup.io.sentinel.util;

public class AppConstants {
    // Tag used for logging
    public static final String TAG = "SENTINEL_DEBUG";

    // Keys used in SharedPreference
    public static final String PREFS_ACCOUNT_ADDRESS = "prefs_account_address";
    public static final String PREFS_FILE_PATH = "prefs_file_path";
    public static final String PREFS_IS_APP_PIN_SET = "prefs_is_app_pin_set";
    public static final String PREFS_IS_FIRST_TIME = "prefs_is_first_time";
    public static final String PREFS_IS_TEST_NET_ACTIVE = "prefs_is_test_net_active";

    // Request codes
    public static final int REQ_CODE_FORGOT_PIN = 200;
    public static final int REQ_RESET_PIN = 201;

    // Other app constants
    public static final String FOLDER_NAME = "Sentinel";
    public static final String FILE_NAME = "keystore.file";
}