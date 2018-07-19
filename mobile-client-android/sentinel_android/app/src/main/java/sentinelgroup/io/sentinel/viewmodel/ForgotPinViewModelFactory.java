package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import sentinelgroup.io.sentinel.repository.PinRepository;
import sentinelgroup.io.sentinel.util.AppExecutors;

public class ForgotPinViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final PinRepository mRepository;
    private final AppExecutors mAppExecutors;

    public ForgotPinViewModelFactory(PinRepository iRepository, AppExecutors iAppExecutors) {
        mRepository = iRepository;
        mAppExecutors = iAppExecutors;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new ForgotPinViewModel(mRepository, mAppExecutors);
    }
}
