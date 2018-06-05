package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.LiveData;
import android.arch.lifecycle.ViewModel;

import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.ReportPay;
import sentinelgroup.io.sentinel.network.model.VpnUsage;
import sentinelgroup.io.sentinel.network.model.VpnUsageEntity;
import sentinelgroup.io.sentinel.repository.VpnRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Converter;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class VpnPayViewModel extends ViewModel {
    private final VpnRepository mRepository;
    private final LiveData<VpnUsageEntity> mVpnUsageLiveEvent;
    private final SingleLiveEvent<Resource<ReportPay>> mReportPaymentLiveEvent;

    VpnPayViewModel(VpnRepository iRepository) {
        mRepository = iRepository;
        mVpnUsageLiveEvent = iRepository.getVpnUsageEntity();
        mReportPaymentLiveEvent = iRepository.getReportPaymentLiveEvent();
    }

    private GenericRequestBody getRequestBody() {
        String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        return new GenericRequestBody.GenericRequestBodyBuilder().accountAddress(aAccountAddress).build();
    }

    public LiveData<VpnUsageEntity> getVpnUsageLiveEvent() {
        return mVpnUsageLiveEvent;
    }

    public SingleLiveEvent<Resource<ReportPay>> getReportPaymentLiveEvent() {
        return mReportPaymentLiveEvent;
    }

    public void reloadVpnUsage() {
        mRepository.getVpnUsageForUser(getRequestBody());
    }

    public void reportPayment(String iValue, String iSessionId) {
        String aAccountAddress = AppPreferences.getInstance().getString(AppConstants.PREFS_ACCOUNT_ADDRESS);
        GenericRequestBody aBody = new GenericRequestBody.GenericRequestBodyBuilder()
                .fromAddress(aAccountAddress)
                .amount(Converter.getTokenValue(iValue))
                .sessionId(iSessionId)
                .build();
        mRepository.reportPayment(aBody);
    }
}
