package co.sentinel.lite.network.api;

/**
 * Contains all the API endpoints used in the app.
 */
public class EndPoint {
    /*
     * VPN and Wallet flow
     */
    public static final String GET_UNOCCUPIED_VPN_SERVERS = "client/vpn/list";
    public static final String GET_VPN_SERVER_CREDENTIALS = "client/vpn";
    public static final String GET_VPN_USAGE_FOR_USER = "client/vpn/usage";
    public static final String POST_VPN_SESSION_RATING = "client/vpn/rate";
    /*
     * Bonuses flow
     */
    public static final String ADD_ACCOUNT = "accounts";
    public static final String GET_ACCOUNT_INFO = "accounts/{type}/{value}";
    public static final String GET_BONUS_INFO = "accounts/{deviceId}/bonuses/info";
    public static final String CLAIM_BONUS = "bonus/claim";
    public static final String LINK_ACCOUNT = "/accounts/link/{sncRefId}/{slcRefId}";
    /*
     * App details Flow
     */
    public static final String GET_LATEST_VERSION_SLC = "version/latest?appCode=SLC";
    public static final String GET_LATEST_VERSION_SNC = "version/latest?appCode=SNC";
}