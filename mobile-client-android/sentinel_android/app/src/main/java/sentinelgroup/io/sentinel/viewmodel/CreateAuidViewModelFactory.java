package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import sentinelgroup.io.sentinel.repository.CreateAuidRepository;


public class CreateAuidViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final CreateAuidRepository mRepository;

    public CreateAuidViewModelFactory(CreateAuidRepository iRepository) {
        mRepository = iRepository;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new CreateAuidViewModel(mRepository);
    }
}
