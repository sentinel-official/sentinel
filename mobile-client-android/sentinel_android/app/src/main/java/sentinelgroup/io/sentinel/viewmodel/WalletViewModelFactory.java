package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;
import android.arch.lifecycle.ViewModelProvider;
import android.support.annotation.NonNull;

import sentinelgroup.io.sentinel.repository.WalletRepository;

public class WalletViewModelFactory extends ViewModelProvider.NewInstanceFactory {
    private final WalletRepository mRepository;
    private final String mAccountAddress;

    public WalletViewModelFactory(WalletRepository iRepository, String iAccountAddress) {
        mRepository = iRepository;
        mAccountAddress = iAccountAddress;
    }

    @NonNull
    @Override
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        //noinspection unchecked
        return (T) new WalletViewModel(mRepository, mAccountAddress);
    }
}
