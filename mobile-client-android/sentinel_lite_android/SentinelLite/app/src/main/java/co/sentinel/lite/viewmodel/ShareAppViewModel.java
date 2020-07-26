package co.sentinel.lite.viewmodel;

import android.arch.lifecycle.ViewModel;

import co.sentinel.lite.repository.BonusRepository;
import co.sentinel.lite.util.AppConstants;
import co.sentinel.lite.util.AppPreferences;

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