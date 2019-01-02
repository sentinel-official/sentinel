package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;

import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.GenericResponse;
import sentinelgroup.io.sentinel.network.model.ReferralInfoEntity;
import sentinelgroup.io.sentinel.repository.ReferralRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class ReferralViewModel extends ViewModel {
    private final ReferralRepository mRepository;
    private final String mAddress;
    private final LiveData<ReferralInfoEntity> mReferralInfoLiveData;
    private final SingleLiveEvent<Resource<GenericResponse>> mReferralClaimLiveEvent;

    ReferralViewModel(ReferralRepository iRepository) {
        mRepository = iRepository;
        mAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        mReferralInfoLiveData = iRepository.getReferralInfoEntityLiveData();
        mReferralClaimLiveEvent = iRepository.getReferralClaimLiveEvent();
    }

    public LiveData<ReferralInfoEntity> getReferralInfoLiveData() {
        return mReferralInfoLiveData;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getReferralClaimLiveEvent() {
        return mReferralClaimLiveEvent;
    }

    public String getAccountAddress() {
        return mAddress;
    }

    public void updateReferralInfo() {
        mRepository.updateReferralInfo(mAddress);
    }

    public void claimReferralBonus() {
        GenericRequestBody aRequestBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .address(mAddress)
                .build();
        mRepository.claimReferralBonus(aRequestBody);
    }
}