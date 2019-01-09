package co.sentinel.sentinellite.network.api;

import co.sentinel.sentinellite.network.model.BonusInfoEntity;
import co.sentinel.sentinellite.network.model.GenericRequestBody;
import co.sentinel.sentinellite.network.model.GenericResponse;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

/**
 * REST API access points for Bonuses flow
 */
public interface BonusWebService {
    @POST(EndPoint.ACCOUNT)
    Call<GenericResponse> addAccount(@Body GenericRequestBody iBody);

    @GET(EndPoint.ACCOUNT)
    Call<GenericResponse> getAccountInfo(@Query("deviceId") String iDeviceId);

    @GET(EndPoint.GET_BONUS_INFO)
    Call<BonusInfoEntity> getBonusInfo(@Query("deviceId") String iDeviceId);

    @GET(EndPoint.CLAIM_BONUS)
    Call<GenericResponse> claimBonus(@Query("deviceId") String iDeviceId);
}