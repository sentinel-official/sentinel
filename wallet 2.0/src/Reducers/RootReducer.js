import { combineReducers } from 'redux';
import { setLanguage, createAccount, setComponent } from './beforeAuth.reducer';
import { setTestNet, getETHBalance, getSentBalance } from './header.reducer';
import { setCurrentTab } from './sidebar.reducer';
import { getAccount } from './dashboard.reducer';
import { sendComponentReducer } from './sendcomponent.reducer';
import { setListViewType, setVpnType, getVpnList } from './vpnlist.reducer';

const rootReducer = combineReducers({
    setLanguage,
    createAccount,
    setComponent,
    setTestNet,
    getAccount,
    getETHBalance,
    getSentBalance,
    setCurrentTab,
    sendComponentReducer,
    setListViewType,
    setVpnType,
    getVpnList
});

export default rootReducer;