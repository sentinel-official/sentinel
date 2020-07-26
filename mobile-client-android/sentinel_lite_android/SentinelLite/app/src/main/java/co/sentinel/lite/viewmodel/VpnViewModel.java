package co.sentinel.lite.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.List;

import co.sentinel.lite.SentinelLiteApp;
import co.sentinel.lite.network.model.VpnConfig;
import co.sentinel.lite.network.model.VpnCredentials;
import co.sentinel.lite.network.model.VpnListEntity;
import co.sentinel.lite.repository.VpnRepository;
import co.sentinel.lite.util.AppConstants;
import co.sentinel.lite.util.AppExecutors;
import co.sentinel.lite.util.AppPreferences;
import co.sentinel.lite.util.Resource;
import co.sentinel.lite.util.SingleLiveEvent;

public class VpnViewModel extends ViewModel {
    private final VpnRepository mRepository;
    private final AppExecutors mAppExecutors;
//    private final LiveData<List<VpnListEntity>> mVpnListLiveData;
    private final SingleLiveEvent<String> mVpnListErrorLiveEvent;
    private final SingleLiveEvent<Resource<VpnCredentials>> mVpnServerCredentialsLiveEvent;
    private final SingleLiveEvent<Resource<VpnConfig>> mVpnConfigLiveEvent;
    private final SingleLiveEvent<Resource<String>> mVpnConfigSaveLiveEvent;

    VpnViewModel(VpnRepository iRepository, AppExecutors iAppExecutors) {
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
    public LiveData<List<VpnListEntity>> getVpnListLiveDataSearchSortFilterBy(String iSearchQuery, String iSelectedSortType, boolean toFilterByBookmark) {
        return mRepository.getVpnListLiveDataSortedBy(iSearchQuery, iSelectedSortType, toFilterByBookmark);
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
        mRepository.getVpnServerCredentials(iVpnAddress);
    }

    public void getVpnConfig(VpnCredentials iVpnCredentials) {
        AppPreferences.getInstance().saveString(AppConstants.PREFS_VPN_ADDRESS, iVpnCredentials.vpnAddress);
        AppPreferences.getInstance().saveString(AppConstants.PREFS_IP_ADDRESS, iVpnCredentials.ip);
        AppPreferences.getInstance().saveInteger(AppConstants.PREFS_IP_PORT, iVpnCredentials.port);
        AppPreferences.getInstance().saveString(AppConstants.PREFS_VPN_TOKEN, iVpnCredentials.token);
        mRepository.getVpnConfig(iVpnCredentials.vpnAddress, iVpnCredentials.token, iVpnCredentials.ip, iVpnCredentials.port);
    }

    public void saveCurrentVpnSessionConfig(VpnConfig data) {
        AppPreferences.getInstance().saveString(AppConstants.PREFS_SESSION_NAME, data.sessionName);
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
                SentinelLiteApp.isVpnInitiated = true;
                mVpnConfigSaveLiveEvent.postValue(Resource.success(aConfigPath));
            } catch (IOException e) {
                mVpnConfigSaveLiveEvent.postValue(Resource.error(e.getLocalizedMessage(), null));
            }
        });
    }

    public void toggleVpnBookmark(String iAccountAddress, String iIP) {
        mRepository.toggleVpnBookmark(iAccountAddress, iIP);
    }
}