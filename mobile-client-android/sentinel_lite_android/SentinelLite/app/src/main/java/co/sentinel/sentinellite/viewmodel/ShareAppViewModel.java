package co.sentinel.sentinellite.viewmodel;

import android.arch.lifecycle.ViewModel;

import co.sentinel.sentinellite.repository.BonusRepository;
import co.sentinel.sentinellite.util.AppConstants;
import co.sentinel.sentinellite.util.AppPreferences;

public class ShareAppViewModel extends ViewModel {
    private final BonusRepository mBonusRepository;

    ShareAppViewModel(BonusRepository iBonusRepository) {
        mBonusRepository = iBonusRepository;
    }

    public void updateReferralInfo() {
        mBonusRepository.fetchBonusInfo();
    }

    public String getReferralId() {
        return AppPreferences.getInstance().getString(AppConstants.PREFS_REF_ID);
    }

}