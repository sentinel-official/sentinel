package co.sentinel.sentinellite.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import co.sentinel.sentinellite.repository.AppVersionRepository;
import co.sentinel.sentinellite.repository.BonusRepository;


public class BonusViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final BonusRepository mBonusRepository;
    private final AppVersionRepository mAppVersionRepository;

    public BonusViewModelFactory(BonusRepository iBonusRepository, AppVersionRepository iAppVersionRepository) {
        mBonusRepository = iBonusRepository;
        mAppVersionRepository = iAppVersionRepository;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new ReferralViewModel(mBonusRepository, mAppVersionRepository);
    }
}