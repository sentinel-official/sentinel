package co.sentinel.sentinellite.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import co.sentinel.sentinellite.repository.VpnRepository;
import co.sentinel.sentinellite.util.AppExecutors;

public class VpnListViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final VpnRepository mRepository;
    private final AppExecutors mAppExecutors;

    public VpnListViewModelFactory(VpnRepository iRepository, AppExecutors iAppExecutors) {
        mRepository = iRepository;
        mAppExecutors = iAppExecutors;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new VpnListViewModel(mRepository, mAppExecutors);
    }
}

