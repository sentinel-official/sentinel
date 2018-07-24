package sentinelgroup.io.sentinel.di;

import android.content.Context;

import sentinelgroup.io.sentinel.db.AppDatabase;
import sentinelgroup.io.sentinel.network.api.GenericWebService;
import sentinelgroup.io.sentinel.network.api.ReferralWebService;
import sentinelgroup.io.sentinel.network.client.WebClient;
import sentinelgroup.io.sentinel.repository.CreateAuidRepository;
import sentinelgroup.io.sentinel.repository.PinRepository;
import sentinelgroup.io.sentinel.repository.ReferralRepository;
import sentinelgroup.io.sentinel.repository.SendRepository;
import sentinelgroup.io.sentinel.repository.TxHistoryRepository;
import sentinelgroup.io.sentinel.repository.VpnRepository;
import sentinelgroup.io.sentinel.repository.WalletRepository;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.viewmodel.CreateAuidViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.ForgotPinViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.ReceiveViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.ReferralViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.ResetPinViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.RestoreKeystoreViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.SendViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.SetPinViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.TxHistoryViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.VerifyPinViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.VpnConnectedViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.VpnHistoryViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.VpnListViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.VpnPayViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.VpnSelectViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.VpnSessionViewModelFactory;
import sentinelgroup.io.sentinel.viewmodel.WalletViewModelFactory;

/**
 * Provides static methods to inject the various classes needed for the application.
 */
public class InjectorModule {
    /* Static private getter methods for Repository classes. */
    private static CreateAuidRepository provideCreateAccountRepository(Context iContext) {
        AppDatabase aAppDatabase = AppDatabase.getInstance(iContext.getApplicationContext());
        GenericWebService aGenericWebService = WebClient.getGenericWebService();
        ReferralWebService aReferralWebService = WebClient.getReferralWebService();
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return CreateAuidRepository.getInstance(aAppDatabase.deleteTableDao(), aGenericWebService, aReferralWebService, aAppExecutors);
    }

    private static PinRepository providePinRepository(Context iContext) {
        AppDatabase aAppDatabase = AppDatabase.getInstance(iContext.getApplicationContext());
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return PinRepository.getInstance(aAppDatabase.getPinEntryDao(), aAppExecutors);
    }

    private static VpnRepository provideVpnRepository(Context iContext) {
        AppDatabase aAppDatabase = AppDatabase.getInstance(iContext.getApplicationContext());
        GenericWebService aGenericWebService = WebClient.getGenericWebService();
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return VpnRepository.getInstance(aAppDatabase.getVpnListEntryDao(), aAppDatabase.getVpnUsageEntryDao(), aGenericWebService, aAppExecutors);
    }

    private static WalletRepository provideWalletRepository(Context iContext) {
        AppDatabase aAppDatabase = AppDatabase.getInstance(iContext.getApplicationContext());
        GenericWebService aGenericWebService = WebClient.getGenericWebService();
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return WalletRepository.getInstance(aAppDatabase.getBalanceEntryDao(), aGenericWebService, aAppExecutors);
    }

    private static SendRepository provideSendRepository(Context iContext) {
        AppDatabase aAppDatabase = AppDatabase.getInstance(iContext.getApplicationContext());
        GenericWebService aGenericWebService = WebClient.getGenericWebService();
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return SendRepository.getInstance(aAppDatabase.getGasEstimateEntryDao(), aGenericWebService, aAppExecutors);
    }

    private static TxHistoryRepository provideTxHistoryRepository(Context iContext) {
        AppDatabase aAppDatabase = AppDatabase.getInstance(iContext.getApplicationContext());
        GenericWebService aGenericWebService = WebClient.getGenericWebService();
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return TxHistoryRepository.getInstance(aGenericWebService, aAppExecutors);
    }

    private static ReferralRepository provideReferralRepository(Context iContext) {
        AppDatabase aAppDatabase = AppDatabase.getInstance(iContext.getApplicationContext());
        ReferralWebService aReferralWebService = WebClient.getReferralWebService();
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return ReferralRepository.getInstance(aAppDatabase.getReferralInfoEntryDao(), aReferralWebService, aAppExecutors);
    }

    /* Static private getter methods for ViewModelFactory classes */
    public static CreateAuidViewModelFactory provideCreateAccountViewModelFactory(Context iContext) {
        CreateAuidRepository aRepository = provideCreateAccountRepository(iContext);
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

    public static VpnListViewModelFactory provideVpnListViewModelFactory(Context iContext) {
        VpnRepository aRepository = provideVpnRepository(iContext);
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return new VpnListViewModelFactory(aRepository, aAppExecutors);
    }

    public static VpnConnectedViewModelFactory provideVpnConnectedViewModelFactory(Context iContext) {
        VpnRepository aRepository = provideVpnRepository(iContext);
        return new VpnConnectedViewModelFactory(aRepository);
    }

    public static VpnPayViewModelFactory provideVpnPayViewModelFactory(Context iContext) {
        VpnRepository aRepository = provideVpnRepository(iContext);
        return new VpnPayViewModelFactory(aRepository);
    }

    public static VpnHistoryViewModelFactory provideVpnHistoryViewModelFactory(Context iContext) {
        VpnRepository aRepository = provideVpnRepository(iContext);
        return new VpnHistoryViewModelFactory(aRepository);
    }

    public static VpnSelectViewModelFactory provideVpnSelectViewModelFactory(Context iContext) {
        VpnRepository aRepository = provideVpnRepository(iContext);
        return new VpnSelectViewModelFactory(aRepository);
    }

    public static VpnSessionViewModelFactory provideVpnSessionViewModelFactory(Context iContext) {
        VpnRepository aRepository = provideVpnRepository(iContext);
        return new VpnSessionViewModelFactory(aRepository);
    }

    public static WalletViewModelFactory provideWalletViewModelFactory(Context iContext) {
        WalletRepository aRepository = provideWalletRepository(iContext);
        return new WalletViewModelFactory(aRepository);
    }

    public static SendViewModelFactory provideSendViewModelFactory(Context iContext) {
        SendRepository aRepository = provideSendRepository(iContext);
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return new SendViewModelFactory(aRepository, aAppExecutors);
    }

    public static ReceiveViewModelFactory provideReceiveViewModelFactory() {
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return new ReceiveViewModelFactory(aAppExecutors);
    }

    public static TxHistoryViewModelFactory provideTxHistoryViewModelFactory(Context iContext) {
        TxHistoryRepository aRepository = provideTxHistoryRepository(iContext);
        return new TxHistoryViewModelFactory(aRepository);
    }

    public static ReferralViewModelFactory provideReferralViewModelFactory(Context iContext) {
        ReferralRepository aRepository = provideReferralRepository(iContext);
        return new ReferralViewModelFactory(aRepository);
    }
}