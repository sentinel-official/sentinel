package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;

import sentinelgroup.io.sentinel.network.model.GenericRequestBody;
import sentinelgroup.io.sentinel.network.model.ReportPay;
import sentinelgroup.io.sentinel.repository.VpnRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Converter;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class VpnSessionViewModel extends ViewModel {
    private final VpnRepository mRepository;
    private final SingleLiveEvent<Resource<ReportPay>> mReportPaymentLiveEvent;

    VpnSessionViewModel(VpnRepository iRepository) {
        mRepository = iRepository;
        mReportPaymentLiveEvent = iRepository.getReportPaymentLiveEvent();
    }

    public SingleLiveEvent<Resource<ReportPay>> getReportPaymentLiveEvent() {
        return mReportPaymentLiveEvent;
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
