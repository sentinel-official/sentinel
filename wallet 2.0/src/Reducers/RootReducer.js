import { combineReducers } from 'redux';
import { setLanguage, createAccount, setComponent } from './beforeAuth.reducer';
import { setTestNet, getETHBalance, getSentBalance } from './header.reducer';
import { setCurrentTab } from './sidebar.reducer';
import { getAccount } from './dashboard.reducer';
import { setListViewType, setVpnType, getVpnList } from './vpnlist.reducer';
import { getFreeAmount } from './receive.reducer';
import { getEthBalance as getSwapEthBalance, 
    getSentBalance as getSwapSentBalance, 
    getAvailableTokens } from './swaps.reducer';

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
    getSwapEthBalance: getSwapEthBalance,
    getSwapSentBalance: getSwapSentBalance,
    getAvailableTokens
});

export default rootReducer;