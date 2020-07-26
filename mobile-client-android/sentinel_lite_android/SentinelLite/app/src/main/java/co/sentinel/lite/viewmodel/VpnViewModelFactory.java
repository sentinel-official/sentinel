package co.sentinel.lite.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import co.sentinel.lite.repository.VpnRepository;
import co.sentinel.lite.util.AppExecutors;

public class VpnViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final VpnRepository mRepository;
    private final AppExecutors mAppExecutors;

    public VpnViewModelFactory(VpnRepository iRepository, AppExecutors iAppExecutors) {
        mRepository = iRepository;
        mAppExecutors = iAppExecutors;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new VpnViewModel(mRepository, mAppExecutors);
    }
}

