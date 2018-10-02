package sentinelgroup.io.sentinel.network.api;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import sentinelgroup.io.sentinel.network.model.BonusInfoEntity;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.GenericResponse;

/**
 * REST API access points for Referral flow
 */
public interface BonusWebService {
    @POST(EndPoint.ADD_ACCOUNT)
    Call<GenericResponse> addAccount(@Body GenericRequestBody iBody);

    @GET(EndPoint.GET_ACCOUNT_INFO)
    Call<GenericResponse> getAccountInfoByDeviceIdAddress(@Path("type") String iType, @Path("value") String iDeviceId);

    @PUT(EndPoint.UPDATE_ACCOUNT)
    Call<GenericResponse> updateAccount(@Path("deviceId") String iDeviceId, @Body GenericRequestBody iBody);


    @POST(EndPoint.CLAIM_BONUS)
    Call<GenericResponse> claimBonus(@Body GenericRequestBody iBody);

    @GET(EndPoint.GET_BONUS_INFO)
    Call<BonusInfoEntity> getBonusInfo(@Path("deviceId") String iDeviceId);


}