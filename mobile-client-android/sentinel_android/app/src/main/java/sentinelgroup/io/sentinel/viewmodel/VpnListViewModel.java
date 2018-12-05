package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.List;
import java.util.Locale;

import sentinelgroup.io.sentinel.SentinelApp;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.VpnConfig;
import sentinelgroup.io.sentinel.network.model.VpnCredentials;
import sentinelgroup.io.sentinel.network.model.VpnListEntity;
import sentinelgroup.io.sentinel.repository.VpnRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class VpnListViewModel extends ViewModel {
    private final VpnRepository mRepository;
    private final AppExecutors mAppExecutors;
//    private final LiveData<List<VpnListEntity>> mVpnListLiveData;
    private final SingleLiveEvent<String> mVpnListErrorLiveEvent;
    private final SingleLiveEvent<Resource<VpnCredentials>> mVpnServerCredentialsLiveEvent;
    private final SingleLiveEvent<Resource<VpnConfig>> mVpnConfigLiveEvent;
    private final SingleLiveEvent<Resource<String>> mVpnConfigSaveLiveEvent;

    VpnListViewModel(VpnRepository iRepository, AppExecutors iAppExecutors) {
        mRepository = iRepository;
        mAppExecutors = iAppExecutors;
//        mVpnListLiveData = iRepository.getVpnListLiveDataSortedBy(AppConstants.SORT_BY_DEFAULT);
        mVpnServerCredentialsLiveEvent = iRepository.getVpnServerCredentialsLiveEvent();
        mVpnConfigLiveEvent = iRepository.getVpnConfigLiveEvent();
        mVpnConfigSaveLiveEvent = new SingleLiveEvent<>();
        mVpnListErrorLiveEvent = iRepository.getVpnListErrorLiveEvent();
    }

    /**
     * Get VPN list LiveData sorted by different parameters
     * like
     *
     * @param iSelectedSortType
     * @return
     */
    public LiveData<List<VpnListEntity>> getVpnListLiveDataSortedBy(String iSelectedSortType) {
        return mRepository.getVpnListLiveDataSortedBy(iSelectedSortType);
    }

    public SingleLiveEvent<String> getVpnListErrorLiveEvent() {
        return mVpnListErrorLiveEvent;
    }

    public SingleLiveEvent<Resource<VpnCredentials>> getVpnGetServerCredentials() {
        return mVpnServerCredentialsLiveEvent;
    }

    public SingleLiveEvent<Resource<VpnConfig>> getVpnConfigLiveEvent() {
        return mVpnConfigLiveEvent;
    }

    public SingleLiveEvent<Resource<String>> getVpnConfigSaveLiveEvent() {
        return mVpnConfigSaveLiveEvent;
    }

    public void reloadVpnList() {
        mRepository.getUnoccupiedVpnList();
    }

    public void getVpnServerCredentials(String iVpnAddress) {
        String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        GenericRequestBody aBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .accountAddress(aAccountAddress)
                .vpnAddress(iVpnAddress)
                .build();
        mRepository.getVpnServerCredentials(aBody);
    }

    public void getVpnConfig(VpnCredentials iVpnCredentials) {
        String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        AppPreferences.getInstance().saveString(AppConstants.PREFS_VPN_ADDRESS, iVpnCredentials.vpnAddress);
        GenericRequestBody aBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .accountAddress(aAccountAddress)
                .vpnAddress(iVpnCredentials.vpnAddress)
                .token(iVpnCredentials.token)
                .build();
        String aUrl = String.format(Locale.US, AppConstants.URL_BUILDER, iVpnCredentials.ip, iVpnCredentials.port);
        AppPreferences.getInstance().saveString(AppConstants.PREFS_IP_ADDRESS, iVpnCredentials.ip);
        AppPreferences.getInstance().saveInteger(AppConstants.PREFS_IP_PORT, iVpnCredentials.port);
        AppPreferences.getInstance().saveString(AppConstants.PREFS_VPN_TOKEN, iVpnCredentials.token);
        mRepository.getVpnConfig(aUrl, aBody);
    }

    public void saveCurrentVpnSessionConfig(VpnConfig data) {
        mVpnConfigSaveLiveEvent.postValue(Resource.loading(null));
        String aConfigPath = AppPreferences.getInstance().getString(AppConstants.PREFS_CONFIG_PATH);
        mAppExecutors.diskIO().execute(() -> {
            // Create config file
            File aConfigFile = new File(aConfigPath);
            // Write to the config file
            try {
                // Create Config file if it doesn't exist
                if (!aConfigFile.exists())
                    aConfigFile.createNewFile();
                // Setup FileOutputStream
                FileOutputStream aFileStream = new FileOutputStream(aConfigFile);
                // Setup OutputStreamWriter
                OutputStreamWriter aStreamWriter = new OutputStreamWriter(aFileStream);
                // Write to file
                for (int i = 0; i < data.node.vpn.ovpn.size(); i++) {
                    aStreamWriter.append(data.node.vpn.ovpn.get(i));
                }
                // Close the OutputStreamWriter and FileOutputStream
                aStreamWriter.close();
                aFileStream.close();
                SentinelApp.isVpnInitiated = true;
                mVpnConfigSaveLiveEvent.postValue(Resource.success(aConfigPath));
            } catch (IOException e) {
                mVpnConfigSaveLiveEvent.postValue(Resource.error(e.getLocalizedMessage(), null));
            }
        });
    }
}