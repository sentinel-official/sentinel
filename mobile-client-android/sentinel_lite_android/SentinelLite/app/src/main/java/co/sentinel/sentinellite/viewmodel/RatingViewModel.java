package co.sentinel.sentinellite.viewmodel;

import android.arch.lifecycle.ViewModel;

import co.sentinel.sentinellite.network.model.GenericRequestBody;
import co.sentinel.sentinellite.network.model.GenericResponse;
import co.sentinel.sentinellite.repository.VpnRepository;
import co.sentinel.sentinellite.util.AppConstants;
import co.sentinel.sentinellite.util.AppPreferences;
import co.sentinel.sentinellite.util.Resource;
import co.sentinel.sentinellite.util.SingleLiveEvent;

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
