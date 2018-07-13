package sentinelgroup.io.sentinel.ui.custom;

import android.content.Context;
import android.os.Environment;

import java.io.File;

public class DataCleanManager {

    /**
     * Cleans the cache directory
     *
     * @param iContext [Context] Context
     */
    public static void cleanCache(Context iContext) {
        deleteFilesByDirectory(iContext.getCacheDir());
        cleanExternalCache(iContext);
    }

    /**
     * Cleans the external cache directory
     *
     * @param iContext [Context] Context
     */
    private static void cleanExternalCache(Context iContext) {
        if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
            deleteFilesByDirectory(iContext.getExternalCacheDir());
        }
    }

    /**
     * Deletes the file
     *
     * @param iFile [File] The file which is to be deleted
     */
    private static void deleteFilesByDirectory(File iFile) {
        if (iFile != null && iFile.exists() && iFile.isDirectory()) {
            for (File aItem : iFile.listFiles()) {
                aItem.delete();
            }
        }
    }
}