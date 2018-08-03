package sentinelgroup.io.sentinel.network.api;

/**
 * Contains all the API endpoints used in the app.
 */
public class EndPoint {
    public static final String CREATE_NEW_ACCOUNT = "client/account";
    public static final String GET_ACCOUNT_BALANCE = "client/account/balance";
    public static final String GET_FREE_SENT = "dev/free";
    public static final String RAW_TRANSACTION = "client/raw-transaction";
    public static final String GET_UNOCCUPIED_VPN_SERVERS = "client/vpn/list";
    public static final String GET_VPN_SERVER_CREDENTIALS = "client/vpn";
    public static final String GET_VPN_USAGE_FOR_USER = "client/vpn/usage";
    public static final String GET_VPN_CURRENT_USAGE = "client/vpn/current";
    public static final String MAKE_VPN_USAGE_PAYMENT = "client/vpn/pay";
    public static final String REPORT_PAYMENT = "client/vpn/report";
}