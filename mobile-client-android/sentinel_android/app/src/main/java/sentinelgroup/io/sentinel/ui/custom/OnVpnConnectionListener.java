package sentinelgroup.io.sentinel.ui.custom;

public interface OnVpnConnectionListener {
    void onVpnConnectionInitiated(String iVpnConfigFilePath);

    void onVpnDisconnectionInitiated();
}
