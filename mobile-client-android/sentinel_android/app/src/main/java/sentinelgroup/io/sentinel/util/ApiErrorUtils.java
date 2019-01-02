package sentinelgroup.io.sentinel.util;

import java.io.IOException;
import java.lang.annotation.Annotation;

import okhttp3.ResponseBody;
import retrofit2.Converter;
import retrofit2.Response;
import sentinelgroup.io.sentinel.network.client.WebClient;
import sentinelgroup.io.sentinel.network.model.ApiError;

public class ApiErrorUtils {
    public static ApiError parseGenericError(Response<?> iResponse) {
        Converter<ResponseBody, ApiError> aConverter = WebClient
                .getGenericClient()
                .responseBodyConverter(ApiError.class, new Annotation[0]);
        ApiError aError = new ApiError();
        try {
            if (iResponse.errorBody() != null)
                aError = aConverter.convert(iResponse.errorBody());
        } catch (IOException e) {
            return new ApiError();
        }
        return aError;
    }

    public static ApiError parseReferralError(Response<?> iResponse) {
        Converter<ResponseBody, ApiError> aConverter = WebClient
                .getReferralClient()
                .responseBodyConverter(ApiError.class, new Annotation[0]);
        ApiError aError = new ApiError();
        try {
            if (iResponse.errorBody() != null)
                aError = aConverter.convert(iResponse.errorBody());
        } catch (IOException e) {
            return new ApiError();
        }
        return aError;
    }
}