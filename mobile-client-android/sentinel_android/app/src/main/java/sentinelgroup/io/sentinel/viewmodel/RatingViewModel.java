package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;

import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.GenericResponse;
import sentinelgroup.io.sentinel.repository.VpnRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;


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
