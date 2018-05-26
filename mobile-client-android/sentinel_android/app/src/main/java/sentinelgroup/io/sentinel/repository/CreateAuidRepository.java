package sentinelgroup.io.sentinel.repository;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.MutableLiveData;
import android.os.Environment;
import android.support.annotation.NonNull;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import rx.Single;
import sentinelgroup.io.sentinel.network.api.WebService;
import sentinelgroup.io.sentinel.network.model.Account;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

/**
 * Repository that handles Account objects
 */
public class CreateAuidRepository {
    // For Singleton instantiation
    private static final Object LOCK = new Object();
    private static CreateAuidRepository sInstance;
    private final WebService mWebService;
    private final AppExecutors mAppExecutors;
    private final SingleLiveEvent<Resource<Account>> mAccountMutableLiveData;
    private final SingleLiveEvent<Resource<Account>> mKeystoreFileLiveEvent;

    private CreateAuidRepository(WebService iWebService, AppExecutors iAppExecutors) {
        mWebService = iWebService;
        mAppExecutors = iAppExecutors;
        mAccountMutableLiveData = new SingleLiveEvent<>();
        mKeystoreFileLiveEvent = new SingleLiveEvent<>();
    }

    public static CreateAuidRepository getInstance(WebService iWebService, AppExecutors iAppExecutors) {
        if (sInstance == null) {
            synchronized (LOCK) {
                sInstance = new CreateAuidRepository(iWebService, iAppExecutors);
            }
        }
        return sInstance;
    }

    public SingleLiveEvent<Resource<Account>> getAccountLiveEvent() {
        return mAccountMutableLiveData;
    }

    public SingleLiveEvent<Resource<Account>> getKeystoreFileLiveEvent() {
        return mKeystoreFileLiveEvent;
    }

    public void saveKeystoreFile(Account iData, String iFilePath) {
        mAppExecutors.diskIO().execute(() -> {
            // Create folder
            File aFolder = new File(Environment.getExternalStorageDirectory(), AppConstants.FOLDER_NAME);
            if (!aFolder.exists())
                aFolder.mkdir();
            // Create Keystore File
            File aFile = new File(aFolder, AppConstants.FILE_NAME);
            File aInternalFile = new File(iFilePath);
            // Write to the Keystore File
            try {
                if (!aFile.exists())
                    aFile.createNewFile();
                FileOutputStream aFileStream = new FileOutputStream(aFile);
                FileOutputStream aInternalFileStream = new FileOutputStream(aInternalFile);
                OutputStreamWriter aFileWriter = new OutputStreamWriter(aFileStream);
                OutputStreamWriter aInternalFileWriter = new OutputStreamWriter(aInternalFileStream);
                aFileWriter.append(iData.keystoreString);
                aInternalFileWriter.append(iData.keystoreString);
                aFileWriter.close();
                aInternalFileWriter.close();
                aFileStream.close();
                aInternalFileStream.close();

                iData.keystoreFilePath = aFile.getAbsolutePath();
                mKeystoreFileLiveEvent.postValue(Resource.success(iData));
            } catch (IOException e) {
                mKeystoreFileLiveEvent.postValue(Resource.error(e.getLocalizedMessage(), null));
            }
        });
    }

    // Network call
    public void createNewAccount(GenericRequestBody iRequestBody) {
        mAccountMutableLiveData.postValue(Resource.loading(null));
        mWebService.createNewAccount(iRequestBody).enqueue(new Callback<Account>() {
            @Override
            public void onResponse(@NonNull Call<Account> call, @NonNull Response<Account> response) {
                reportSuccessResponse(response);
            }

            @Override
            public void onFailure(Call<Account> call, Throwable t) {
                reportErrorResponse(null, t.getLocalizedMessage());
            }

            private void reportSuccessResponse(Response<Account> response) {
                if (response != null && response.body() != null) {
                    if (response.body().success)
                        mAccountMutableLiveData.postValue(Resource.success(response.body()));
                    else
                        reportErrorResponse(response, null);
                }
            }

            private void reportErrorResponse(Response<Account> response, String iThrowableLocalMessage) {
                if (response != null && response.body() != null)
                    mAccountMutableLiveData.postValue(Resource.error(response.body().message, response.body()));
                else if (iThrowableLocalMessage != null)
                    mAccountMutableLiveData.postValue(Resource.error(iThrowableLocalMessage, null));
                else
                    mAccountMutableLiveData.postValue(Resource.error("Something went wrong. Please try again later.", null));
            }
        });
    }
}