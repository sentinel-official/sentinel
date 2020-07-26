package co.sentinel.lite.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import co.sentinel.lite.repository.VpnRepository;

public class VpnUsageViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final VpnRepository mRepository;

    public VpnUsageViewModelFactory(VpnRepository iRepository) {
        mRepository = iRepository;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new VpnUsageViewModel(mRepository);
    }
}
