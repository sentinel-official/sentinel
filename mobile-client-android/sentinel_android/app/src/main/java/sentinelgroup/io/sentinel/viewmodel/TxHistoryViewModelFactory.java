package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import sentinelgroup.io.sentinel.repository.TxHistoryRepository;
import sentinelgroup.io.sentinel.util.AppExecutors;

public class TxHistoryViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final TxHistoryRepository mRepository;

    public TxHistoryViewModelFactory(TxHistoryRepository iRepository) {
        mRepository = iRepository;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new TxHistoryViewModel(mRepository);
    }
}