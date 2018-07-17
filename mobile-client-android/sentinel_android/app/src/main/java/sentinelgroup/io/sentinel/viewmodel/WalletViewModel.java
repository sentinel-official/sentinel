package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;

import java.math.BigDecimal;
import java.util.Locale;

import sentinelgroup.io.sentinel.network.model.Chains;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.repository.WalletRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Convert;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class WalletViewModel extends ViewModel {
    private final WalletRepository mRepository;
    private final LiveData<Chains> mBalanceLiveData;
    private final SingleLiveEvent<String> mBalanceErrorLiveEvent;
    private final GenericRequestBody mBody;

    WalletViewModel(WalletRepository iRepository) {
        mRepository = iRepository;
        mBody = new GenericRequestBody.GenericRequestBodyBuilder().accountAddress(getAddress()).build();
        mBalanceLiveData = iRepository.getBalanceLiveData(mBody);
        mBalanceErrorLiveEvent = iRepository.getBalanceErrorLiveEvent();
    }

    public LiveData<Chains> getBalanceLiveData() {
        return mBalanceLiveData;
    }

    public SingleLiveEvent<String> getBalanceErrorLiveEvent() {
        return mBalanceErrorLiveEvent;
    }

    public String getAddress() {
        return AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
    }

    public Chains updateBalance(boolean isChecked) {
        return mBalanceLiveData.getValue();
    }

    public String getFormattedEthBalance(double iEthValue) {
        BigDecimal aEth = Convert.fromWei(BigDecimal.valueOf(iEthValue), Convert.EtherUnit.ETHER);
        return String.format(Locale.US, "%.8f", aEth);
    }

    public String getFormattedSentBalance(double iSentValue) {
        iSentValue /= Math.pow(10, 8);
        return String.format(Locale.US, iSentValue % 1 == 0 ? "%.0f" : "%.7f", iSentValue);
    }

    public void reloadBalance() {
        mRepository.updateBalance(mBody);
    }
}
