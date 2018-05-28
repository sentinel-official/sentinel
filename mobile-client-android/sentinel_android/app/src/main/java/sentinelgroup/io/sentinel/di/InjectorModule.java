package sentinelgroup.io.sentinel.di;

import android.content.Context;

import sentinelgroup.io.sentinel.db.AppDatabase;
import sentinelgroup.io.sentinel.network.api.WebService;
import sentinelgroup.io.sentinel.network.client.WebClient;
import sentinelgroup.io.sentinel.repository.CreateAuidRepository;
import sentinelgroup.io.sentinel.repository.PinRepository;
import sentinelgroup.io.sentinel.repository.SendRepository;
import sentinelgroup.io.sentinel.repository.VpnRepository;
import sentinelgroup.io.sentinel.repository.WalletRepository;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.viewmodel.CreateAuidViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.ForgotPinViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.ReceiveViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.ResetPinViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.RestoreKeystoreViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.SendViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.SetPinViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.VerifyPinViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.VpnListViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.WalletViewModelFactory;

/**
 * Provides static methods to inject the various classes needed for the application.
 */
public class InjectorModule {
    private static CreateAuidRepository provideCreateAccountRepository() {
        WebService aWebService = WebClient.get();
        return CreateAuidRepository.getInstance(aWebService);
    }

    private static PinRepository providePinRepository(Context iContext) {
        AppDatabase aAppDatabase = AppDatabase.getInstance(iContext.getApplicationContext());
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return PinRepository.getInstance(aAppDatabase.pinEntryDao(), aAppExecutors);
    }

    private static WalletRepository provideWalletRepository() {
        WebService aWebService = WebClient.get();
        return WalletRepository.getInstance(aWebService);
    }

    private static SendRepository provideSendRepository() {
        WebService aWebService = WebClient.get();
        return SendRepository.getInstance(aWebService);
    }

    private static VpnRepository provideVpnRepository() {
        WebService aWebService = WebClient.get();
        return VpnRepository.getInstance(aWebService);
    }

    public static CreateAuidViewModelFactory provideCreateAccountViewModelFactory() {
        CreateAuidRepository aRepository = provideCreateAccountRepository();
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return new CreateAuidViewModelFactory(aRepository, aAppExecutors);
    }

    public static RestoreKeystoreViewModelFactory provideRestoreKeystoreViewModelFactory() {
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return new RestoreKeystoreViewModelFactory(aAppExecutors);
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
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return new ForgotPinViewModelFactory(aRepository, aAppExecutors);
    }

    public static ResetPinViewModelFactory provideResetPinViewModelFactory(Context iContext) {
        PinRepository aRepository = providePinRepository(iContext);
        return new ResetPinViewModelFactory(aRepository);
    }

    public static WalletViewModelFactory provideWalletViewModelFactory() {
        WalletRepository aRepository = provideWalletRepository();
        return new WalletViewModelFactory(aRepository);
    }

    public static SendViewModelFactory provideSendViewModelFactory() {
        SendRepository aRepository = provideSendRepository();
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return new SendViewModelFactory(aRepository, aAppExecutors);
    }

    public static ReceiveViewModelFactory provideReceiveViewModelFactory() {
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return new ReceiveViewModelFactory(aAppExecutors);
    }

    public static VpnListViewModelFactory provideVpnListViewModelFactory() {
        VpnRepository aRepository = provideVpnRepository();
        return new VpnListViewModelFactory(aRepository);
    }
}