package sentinelgroup.io.sentinel.network.api;

import retrofit2.Call;
import retrofit2.http.GET;
import sentinelgroup.io.sentinel.network.model.VersionInfo;

/**
 * REST API access points for Referral flow
 */
public interface AppVersionWebService {
    @GET(EndPoint.GET_LATEST_VERSION_SNC)
    Call<VersionInfo> getLatestAppVersion();
}
