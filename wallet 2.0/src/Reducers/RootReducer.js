import { combineReducers } from 'redux';
import { setLanguage, createAccount, setComponent } from './beforeAuth.reducer';
import { setTestNet, getETHBalance, getSentBalance } from './header.reducer';
import { setCurrentTab } from './sidebar.reducer';
import { getAccount } from './dashboard.reducer';
import {getVPNHistory,getSnackMessage,getCompareTransactionStatus,getVPNDuePaymetnDetails} from './vpnHistory.reducer';
import { sendComponentReducer } from './sendcomponent.reducer';
import { setListViewType, setVpnType, getVpnList } from './vpnlist.reducer';
import { testSENTHistory, testETHHistory } from './txnHistoryReducer'

const rootReducer = combineReducers({
    setLanguage,
    createAccount,
    setComponent,
    setTestNet,
    getAccount,
    getETHBalance,
    getSentBalance,
    setCurrentTab,
    getVPNHistory,
    getSnackMessage,
    getVPNDuePaymetnDetails,
    sendComponentReducer,
    setListViewType,
    setVpnType,
    getVpnList,
    testSENTHistory,
    testETHHistory,
});

export default rootReducer;