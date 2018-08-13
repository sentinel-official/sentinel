import { combineReducers } from 'redux';
import { setLanguage, createAccount, setComponent } from './beforeAuth.reducer';
import { setTestNet, getETHBalance, getSentBalance } from './header.reducer';
import { setCurrentTab } from './sidebar.reducer';
import { getAccount } from './dashboard.reducer';
import {getVPNHistory,getSnackMessage,getCompareTransactionStatus,getVPNDuePaymetnDetails} from './vpnHistory.reducer';

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
    getVPNDuePaymetnDetails

});

export default rootReducer;