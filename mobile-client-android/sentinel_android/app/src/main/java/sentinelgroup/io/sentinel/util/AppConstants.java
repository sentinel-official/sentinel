package sentinelgroup.io.sentinel.util;

public class AppConstants {
    // Tag used for logging
    public static final String TAG = "SENTINEL_DEBUG";

    // Keys used in SharedPreference
    public static final String PREFS_CLEAR_DB = "prefs_clear_db";
    public static final String PREFS_IS_INFO_SHOWN = "prefs_is_info_shown";
    public static final String PREFS_ACCOUNT_ADDRESS = "prefs_account_address";
    public static final String PREFS_FILE_PATH = "prefs_file_path";
    public static final String PREFS_CONFIG_PATH = "prefs_config_path";
    public static final String PREFS_IS_APP_PIN_SET = "prefs_is_app_pin_set";
    public static final String PREFS_IS_FREE_TOKEN_RECEIVED = "prefs_is_free_token_received";
    public static final String PREFS_IS_TEST_NET_ACTIVE = "prefs_is_test_net_active";
    public static final String PREFS_VPN_ADDRESS = "prefs_vpn_address";
    public static final String PREFS_SESSION_NAME = "prefs_session_name";
    public static final String PREFS_CONNECTION_START_TIME = "prefs_connection_start_time_in_millis";
    public static final String PREFS_GAS_NORMAL = "prefs_standard";
    public static final String PREFS_GAS_FAST = "prefs_fast";
    public static final String PREFS_GAS_FASTEST = "prefs_fastest";
    public static final String PREFS_IP_ADDRESS = "prefs_ip_address";
    public static final String PREFS_IP_PORT = "prefs_ip_port";
    public static final String PREFS_VPN_TOKEN = "prefs_vpn_token";
    public static final String PREFS_IS_HELPER_SHOWN = "is_helper_shown";
    public static final String PREFS_SELECTED_LANGUAGE_CODE = "selected_language";
    public static final String PREFS_REF_ID = "prefs_ref_id";
    public static final String PREFS_BRANCH_REFERRER_ID = "prefs_branch_referrer_id";

    // Request codes
    public static final int REQ_CODE_NULL = -1;
    public static final int REQ_TX_HISTORY = 100;
    public static final int REQ_VPN_HISTORY = 101;
    public static final int REQ_RESET_PIN = 102;
    public static final int REQ_LANGUAGE = 105;
    public static final int REQ_CODE_FORGOT_PIN = 105;
    public static final int REQ_VPN_CONNECT = 106;
    public static final int REQ_VPN_PAY = 107;
    public static final int REQ_VPN_INIT_PAY = 108;
    public static final int REQ_HELPER_SCREENS = 109;

    // EXTRA used in Intent
    public static final String EXTRA_IS_VPN_PAY = "is_vpn_pay";
    public static final String EXTRA_IS_INIT = "is_init";
    public static final String EXTRA_AMOUNT = "amount";
    public static final String EXTRA_SESSION_ID = "session_id";
    public static final String EXTRA_VPN_LIST = "vpn_list";
    public static final String EXTRA_NOTIFICATION_ACTIVITY = "notification_activity";
    public static final String EXTRA_REQ_CODE = "req_code";

    // Fragment Tags
    public static final String TAG_ADD_REFERRAL = "ADD_REFERRAL";
    public static final String TAG_INIT_PAY = "INIT_PAY";
    public static final String TAG_LOGOUT = "LOGOUT";
    public static final String TAG_RATING_DIALOG = "co.sentinel.sentinellite.rating_dialog";

    // Error Constants
    public static final String ERROR_GENERIC = "error_generic";
    public static final String ERROR_VERSION_FETCH = "error_version_undefined";

    // Other app constants
    public static final int VALUE_DEFAULT = -1;
    public static final String FOLDER_NAME = "Sentinel";
    public static final String FILE_NAME = "keystore.file";
    public static final String CONFIG_NAME = "client.ovpn";
    public static final String INFURA_URL_MAIN_NET = "https://mainnet.infura.io/aiAxnxbpJ4aG0zed1aMy";
    public static final String INFURA_URL_TEST_NET = "https://rinkeby.infura.io/aiAxnxbpJ4aG0zed1aMy";
    public static final String SENTINEL_ADDRESS_MAIN_NET = "0xa44E5137293E855B1b7bC7E2C6f8cD796fFCB037";
    public static final String SENTINEL_ADDRESS_TEST_NET = "0x29317B796510afC25794E511e7B10659Ca18048B";
    public static final String TX_MAIN_NET = "https://etherscan.io/tx/";
    public static final String TX_TEST_NET = "https://rinkeby.etherscan.io/tx/";
    public static final String PROGRESS_DIALOG_TAG = "sentinelgroup.io.sentinel.progress_dialog";
    public static final String SINGLE_ACTION_DIALOG_TAG = "sentinelgroup.io.sentinel.single_action_dialog";
    public static final String DOUBLE_ACTION_DIALOG_TAG = "sentinelgroup.io.sentinel.double_action_dialog";
    public static final String SENT = "SENT";
    public static final String ETH = "ETH";
    public static final String GENERIC_ERROR = "generic_error";
    public static final String STORAGE_ERROR = "storage_error";
    public static final String INIT_PAY_ERROR = "Initial VPN payment is not done.";
    public static final String URL_BUILDER = "http://%1s:%d/ovpn";
    public static final String DISCONNECT_URL_BUILDER = "http://%1s:%d/disconnect";
    public static final String GAS_PRICE_ESTIMATE_URL = "https://www.etherchain.org/api/gasPriceOracle";
    public static final String ETH_TX_URL_BUILDER = "https://api-rinkeby.etherscan.io/api?apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM&module=account&action=txlist&startblock=0&endblock=latest&address=%1s";
    public static final String SENT_TX_URL_BUILDER = "https://api-rinkeby.etherscan.io/api?apikey=Y5BJ5VA3XZ59F63XQCQDDUWU2C29144MMM&module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=0x29317B796510afC25794E511e7B10659Ca18048B&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic0_1_opr=and&topic1=%1s&topic1_2_opr=or&topic2=%2s";
    public static final String ETHERSCAN_URL_BUILDER = "https://rinkeby.etherscan.io/tx/%1s";
    public static final String HOME = "home";
    public static final double MAX_NODE_RATING = 5.0;

    // Branch URL constants
    public static final String BRANCH_REFERRAL_ID = "referralId";
}