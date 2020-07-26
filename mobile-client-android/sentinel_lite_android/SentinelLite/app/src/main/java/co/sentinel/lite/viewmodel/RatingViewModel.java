package co.sentinel.lite.viewmodel;

import android.arch.lifecycle.ViewModel;

import co.sentinel.lite.network.model.GenericRequestBody;
import co.sentinel.lite.network.model.GenericResponse;
import co.sentinel.lite.repository.VpnRepository;
import co.sentinel.lite.util.AppConstants;
import co.sentinel.lite.util.AppPreferences;
import co.sentinel.lite.util.Resource;
import co.sentinel.lite.util.SingleLiveEvent;

public class RatingViewModel extends ViewModel {

    private final VpnRepository mRepository;
    private final SingleLiveEvent<Resource<GenericResponse>> mRatingLiveEvent;

    RatingViewModel(VpnRepository iRepository) {
        mRepository = iRepository;
        mRatingLiveEvent = mRepository.getRatingLiveEvent();
    }

    public void rateVpnSession(int iRating) {
        GenericRequestBody aBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .vpnAddress(AppPreferences.getInstance().getString(AppConstants.PREFS_VPN_ADDRESS))
                .sessionName(AppPreferences.getInstance().getString(AppConstants.PREFS_SESSION_NAME))
                .rating(iRating)
                .build();
        mRepository.rateVpnSession(aBody);
    }

    public SingleLiveEvent<Resource<GenericResponse>> getRatingLiveEvent() {
        return mRatingLiveEvent;
    }
}
