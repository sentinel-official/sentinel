package co.sentinel.sentinellite.network.api;

/**
 * Contains all the API endpoints used in the app.
 */
public class EndPoint {
    /*
     * VPN and Wallet flow
     */
    public static final String GET_UNOCCUPIED_VPN_SERVERS = "client/vpn/list";
    public static final String GET_VPN_SERVER_CREDENTIALS = "client/vpn";
    /*
     * Bonuses flow
     */
    public static final String ACCOUNT = "account";
    public static final String GET_BONUS_INFO = "bonus/info";
    public static final String CLAIM_BONUS = "bonus/claim";
    /*
     * App details Flow
     */
    public static final String GET_LATEST_VERSION_SLC = "version/latest?appCode=SLC";
    public static final String GET_LATEST_VERSION_SNC = "version/latest?appCode=SNC";
}