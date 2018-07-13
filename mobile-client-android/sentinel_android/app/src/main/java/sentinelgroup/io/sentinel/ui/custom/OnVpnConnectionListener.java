package sentinelgroup.io.sentinel.ui.custom;

public interface OnVpnConnectionListener {
    /**
     * Notifies to the observing when a VPN connection is initiated by the VPN client
     *
     * @param iVpnConfigFilePath [String] The absolute path for the VPN Config file which is to be
     *                           used for establishing the connection to the respective node
     */
    void onVpnConnectionInitiated(String iVpnConfigFilePath);

    /**
     * Notifies the observing class when the VPN connection is disconnected/terminated by the VPN
     * client
     */
    void onVpnDisconnectionInitiated();
}
