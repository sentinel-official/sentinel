package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import sentinelgroup.io.sentinel.repository.RestoreKeystoreRepository;

public class RestoreKeystoreViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final RestoreKeystoreRepository mRepository;

    public RestoreKeystoreViewModelFactory(RestoreKeystoreRepository iRepository) {
        mRepository = iRepository;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new RestoreKeystoreViewModel(mRepository);
    }
}
