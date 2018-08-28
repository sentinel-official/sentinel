import { combineReducers } from 'redux';
import { setLanguage, createAccount, setComponent } from './beforeAuth.reducer';
import { setTestNet, getETHBalance, getSentBalance, setTendermint } from './header.reducer';
import { setCurrentTab } from './sidebar.reducer';
import { getAccount } from './dashboard.reducer';
import { getFreeAmount } from './receive.reducer';
import { getAvailableTokens, getSentValue } from './swaps.reducer';
import { getVPNHistory, getSnackMessage, getCompareTransactionStatus, getVPNDuePaymentDetails } from './vpnHistory.reducer';
import { sendComponentReducer } from './sendcomponent.reducer';
import { setListViewType, setVpnType, getVpnList, setVpnStatus, payVPNTM } from './vpnlist.reducer';
import { testSENTHistory, testETHHistory } from './txnHistoryReducer'
import { connectVPNReducer } from './connectVPN.reducer'
import { initPaymentDetails } from './initPayment.reducer';
import { VPNUsage } from './vpnUsage'
import { getKeys, setTMComponent, tmBalance } from './tendermint.reducer';
import { createTMAccount } from './createTM.reducer';
import { socksReducer } from './SOCKSReducer';

const rootReducer = combineReducers({
    setLanguage,
    createAccount,
    setComponent,
    setTestNet,
    getAccount,
    getETHBalance,
    getSentBalance,
    setCurrentTab,
    getFreeAmount,
    getAvailableTokens,
    getSentValue,
    getVPNHistory,
    getSnackMessage,
    getVPNDuePaymentDetails,
    sendComponentReducer,
    setListViewType,
    vpnType: setVpnType,
    getVpnList,
    testSENTHistory,
    testETHHistory,
    connectVPNReducer,
    initPaymentDetails,
    VPNUsage,
    setVpnStatus,
    getKeys,
    setTMComponent,
    createTMAccount,
    tmBalance,
    socksReducer,
    setVpnStatus,
    setTendermint,
    payVPNTM
});

export default rootReducer;