package sentinelgroup.io.sentinel.util;

import com.amplitude.api.Amplitude;

public class AnalyticsHelper {

    private static final String EN_OVPN_CONNECT_INIT = "ovpn_connect_init";
    private static final String EN_OVPN_CONNECT_DONE = "ovpn_connect_done";
    private static final String EN_OVPN_DISCONNECT_INIT = "ovpn_disconnect_init";
    private static final String EN_OVPN_DISCONNECT_DONE = "ovpn_disconnect_done";

    public static void triggerOVPNConnectInit() {
        Amplitude.getInstance().logEvent(EN_OVPN_CONNECT_INIT);
    }

    public static void triggerOVPNConnectDone() {
        Amplitude.getInstance().logEvent(EN_OVPN_CONNECT_DONE);
    }

    public static void triggerOVPNDisconnectInit() {
        Amplitude.getInstance().logEvent(EN_OVPN_DISCONNECT_INIT);
    }

    public static void triggerOVPNDisconnectDone() {
        Amplitude.getInstance().logEvent(EN_OVPN_DISCONNECT_DONE);
    }
}
