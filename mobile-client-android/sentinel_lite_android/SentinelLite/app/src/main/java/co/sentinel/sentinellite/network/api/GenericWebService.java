package co.sentinel.sentinellite.network.api;

import co.sentinel.sentinellite.network.model.GenericRequestBody;
import co.sentinel.sentinellite.network.model.GenericResponse;
import co.sentinel.sentinellite.network.model.Vpn;
import co.sentinel.sentinellite.network.model.VpnConfig;
import co.sentinel.sentinellite.network.model.VpnCredentials;
import co.sentinel.sentinellite.network.model.VpnUsage;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Url;

/**
 * REST API access points for VPN and wallet flow
 */
public interface GenericWebService {
    @GET(EndPoint.GET_UNOCCUPIED_VPN_SERVERS)
    Call<Vpn> getUnoccupiedVpnList();

    @POST(EndPoint.GET_VPN_SERVER_CREDENTIALS)
    Call<VpnCredentials> getVpnServerCredentials(@Body GenericRequestBody iBody);

    @POST
    Call<VpnConfig> getVpnConfig(@Url String url, @Body GenericRequestBody iBody);

    @POST
    Call<GenericResponse> disconnectVpn(@Url String url, @Body GenericRequestBody iBody);

    @POST(EndPoint.GET_VPN_USAGE_FOR_USER)
    Call<VpnUsage> getVpnUsageForUser(@Body GenericRequestBody iBody);

}