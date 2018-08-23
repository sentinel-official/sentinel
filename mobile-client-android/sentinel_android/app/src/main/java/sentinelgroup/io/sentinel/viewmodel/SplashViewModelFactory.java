package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import sentinelgroup.io.sentinel.repository.AppVersionRepository;
import sentinelgroup.io.sentinel.repository.BonusRepository;

public class SplashViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final BonusRepository mBonusRepository;
    private final AppVersionRepository mAppVersionRepository;


    public SplashViewModelFactory(BonusRepository iBonusRepository, AppVersionRepository iAppVersionRepository) {
        mBonusRepository = iBonusRepository;
        mAppVersionRepository = iAppVersionRepository;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new SplashViewModel(mBonusRepository, mAppVersionRepository);
    }
}
