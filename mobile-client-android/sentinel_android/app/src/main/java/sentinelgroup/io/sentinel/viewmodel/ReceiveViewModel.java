package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;
import android.graphics.Bitmap;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.journeyapps.barcodescanner.BarcodeEncoder;

import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class ReceiveViewModel extends ViewModel {
    private final SingleLiveEvent<Resource<Bitmap>> mQrCodeLiveEvent;
    private final AppExecutors mAppExecutors;

    ReceiveViewModel(AppExecutors iAppExecutors) {
        mAppExecutors = iAppExecutors;
        mQrCodeLiveEvent = new SingleLiveEvent<>();
    }

    public LiveData<Resource<Bitmap>> getQrCodeLiveEvent() {
        generateQrCode(getAddress());
        return mQrCodeLiveEvent;
    }

    private void generateQrCode(String iAddress) {
        mAppExecutors.diskIO().execute(() -> {
            MultiFormatWriter aWriter = new MultiFormatWriter();
            try {
                BitMatrix aBitMatrix = aWriter.encode(iAddress, BarcodeFormat.QR_CODE, 200, 200);
                BarcodeEncoder aEncoder = new BarcodeEncoder();
                Bitmap aBitmap = aEncoder.createBitmap(aBitMatrix);
                mQrCodeLiveEvent.postValue(Resource.success(aBitmap));
            } catch (WriterException e) {
                mQrCodeLiveEvent.postValue(Resource.error(e.getLocalizedMessage(), null));
            }
        });
    }

    public String getAddress() {
        return AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
    }
}
