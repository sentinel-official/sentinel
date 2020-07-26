package co.sentinel.lite.ui.custom;

import android.content.Context;
import android.os.AsyncTask;
import android.os.Build;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.ref.WeakReference;
import java.net.MalformedURLException;
import java.util.Collection;

import co.sentinel.lite.util.NetworkUtil;
import de.blinkt.openvpn.VpnProfile;
import de.blinkt.openvpn.core.ConfigParser;
import de.blinkt.openvpn.core.ProfileManager;

/**
 * An AsyncTask to create a VPN profile from the VPN config file with callback
 */
public class ProfileAsync extends AsyncTask<Void, Void, Boolean> {
    private WeakReference<Context> context;
    private String mPath;
    private OnProfileLoadListener onProfileLoadListener;

    public ProfileAsync(Context context, String iPath, OnProfileLoadListener onProfileLoadListener) {
        this.context = new WeakReference<>(context);
        mPath = iPath;
        this.onProfileLoadListener = onProfileLoadListener;
    }

    @Override
    protected void onPreExecute() {
        super.onPreExecute();
        Context context = this.context.get();
        if (context == null || onProfileLoadListener == null) {
            cancel(true);
        } else if (!NetworkUtil.isOnline()) {
            cancel(true);
            onProfileLoadListener.onProfileLoadFailed("No Network");
        }
    }

    @Override
    protected Boolean doInBackground(Void... voids) {
        try {
            DataCleanManager.cleanCache(context.get());
            InputStream conf = new FileInputStream(mPath);
            InputStreamReader reader = new InputStreamReader(conf);
            BufferedReader bufferedReader = new BufferedReader(reader);
            ConfigParser cp = new ConfigParser();
            cp.parseConfig(bufferedReader);
            VpnProfile vp = cp.convertProfile();
            ProfileManager vpl = ProfileManager.getInstance(context.get());
            vp.mName = Build.MODEL;//
            vp.mUsername = null;
            vp.mPassword = null;
            Collection<VpnProfile> profiles = vpl.getProfiles();
            for (VpnProfile p : profiles)
                vpl.removeProfile(context.get(), p);
            vpl.addProfile(vp);
            vpl.saveProfile(context.get(), vp);
            vpl.saveProfileList(context.get());
            reader.close();
            conf.close();
            return true;
        } catch (MalformedURLException e) {
            cancel(true);
            onProfileLoadListener.onProfileLoadFailed("MalformedURLException");
        } catch (ConfigParser.ConfigParseError configParseError) {
            cancel(true);
            onProfileLoadListener.onProfileLoadFailed("ConfigParseError");
        } catch (IOException e) {
            cancel(true);
            onProfileLoadListener.onProfileLoadFailed("IOException");
        }
        return false;
    }

    @Override
    protected void onPostExecute(Boolean aVoid) {
        super.onPostExecute(aVoid);
        if (aVoid) {
            onProfileLoadListener.onProfileLoadSuccess();
        } else {
            onProfileLoadListener.onProfileLoadFailed("unknown error");
        }
    }

    public interface OnProfileLoadListener {
        /**
         * This method notifies the observer that the VPN profile has been loaded successfully
         */
        void onProfileLoadSuccess();

        /**
         * This method notifies the observer that the VPN profile loading failed
         *
         * @param iMessage [String] Error message to describe the cause for profile loading failure
         */
        void onProfileLoadFailed(String iMessage);
    }
}