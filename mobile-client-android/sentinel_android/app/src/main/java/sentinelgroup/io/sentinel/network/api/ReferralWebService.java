package sentinelgroup.io.sentinel.network.api;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.GenericResponse;
import sentinelgroup.io.sentinel.network.model.ReferralInfoEntity;

/**
 * REST API access points for Referral flow
 */
public interface ReferralWebService {
    @POST(EndPoint.ADD_REFERRAL_ADDRESS)
    Call<GenericResponse> addReferralAddress(@Body GenericRequestBody iBody);

    @POST(EndPoint.CLAIM_REFERRAL_BONUS)
    Call<GenericResponse> claimReferralBonus(@Body GenericRequestBody iBody);

    @GET(EndPoint.GET_REFERRAL_INFO)
    Call<ReferralInfoEntity> getReferralInfo(@Query("address") String iAddress);
}