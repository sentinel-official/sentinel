package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import sentinelgroup.io.sentinel.repository.PinRepository;
import sentinelgroup.io.sentinel.util.AppExecutors;

public class ReceiveViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final AppExecutors mAppExecutors;

    public ReceiveViewModelFactory(AppExecutors iAppExecutors) {
        mAppExecutors = iAppExecutors;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new ReceiveViewModel(mAppExecutors);
    }
}
