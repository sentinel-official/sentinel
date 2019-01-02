package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import sentinelgroup.io.sentinel.repository.ReferralRepository;

public class ReferralViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final ReferralRepository mRepository;

    public ReferralViewModelFactory(ReferralRepository iRepository) {
        this.mRepository = iRepository;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new ReferralViewModel(mRepository);
    }
}