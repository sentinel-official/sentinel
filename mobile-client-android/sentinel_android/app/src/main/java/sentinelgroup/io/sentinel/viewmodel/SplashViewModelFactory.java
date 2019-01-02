package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import sentinelgroup.io.sentinel.repository.AppVersionRepository;
import sentinelgroup.io.sentinel.repository.BonusRepository;
import sentinelgroup.io.sentinel.repository.CreateAuidRepository;

public class SplashViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final BonusRepository mBonusRepository;
    private final AppVersionRepository mAppVersionRepository;
    private final CreateAuidRepository mCreateAuidRepository;

    public SplashViewModelFactory(BonusRepository iBonusRepository, AppVersionRepository iAppVersionRepository, CreateAuidRepository iCreateAuidRepository) {
        mBonusRepository = iBonusRepository;
        mAppVersionRepository = iAppVersionRepository;
        mCreateAuidRepository = iCreateAuidRepository;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new SplashViewModel(mBonusRepository, mAppVersionRepository, mCreateAuidRepository);
    }
}
