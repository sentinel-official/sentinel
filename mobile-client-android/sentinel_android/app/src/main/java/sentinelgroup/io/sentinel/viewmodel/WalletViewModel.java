package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;

import java.math.BigDecimal;
import java.util.Locale;

import sentinelgroup.io.sentinel.network.model.Balance;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.repository.WalletRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Convert;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class WalletViewModel extends ViewModel {
    private final WalletRepository mRepository;
    private final LiveData<Resource<Balance>> mBalanceLiveData;
    private final SingleLiveEvent<Boolean> mTokenAlertLiveEvent;
    private final GenericRequestBody mBody;

    WalletViewModel(WalletRepository iRepository) {
        mRepository = iRepository;
        mBody = new GenericRequestBody.GenericRequestBodyBuilder().accountAddress(getAddress()).build();
        mBalanceLiveData = iRepository.getBalanceMutableLiveData(mBody);
        mTokenAlertLiveEvent = iRepository.getTokenAlertLiveEvent();
    }

    public LiveData<Resource<Balance>> getBalanceLiveData() {
        return mBalanceLiveData;
    }

    public SingleLiveEvent<Boolean> getTokenAlertLiveEvent() {
        return mTokenAlertLiveEvent;
    }

    public String getAddress() {
        return AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
    }

    public void updateBalance() {
        mRepository.getBalanceMutableLiveData(mBody);
    }

    public String getFormattedEthBalance(double iEthValue) {
        BigDecimal aEth = Convert.fromWei(BigDecimal.valueOf(iEthValue), Convert.EtherUnit.ETHER);
        return String.format(Locale.getDefault(), "%.8f", aEth);
    }

    public String getFormattedSentBalance(double iSentValue) {
        iSentValue /= Math.pow(10, 8);
        return String.format(Locale.getDefault(), iSentValue % 1 == 0 ? "%.0f" : "%.7f", iSentValue);
    }
}
