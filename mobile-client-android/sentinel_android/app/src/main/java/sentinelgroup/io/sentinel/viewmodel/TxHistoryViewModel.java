package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;

import java.util.List;

import sentinelgroup.io.sentinel.network.model.TxResult;
import sentinelgroup.io.sentinel.repository.TxHistoryRepository;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class TxHistoryViewModel extends ViewModel {
    private final TxHistoryRepository mRepository;
    private final SingleLiveEvent<Resource<List<TxResult>>> mTxHistoryLiveEvent;

    TxHistoryViewModel(TxHistoryRepository iRepository) {
        mRepository = iRepository;
        mTxHistoryLiveEvent = iRepository.getTxHistoryLiveEvent(false);
    }

    public SingleLiveEvent<Resource<List<TxResult>>> getTxHistoryLiveEvent() {
        return mTxHistoryLiveEvent;
    }

    public void reloadTxHistory(boolean isEthHistory) {
        mRepository.reloadTxHistory(isEthHistory);
    }
}