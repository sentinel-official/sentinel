package co.sentinel.sentinellite.di;

import android.content.Context;

import co.sentinel.sentinellite.db.AppDatabase;
import co.sentinel.sentinellite.network.api.AppVersionWebService;
import co.sentinel.sentinellite.network.api.BonusWebService;
import co.sentinel.sentinellite.network.api.GenericWebService;
import co.sentinel.sentinellite.network.client.WebClient;
import co.sentinel.sentinellite.repository.AppVersionRepository;
import co.sentinel.sentinellite.repository.BonusRepository;
import co.sentinel.sentinellite.repository.VpnRepository;
import co.sentinel.sentinellite.util.AppExecutors;
import co.sentinel.sentinellite.viewmodel.DeviceRegisterViewModelFactory;
import co.sentinel.sentinellite.viewmodel.BonusViewModelFactory;
import co.sentinel.sentinellite.viewmodel.SplashViewModelFactory;
import co.sentinel.sentinellite.viewmodel.VpnConnectedViewModelFactory;
import co.sentinel.sentinellite.viewmodel.VpnListViewModelFactory;
import co.sentinel.sentinellite.viewmodel.VpnUsageViewModelFactory;

/**
 * Provides static methods to inject the various classes needed for the application.
 */
public class InjectorModule {
    /* Static private getter methods for Repository classes. */
    private static BonusRepository provideBonusRepository(Context iContext, String aDeviceId) {
        AppDatabase aAppDatabase = AppDatabase.getInstance(iContext.getApplicationContext());
        BonusWebService aBonusWebService = WebClient.getBonusWebService();
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return BonusRepository.getInstance(aAppDatabase.getBonusInfoEntryDao(), aBonusWebService, aAppExecutors, aDeviceId);
    }

    private static AppVersionRepository provideAppVersionRepository() {
        AppVersionWebService aAppVersionWebService = WebClient.getAppVersionWebService();
        return AppVersionRepository.getInstance(aAppVersionWebService);
    }

    public static VpnRepository provideVpnRepository(Context iContext, String iDeviceId) {
        AppDatabase aAppDatabase = AppDatabase.getInstance(iContext.getApplicationContext());
        GenericWebService aGenericWebService = WebClient.getGenericWebService();
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return VpnRepository.getInstance(aAppDatabase.getVpnListEntryDao(), aGenericWebService, aAppExecutors, iDeviceId);
    }

    public static VpnUsageViewModelFactory provideVpnHistoryViewModelFactory(Context iContext, String iDeviceId) {
        VpnRepository aRepository = provideVpnRepository(iContext, iDeviceId);
        return new VpnUsageViewModelFactory(aRepository);
    }

    /* Static private getter methods for ViewModelFactory classes */
    public static SplashViewModelFactory provideSplashViewModelFactory(Context iContext, String aDeviceId) {
        BonusRepository aBonusRepository = provideBonusRepository(iContext, aDeviceId);
        AppVersionRepository aAppVersionRepository = provideAppVersionRepository();
        return new SplashViewModelFactory(aBonusRepository, aAppVersionRepository);
    }

    public static DeviceRegisterViewModelFactory provDeviceRegisterViewModelFactory(Context iContext, String aDeviceId) {
        BonusRepository aBonusRepository = provideBonusRepository(iContext, aDeviceId);
        return new DeviceRegisterViewModelFactory(aBonusRepository);
    }

    public static VpnListViewModelFactory provideVpnListViewModelFactory(Context iContext, String aDeviceId) {
        VpnRepository aRepository = provideVpnRepository(iContext, aDeviceId);
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return new VpnListViewModelFactory(aRepository, aAppExecutors);
    }

    public static VpnConnectedViewModelFactory provideVpnConnectedViewModelFactory(Context iContext, String aDeviceId) {
        VpnRepository aRepository = provideVpnRepository(iContext, aDeviceId);
        return new VpnConnectedViewModelFactory(aRepository);
    }

    public static BonusViewModelFactory provideBonusViewModelFactory(Context iContext, String aDeviceId) {
        BonusRepository aBonusRepository = provideBonusRepository(iContext, aDeviceId);
        AppVersionRepository aAppVersionRepository = provideAppVersionRepository();
        return new BonusViewModelFactory(aBonusRepository, aAppVersionRepository);
    }
}