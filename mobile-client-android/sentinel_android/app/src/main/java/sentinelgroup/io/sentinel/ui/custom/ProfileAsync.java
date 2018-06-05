package sentinelgroup.io.sentinel.ui.custom;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
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

import de.blinkt.openvpn.VpnProfile;
import de.blinkt.openvpn.core.ConfigParser;
import de.blinkt.openvpn.core.ProfileManager;

/**
 * ==================================================
 * Created by wang on 2017/11/15. gentlewxy@163.com
 * Description:
 * ==================================================
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
        } else if (!isNetworkAvailable(context)) {
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
        void onProfileLoadSuccess();

        void onProfileLoadFailed(String msg);
    }

    private boolean isNetworkAvailable(Context context) {
        ConnectivityManager connectivityManager = (ConnectivityManager) context.getApplicationContext().getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connectivityManager == null) {
            return false;
        }
        NetworkInfo info = connectivityManager.getActiveNetworkInfo();
        return info != null && info.isAvailable() && info.isConnected();
    }
}
