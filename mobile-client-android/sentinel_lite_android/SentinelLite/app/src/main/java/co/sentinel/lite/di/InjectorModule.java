package co.sentinel.lite.di;

import android.content.Context;

import co.sentinel.lite.db.AppDatabase;
import co.sentinel.lite.network.api.AppVersionWebService;
import co.sentinel.lite.network.api.BonusWebService;
import co.sentinel.lite.network.api.GenericWebService;
import co.sentinel.lite.network.client.WebClient;
import co.sentinel.lite.repository.AppVersionRepository;
import co.sentinel.lite.repository.BonusRepository;
import co.sentinel.lite.repository.VpnRepository;
import co.sentinel.lite.util.AppExecutors;
import co.sentinel.lite.viewmodel.BonusViewModelFactory;
import co.sentinel.lite.viewmodel.DeviceRegisterViewModelFactory;
import co.sentinel.lite.viewmodel.RatingViewModelFactory;
import co.sentinel.lite.viewmodel.SplashViewModelFactory;
import co.sentinel.lite.viewmodel.VpnConnectedViewModelFactory;
import co.sentinel.lite.viewmodel.VpnViewModelFactory;
import co.sentinel.lite.viewmodel.VpnUsageViewModelFactory;

/**
 * Provides static methods to inject the various classes needed for the application.
 */
public class InjectorModule {
    /* Static private getter methods for Repository classes. */
    private static BonusRepository provideBonusRepository(Context iContext, String aDeviceId) {
        AppDatabase aAppDatabase = AppDatabase.getInstance(iContext.getApplicationContext());
        BonusWebService aBonusWebService = WebClient.getBonusWebService();
        BonusWebService iBonusLongTimeoutWebService = WebClient.getBonusLongTimeoutWebService();
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return BonusRepository.getInstance(aAppDatabase.getBonusInfoEntryDao(), aBonusWebService, iBonusLongTimeoutWebService, aAppExecutors, aDeviceId);
    }

    private static AppVersionRepository provideAppVersionRepository() {
        AppVersionWebService aAppVersionWebService = WebClient.getAppVersionWebService();
        return AppVersionRepository.getInstance(aAppVersionWebService);
    }

    public static VpnRepository provideVpnRepository(Context iContext, String iDeviceId) {
        AppDatabase aAppDatabase = AppDatabase.getInstance(iContext.getApplicationContext());
        GenericWebService aGenericWebService = WebClient.getGenericWebService();
        GenericWebService aGenericRetryWebService = WebClient.getGenericRetryWebService();
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return VpnRepository.getInstance(aAppDatabase.getVpnListEntryDao(), aAppDatabase.getBookmarkDao(), aGenericWebService, aGenericRetryWebService, aAppExecutors, iDeviceId);
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

    public static VpnViewModelFactory provideVpnListViewModelFactory(Context iContext, String aDeviceId) {
        VpnRepository aRepository = provideVpnRepository(iContext, aDeviceId);
        AppExecutors aAppExecutors = AppExecutors.getInstance();
        return new VpnViewModelFactory(aRepository, aAppExecutors);
    }

    public static VpnConnectedViewModelFactory provideVpnConnectedViewModelFactory(Context iContext, String aDeviceId) {
        VpnRepository aRepository = provideVpnRepository(iContext, aDeviceId);
        return new VpnConnectedViewModelFactory(aRepository);
    }

    public static BonusViewModelFactory provideBonusViewModelFactory(Context iContext, String aDeviceId) {
        BonusRepository aBonusRepository = provideBonusRepository(iContext, aDeviceId);
        return new BonusViewModelFactory(aBonusRepository);
    }

    public static RatingViewModelFactory provideRatingViewModelFactory(Context iContext, String iDeviceId) {
        VpnRepository aVpnRepository = provideVpnRepository(iContext, iDeviceId);
        return new RatingViewModelFactory(aVpnRepository);
    }
}