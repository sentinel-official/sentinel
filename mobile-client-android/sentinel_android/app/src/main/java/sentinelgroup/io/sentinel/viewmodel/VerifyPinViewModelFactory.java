package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import sentinelgroup.io.sentinel.repository.PinRepository;

public class VerifyPinViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final PinRepository mRepository;

    public VerifyPinViewModelFactory(PinRepository iRepository) {
        mRepository = iRepository;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new VerifyPinViewModel(mRepository);
    }
}
