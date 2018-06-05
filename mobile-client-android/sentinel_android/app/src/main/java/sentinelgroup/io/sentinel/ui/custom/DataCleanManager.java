package sentinelgroup.io.sentinel.ui.custom;

import android.content.Context;
import android.os.Environment;

import java.io.File;

public class DataCleanManager {

    public static void cleanCache(Context context) {
        deleteFilesByDirectory(context.getCacheDir());
        cleanExternalCache(context);
    }

    private static void deleteFilesByDirectory(File directory) {
        if (directory != null && directory.exists() && directory.isDirectory()) {
            for (File item : directory.listFiles()) {
                item.delete();
            }
        }
    }

    private static void cleanExternalCache(Context context) {
        if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
            deleteFilesByDirectory(context.getExternalCacheDir());
        }
    }
}
