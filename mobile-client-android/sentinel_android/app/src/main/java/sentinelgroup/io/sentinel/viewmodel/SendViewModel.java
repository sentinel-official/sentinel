package sentinelgroup.io.sentinel.viewmodel;

import android.arch.lifecycle.ViewModel;

import org.web3j.abi.FunctionEncoder;
import org.web3j.crypto.CipherException;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.TransactionEncoder;
import org.web3j.crypto.WalletUtils;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.Web3jFactory;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.protocol.http.HttpService;
import org.web3j.utils.Numeric;

import java.io.IOException;
import java.math.BigInteger;
import java.util.concurrent.ExecutionException;

import sentinelgroup.io.sentinel.repository.SendRepository;
import sentinelgroup.io.sentinel.util.AppConstants;
import sentinelgroup.io.sentinel.util.AppExecutors;
import sentinelgroup.io.sentinel.util.AppPreferences;
import sentinelgroup.io.sentinel.util.Convert;
import sentinelgroup.io.sentinel.util.Resource;
import sentinelgroup.io.sentinel.util.Sentinel;
import sentinelgroup.io.sentinel.util.SingleLiveEvent;

public class SendViewModel extends ViewModel {
    private final SendRepository mRepository;
    private final AppExecutors mAppExecutors;
    private final SingleLiveEvent<Resource<String>> mTxDataCreationLiveEvent;


    public SendViewModel(SendRepository iRepository, AppExecutors iAppExecutors) {
        mRepository = iRepository;
        mAppExecutors = iAppExecutors;
        mTxDataCreationLiveEvent = new SingleLiveEvent<>();
    }

    public SingleLiveEvent<Resource<String>> getTxDataCreationLiveEvent() {
        return mTxDataCreationLiveEvent;
    }

    public void createEthTransaction(String iToAddress, String iValue, String iGasLimit, String iPassword, String iGasPrice) {
        mTxDataCreationLiveEvent.postValue(Resource.loading(null));
        // create web3j instance
        boolean aIsTest = AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE);
        Web3j aWeb3j = getWeb3jInstance(aIsTest);
        mAppExecutors.diskIO().execute(() -> {
            try {
                // verify password and keystore file
                Credentials aCredentials = WalletUtils.loadCredentials(iPassword, AppPreferences.getInstance().getString(AppConstants.PREFS_FILE_PATH));
                // get Nonce
                EthGetTransactionCount aCount = aWeb3j.ethGetTransactionCount(aCredentials.getAddress(), DefaultBlockParameterName.LATEST).sendAsync().get();
                BigInteger aNonce = aCount.getTransactionCount();
                // get GasPrice
                BigInteger aGasPrice = Convert.toWei(iGasPrice, Convert.EtherUnit.GWEI).toBigInteger();
                // get GasLimit
                BigInteger aGasLimit = BigInteger.valueOf(Long.valueOf(iGasLimit));
                // get Value
                BigInteger aValue = Convert.toWei(iValue, Convert.EtherUnit.ETHER).toBigInteger();
                // get TxData
                RawTransaction aRawTransaction = RawTransaction.createEtherTransaction(aNonce, aGasPrice, aGasLimit, iToAddress, aValue);
                byte[] signedMessage = TransactionEncoder.signMessage(aRawTransaction, aCredentials);
                String aTxData = Numeric.toHexString(signedMessage);
                mTxDataCreationLiveEvent.postValue(Resource.success(aTxData));
            } catch (IOException | CipherException | InterruptedException | ExecutionException e) {
                mTxDataCreationLiveEvent.postValue(Resource.error(e.getLocalizedMessage(), null));
            }
        });
    }

    public void createTokenTransaction(String iToAddress, String iValue, String iGasLimit, String iPassword, String iGasPrice) {
        mTxDataCreationLiveEvent.postValue(Resource.loading(null));
        // create web3j instance
        boolean aIsTest = AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE);
        Web3j aWeb3j = getWeb3jInstance(aIsTest);
        String aSentinelAddress = getSentinelAddress(aIsTest);
        mAppExecutors.diskIO().execute(() -> {
            try {
                // verify password and keystore file
                Credentials aCredentials = WalletUtils.loadCredentials(iPassword, AppPreferences.getInstance().getString(AppConstants.PREFS_FILE_PATH));
                // get Nonce
                EthGetTransactionCount aCount = aWeb3j.ethGetTransactionCount(aCredentials.getAddress(), DefaultBlockParameterName.LATEST).sendAsync().get();
                BigInteger aNonce = aCount.getTransactionCount();
                // get GasPrice
                BigInteger aGasPrice = Convert.toWei(iGasPrice, Convert.EtherUnit.GWEI).toBigInteger();
                // get GasLimit
                BigInteger aGasLimit = BigInteger.valueOf(Long.valueOf(iGasLimit));
                // get Value
                BigInteger aValue = BigInteger.ZERO;
                // get EncodedFunction
                BigInteger aTokenValue = BigInteger.valueOf((long) (Long.parseLong(iValue) * Math.pow(10, 8)));
                Sentinel aSentinel = Sentinel.load(aSentinelAddress, aWeb3j, aCredentials, aGasPrice, aGasLimit);
                String aData = FunctionEncoder.encode(aSentinel.transferSent(iToAddress, aTokenValue));
                // get TxData
                RawTransaction aRawTransaction = RawTransaction.createTransaction(aNonce, aGasPrice, aGasLimit, aSentinelAddress, aValue, aData);
                byte[] signedMessage = TransactionEncoder.signMessage(aRawTransaction, aCredentials);
                String aTxData = Numeric.toHexString(signedMessage);
                mTxDataCreationLiveEvent.postValue(Resource.success(aTxData));
            } catch (IOException | CipherException | InterruptedException | ExecutionException e) {
                mTxDataCreationLiveEvent.postValue(Resource.error(e.getLocalizedMessage(), null));
            }
        });
    }

    private Web3j getWeb3jInstance(boolean isTest) {
        return isTest
                ? Web3jFactory.build(new HttpService(AppConstants.INFURA_URL_TEST_NET))
                : Web3jFactory.build(new HttpService(AppConstants.INFURA_URL_MAIN_NET));
    }

    private String getSentinelAddress(boolean isTest) {
        return isTest
                ? AppConstants.SENTINEL_ADDRESS_TEST_NET
                : AppConstants.SENTINEL_ADDRESS_MAIN_NET;
    }

//    private String getMinimumGasLimit(){
//        boolean aIsTest = AppPreferences.getInstance().getBoolean(AppConstants.PREFS_IS_TEST_NET_ACTIVE);
//        return "";
//    }
}
