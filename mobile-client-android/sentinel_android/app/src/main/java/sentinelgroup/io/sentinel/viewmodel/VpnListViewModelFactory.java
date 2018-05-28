package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import sentinelgroup.io.sentinel.repository.VpnRepository;
import sentinelgroup.io.sentinel.util.AppExecutors;

public class VpnListViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final VpnRepository mRepository;

    public VpnListViewModelFactory(VpnRepository iRepository) {
        mRepository = iRepository;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new VpnListViewModel(mRepository);
    }
}

