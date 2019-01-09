package co.sentinel.sentinellite.util;

public class AppConstants {
    // Tag used for logging
    public static final String TAG = "SENTINEL_LITE_DEBUG";

    // Keys used in SharedPreference
    public static final String PREFS_IS_NEW_DEVICE = "prefs_is_new_device";
    public static final String PREFS_IS_INFO_SHOWN = "prefs_is_info_shown";
    public static final String PREFS_IS_HELPER_SHOWN = "is_helper_shown";
    public static final String PREFS_CONFIG_PATH = "prefs_config_path";
    public static final String PREFS_VPN_ADDRESS = "prefs_vpn_address";
    public static final String PREFS_CONNECTION_START_TIME = "prefs_connection_start_time_in_millis";
    public static final String PREFS_IP_ADDRESS = "prefs_ip_address";
    public static final String PREFS_SELECTED_LANGUAGE_CODE = "prefs_selected_language";
    public static final String PREFS_REF_ID = "prefs_ref_id";
    public static final String PREFS_FILE_URL = "prefs_file_url";
    public static final String PREFS_FILE_NAME = "prefs_file_name";

    // Request codes
    public static final int REQ_CODE_NULL = -1;
    public static final int REQ_CODE_PERMISSION = 100;
    public static final int REQ_LANGUAGE = 200;
    public static final int REQ_VPN_CONNECT = 201;
    public static final int REQ_HELPER_SCREENS = 202;

    // EXTRA used in Intent
    public static final String EXTRA_NOTIFICATION_ACTIVITY = "notification_activity";
    public static final String EXTRA_VPN_LIST = "vpn_list";
    public static final String EXTRA_REQ_CODE = "req_code";

    // Fragment Tags
    public static final String TAG_PROGRESS_DIALOG = "co.sentinel.sentinellite.progress_dialog";
    public static final String TAG_SINGLE_ACTION_DIALOG = "co.sentinel.sentinellite.single_action_dialog";
    public static final String TAG_DOUBLE_ACTION_DIALOG = "co.sentinel.sentinellite.double_action_dialog";
    public static final String TAG_ERROR = "error";
    public static final String TAG_UPDATE = "update";
    public static final String TAG_DOWNLOAD = "download";

    // Error Constants
    public static final String ERROR_GENERIC = "error_generic";
    public static final String ERROR_VERSION_FETCH = "error_version_undefined";

    // Other app constants
    public static final int VALUE_DEFAULT = -1;
    public static final int REFERRAL_CODE_LENGHT = 13;
    public static final String CONFIG_NAME = "client.ovpn";
    public static final String URL_BUILDER = "http://%1s:%d/ovpn";
    public static final String HOME = "home";
}