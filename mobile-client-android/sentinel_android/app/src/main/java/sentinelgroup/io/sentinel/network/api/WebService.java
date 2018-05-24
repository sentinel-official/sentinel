package sentinelgroup.io.sentinel.network.api;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import sentinelgroup.io.sentinel.network.model.Account;
import sentinelgroup.io.sentinel.network.model.Balance;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.PayResponse;
import sentinelgroup.io.sentinel.network.model.Tokens;
import sentinelgroup.io.sentinel.network.model.Vpn;

/**
 * REST API access points
 */
public interface WebService {
    @POST(EndPoint.CREATE_NEW_ACCOUNT)
    Call<Account> createNewAccount(@Body GenericRequestBody iBody);

    @POST(EndPoint.GET_ACCOUNT_BALANCE)
    Call<Balance> getAccountBalance(@Body GenericRequestBody iBody);

    @POST(EndPoint.GET_FREE_SENT)
    Call<Tokens> getFreeTokens(@Body GenericRequestBody iBody);

    @GET(EndPoint.GET_UNOCCUPIED_VPN_SERVERS)
    Call<Vpn> getUnoccupiedVpnServers();

    @POST(EndPoint.RAW_TRANSACTION)
    Call<PayResponse> makeRawTransaction(@Body GenericRequestBody iBody);
}