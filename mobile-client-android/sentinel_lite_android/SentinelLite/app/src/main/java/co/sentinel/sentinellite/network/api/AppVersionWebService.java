package co.sentinel.sentinellite.network.api;

import co.sentinel.sentinellite.network.model.VersionInfo;
import retrofit2.Call;
import retrofit2.http.GET;

/**
 * REST API access points for App Version Details flow
 */
public interface AppVersionWebService {
    @GET(EndPoint.GET_LATEST_VERSION_SLC)
    Call<VersionInfo> getLatestAppVersionSlc();

    @GET(EndPoint.GET_LATEST_VERSION_SNC)
    Call<VersionInfo> getLatestAppVersionSnc();
}
