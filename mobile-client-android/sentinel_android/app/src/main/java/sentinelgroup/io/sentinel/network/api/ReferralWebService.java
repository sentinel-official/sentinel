package sentinelgroup.io.sentinel.network.api;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Query;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.GenericResponse;
import sentinelgroup.io.sentinel.network.model.ReferralInfoEntity;

/**
 * REST API access points for Referral flow
 */
public interface ReferralWebService {
    @POST(EndPoint.ACCOUNT)
    Call<GenericResponse> addAccount(@Body GenericRequestBody iBody);

    @GET(EndPoint.ACCOUNT)
    Call<GenericResponse> getAccountInfo(@Query("deviceId") String iDeviceId);

    @PUT(EndPoint.ACCOUNT)
    Call<GenericResponse> updateAccount(@Body GenericRequestBody iBody);


    @POST(EndPoint.CLAIM_BONUS)
    Call<GenericResponse> claimBonus(@Body GenericRequestBody iBody);

    //    TODO changes need to be made to the referral info API
    @GET(EndPoint.GET_REFERRAL_INFO)
    Call<ReferralInfoEntity> getReferralInfo(@Query("address") String iAddress);


}