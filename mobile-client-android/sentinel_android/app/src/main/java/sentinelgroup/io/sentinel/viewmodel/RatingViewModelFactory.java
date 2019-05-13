package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import sentinelgroup.io.sentinel.repository.VpnRepository;

public class RatingViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final VpnRepository mVpnRepository;

    public RatingViewModelFactory(VpnRepository iVpnRepository) {
        mVpnRepository = iVpnRepository;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new RatingViewModel(mVpnRepository);
    }
}
