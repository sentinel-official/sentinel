import { combineReducers } from 'redux';
import { setLanguage, createAccount, setComponent } from './beforeAuth.reducer';
import { setTestNet, getETHBalance, getSentBalance } from './header.reducer';
import { setCurrentTab } from './sidebar.reducer';
import { getAccount } from './dashboard.reducer';
import { getFreeAmount } from './receive.reducer';
import { getAvailableTokens, getSentValue } from './swaps.reducer';
import {getVPNHistory,getSnackMessage,getCompareTransactionStatus,getVPNDuePaymentDetails} from './vpnHistory.reducer';
import { sendComponentReducer } from './sendcomponent.reducer';
import { setListViewType, setVpnType, getVpnList } from './vpnlist.reducer';
import { testSENTHistory, testETHHistory } from './txnHistoryReducer';
import { swixRateInState } from './swixReducer';

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
    swixRateInState,
    getSentValue,
    getVPNHistory,
    getSnackMessage,
    getVPNDuePaymentDetails,
    sendComponentReducer,
    setListViewType,
    setVpnType,
    getVpnList,
    testSENTHistory,
    testETHHistory,
});

export default rootReducer;