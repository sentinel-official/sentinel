package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;

import sentinelgroup.io.sentinel.network.model.Balance;
import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.repository.WalletRepository;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class WalletViewModel extends ViewModel{
    private final WalletRepository mRepository;
    private final LiveData<Resource<Balance>> mBalanceLiveData;
    private final SingleLiveEvent<Boolean> mTokenAlertLiveEvent;
    private final GenericRequestBody mBody;

    WalletViewModel(WalletRepository iRepository, String iAccountAddress) {
        mRepository = iRepository;
        mBody = new GenericRequestBody.GenericRequestBodyBuilder().accountAddress(iAccountAddress).build();
        mBalanceLiveData = iRepository.getBalanceMutableLiveData(mBody);
        mTokenAlertLiveEvent = iRepository.getTokenAlertLiveEvent();
    }

    public LiveData<Resource<Balance>> getBalanceLiveData() {
        return mBalanceLiveData;
    }

    public SingleLiveEvent<Boolean> getTokenAlertLiveEvent() {
        return mTokenAlertLiveEvent;
    }

    public void updateBalance(){
        mRepository.getBalanceMutableLiveData(mBody);
    }

    public double getFormattedEthBalance(double iEthValue) {
        if (iEthValue!= 0)
            iEthValue /= Math.pow(10, 18);
        return iEthValue;
    }

    public double getFormattedSentBalance(double iSentValue) {
        if(iSentValue!=0)
            iSentValue  /= Math.pow(10, 8);
        return iSentValue;
    }
}
