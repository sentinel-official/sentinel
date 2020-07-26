package co.sentinel.lite.network.api;

import co.sentinel.lite.network.model.BonusInfoEntity;
import co.sentinel.lite.network.model.GenericRequestBody;
import co.sentinel.lite.network.model.GenericResponse;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

/**
 * REST API access points for Bonuses flow
 */
public interface BonusWebService {
    String ACCOUNT_INFO_BY_DEVICE_ID = "deviceId";
    String ACCOUNT_INFO_BY_ADDRESS = "address";

    @POST(EndPoint.ADD_ACCOUNT)
    Call<GenericResponse> addAccount(@Body GenericRequestBody iBody);

    @GET(EndPoint.GET_ACCOUNT_INFO)
    Call<GenericResponse> getAccountInfoByDeviceIdAddress(@Path("type") String iType, @Path("value") String iDeviceId);

    @GET(EndPoint.GET_BONUS_INFO)
    Call<BonusInfoEntity> getBonusInfo(@Path("deviceId") String iDeviceId);

    @GET(EndPoint.CLAIM_BONUS)
    Call<GenericResponse> claimBonus(@Query("deviceId") String iDeviceId);

    @POST(EndPoint.LINK_ACCOUNT)
    Call<GenericResponse> linkSncSlcAccounts(@Path("sncRefId") String sncRefId, @Path("slcRefId") String slcRefId, @Body GenericRequestBody iBody);
}