package co.sentinel.lite.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import co.sentinel.lite.repository.VpnRepository;

public class VpnConnectedViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final VpnRepository mRepository;

    public VpnConnectedViewModelFactory(VpnRepository iRepository) {
        this.mRepository = iRepository;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new VpnConnectedViewModel(mRepository);
    }
}
