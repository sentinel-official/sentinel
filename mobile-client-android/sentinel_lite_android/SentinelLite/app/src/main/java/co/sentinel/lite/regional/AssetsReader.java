/*
 * Copyright (c) 2019 Bernard Che Longho (blongho02@gmail.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

package co.sentinel.lite.regional;

/**
 * @file AssetsReader
 * @author Bernard Che Longho (blongho02@gmail.com)
 * @brief This class reads the contents of any file that is specified in the assets directory
 * @since 2019-02-26
 */

import android.content.Context;
import android.util.Log;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;

class AssetsReader {
    static final String TAG = "AssetsReader";

    /**
     *
     */
    private AssetsReader() {
    }

    /**
     * Read contents from a file
     *
     * @param context the application context
     * @param path the file name. The file should should be saved inside the assets folder
     *
     * @return a string the content as a string
     *   <p>
     *   NB: Call this method in a separate thread if calling from the main thread
     **/
    static String readFromAssets(Context context, final String path) {
        BufferedReader bufferedReader = null;
        try {
            InputStream is = context.getAssets().open(path);
            bufferedReader = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
            int read;

            StringBuilder stringBuffer = new StringBuilder();

            char[] charsRead = new char[1024];
            while ((read = bufferedReader.read(charsRead)) != -1) {
                stringBuffer.append(charsRead, 0, read);
            }
            return stringBuffer.toString();

        } catch (IOException ex) {
            Log.e(TAG, ex.getLocalizedMessage());
            return null;
        } finally {
            if (bufferedReader != null) {
                try {
                    bufferedReader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
