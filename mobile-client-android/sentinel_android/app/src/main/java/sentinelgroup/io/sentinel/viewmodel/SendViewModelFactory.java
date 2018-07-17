package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import sentinelgroup.io.sentinel.repository.SendRepository;
import sentinelgroup.io.sentinel.util.AppExecutors;

public class SendViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final SendRepository mRepository;
    private final AppExecutors mAppExecutors;

    public SendViewModelFactory(SendRepository iRepository, AppExecutors iAppExecutors) {
        mRepository = iRepository;
        mAppExecutors = iAppExecutors;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new SendViewModel(mRepository, mAppExecutors);
    }
}