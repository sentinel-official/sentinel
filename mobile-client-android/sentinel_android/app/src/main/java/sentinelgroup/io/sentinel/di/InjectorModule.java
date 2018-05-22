package sentinelgroup.io.sentinel.di;

import android.content.Context;
import android.content.ContextWrapper;

import sentinelgroup.io.sentinel.db.AppDatabase;
import sentinelgroup.io.sentinel.network.api.WebService;
import sentinelgroup.io.sentinel.network.client.WebClient;
import sentinelgroup.io.sentinel.repository.CreateAuidRepository;
import sentinelgroup.io.sentinel.repository.PinRepository;
import sentinelgroup.io.sentinel.repository.RestoreKeystoreRepository;
import sentinelgroup.io.sentinel.repository.WalletRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.viewmodel.CreateAuidViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.ForgotPinViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.ResetPinViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.RestoreKeystoreViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.SetPinViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.VerifyPinViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.WalletViewModelFactory;

/**
 * Provides static methods to inject the various classes needed for the application.
 */
public class InjectorModule {
    private static CreateAuidRepository provideCreateAccountRepository() {
        WebService aWebService = WebClient.get();
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return CreateAuidRepository.getInstance(aWebService, aAppExecutors);
    }

    private static RestoreKeystoreRepository provideRestoreKeystoreRepository() {
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return RestoreKeystoreRepository.getInstance(aAppExecutors);
    }

    private static PinRepository providePinRepository(Context iContext) {
        AppDatabase aAppDatabase = AppDatabase.getInstance(iContext.getApplicationContext());
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return PinRepository.getInstance(aAppDatabase.pinEntryDao(), aAppExecutors);
    }

    private static WalletRepository provideWalletRepository() {
        WebService aWebService = WebClient.get();
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return WalletRepository.getInstance(aWebService, aAppExecutors);
    }

    public static CreateAuidViewModelFactory provideCreateAccountViewModelFactory() {
        CreateAuidRepository aRepository = provideCreateAccountRepository();
        return new CreateAuidViewModelFactory(aRepository);
    }

    public static RestoreKeystoreViewModelFactory provideRestoreKeystoreViewModelFactory() {
        RestoreKeystoreRepository aRepository = provideRestoreKeystoreRepository();
        return new RestoreKeystoreViewModelFactory(aRepository);
    }

    public static SetPinViewModelFactory provideSetPinViewModelFactory(Context iContext) {
        PinRepository aRepository = providePinRepository(iContext);
        return new SetPinViewModelFactory(aRepository);
    }

    public static VerifyPinViewModelFactory provideVerifyPinViewModelFactory(Context iContext) {
        PinRepository aRepository = providePinRepository(iContext);
        return new VerifyPinViewModelFactory(aRepository);
    }

    public static ForgotPinViewModelFactory provideForgotPinViewModelFactory(Context iContext) {
        PinRepository aRepository = providePinRepository(iContext);
        return new ForgotPinViewModelFactory(aRepository);
    }

    public static ResetPinViewModelFactory provideResetPinViewModelFactory(Context iContext){
        PinRepository aRepository = providePinRepository(iContext);
        return new ResetPinViewModelFactory(aRepository);
    }

    public static WalletViewModelFactory provideWalletViewModelFactory() {
        WalletRepository aRepository = provideWalletRepository();
        String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        return new WalletViewModelFactory(aRepository, aAccountAddress);
    }
}