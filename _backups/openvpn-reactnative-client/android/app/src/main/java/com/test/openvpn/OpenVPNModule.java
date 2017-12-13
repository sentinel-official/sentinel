package com.test.openvpn;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.test.openvpn.Client;

public class OpenVPNModule extends ReactContextBaseJavaModule {
    private static final String TAG = "OpenVPNModule";
    private static Client client = null;

    public OpenVPNModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return TAG;
    }
    
    @ReactMethod
    public void initClient(Callback callback) {
      try {
        client = new Client("", "", "");
        callback.invoke(null, client);
      } catch (Exception e) {
        System.out.println(e);
        callback.invoke(e, null);
      }
    }
}
