package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import sentinelgroup.io.sentinel.repository.BonusRepository;

public class BonusViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final BonusRepository mRepository;

    public BonusViewModelFactory(BonusRepository iRepository) {
        this.mRepository = iRepository;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new ReferralViewModel(mRepository);
    }
}