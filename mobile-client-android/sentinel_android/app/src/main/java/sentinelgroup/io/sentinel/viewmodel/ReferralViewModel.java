package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;

import sentinelgroup.io.sentinel.network.model.BonusInfoEntity;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.GenericResponse;
import sentinelgroup.io.sentinel.repository.BonusRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class ReferralViewModel extends ViewModel {
    private final BonusRepository mRepository;
    private final String mAddress;
    private final LiveData<BonusInfoEntity> mReferralInfoLiveData;
    private final SingleLiveEvent<Resource<GenericResponse>> mReferralClaimLiveEvent;
    private final SingleLiveEvent<Resource<GenericResponse>> mAccountInfoLiveEvent;

    ReferralViewModel(BonusRepository iRepository) {
        mRepository = iRepository;
        mAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        mReferralInfoLiveData = iRepository.getBonusInfoEntityLiveData();
        mReferralClaimLiveEvent = iRepository.getBonusClaimLiveEvent();
        mAccountInfoLiveEvent = iRepository.getAccountInfoLiveEvent();
    }

    public LiveData<BonusInfoEntity> getBonusInfoLiveData() {
        return mReferralInfoLiveData;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getAccountInfoLiveEvent() {
        return mAccountInfoLiveEvent;
    }

    public SingleLiveEvent<Resource<GenericResponse>> getReferralClaimLiveEvent() {
        return mReferralClaimLiveEvent;
    }

    public String getAccountAddress() {
        return mAddress;
    }

    public void updateReferralInfo() {
        mRepository.fetchBonusInfo();
    }

    public void updateAccountInfo() {
        mRepository.fetchAccountInfo();
    }

    public void claimReferralBonus() {
        GenericRequestBody aRequestBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .address(mAddress)
                .build();
        mRepository.claimBonus(aRequestBody);
    }

    public String getReferralId() {
        return AppPreferences.getInstance().getString(AppConstants.PREFS_REF_ID);
    }
}