package co.sentinel.lite.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import co.sentinel.lite.repository.BonusRepository;

public class DeviceRegisterViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final BonusRepository mBonusRepository;

    public DeviceRegisterViewModelFactory(BonusRepository iBonusRepository) {
        mBonusRepository = iBonusRepository;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new DeviceRegisterViewModel(mBonusRepository);
    }
}

