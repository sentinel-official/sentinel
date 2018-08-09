import { combineReducers } from 'redux';
import { setLanguage, createAccount, setComponent } from './beforeAuth.reducer';
import { setTestNet, getETHBalance, getSentBalance } from './header.reducer';
import { setCurrentTab } from './sidebar.reducer';
import { getAccount } from './dashboard.reducer';
import { setListViewType, setVpnType, getVpnList } from './vpnlist.reducer';
import { getFreeAmount } from './receive.reducer';
import { getAvailableTokens, getSentValue } from './swaps.reducer';

const rootReducer = combineReducers({
    setLanguage,
    createAccount,
    setComponent,
    setTestNet,
    getAccount,
    getETHBalance,
    getSentBalance,
    setCurrentTab,
    setListViewType,
    setVpnType,
    getVpnList,
    getFreeAmount,
    getAvailableTokens,
    getSentValue
});

export default rootReducer;