package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import sentinelgroup.io.sentinel.repository.BonusRepository;
import sentinelgroup.io.sentinel.repository.CreateAuidRepository;
import sentinelgroup.io.sentinel.util.AppExecutors;


public class CreateAuidViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final CreateAuidRepository mRepository;
    private final AppExecutors mAppExecutors;
    private final BonusRepository mBonusRepository;
    private final String mDeviceId;

    public CreateAuidViewModelFactory(CreateAuidRepository iRepository, AppExecutors iAppExecutors, BonusRepository iBonusRepository, String iDeviceId) {
        mRepository = iRepository;
        mAppExecutors = iAppExecutors;
        mBonusRepository = iBonusRepository;
        mDeviceId = iDeviceId;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new CreateAuidViewModel(mRepository, mAppExecutors, mBonusRepository, mDeviceId);
    }
}
