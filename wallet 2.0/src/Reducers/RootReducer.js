import { combineReducers } from 'redux';
import { setLanguage, createAccount, setComponent } from './beforeAuth.reducer';
import { setTestNet, getETHBalance, getSentBalance, setTendermint, getWalletType } from './header.reducer';
import { setCurrentTab } from './sidebar.reducer';
import { getAccount } from './dashboard.reducer';
import { getFreeAmount } from './receive.reducer';
import { getAvailableTokens, getSentValue } from './swaps.reducer';
import { getVPNHistory, getSnackMessage, getVPNDuePaymentDetails } from './vpnHistory.reducer';
import { sendComponentReducer } from './sendcomponent.reducer';
import { setListViewType, setVpnType, getVpnList, setVpnStatus, payVPNTM, getActiveVpn, getCurrentVpn } from './vpnlist.reducer';
import { swixRateInState } from './swixReducer';
import { testSENTHistory, testETHHistory } from './txnHistoryReducer'
import { connectVPNReducer } from './connectVPN.reducer'
import { initPaymentDetails } from './initPayment.reducer';
import { VPNUsage } from './vpnUsage'
import { getKeys, setTMComponent, tmBalance, setTMAccount } from './tendermint.reducer';
import { createTMAccount } from './createTM.reducer';
import { getSessionInfo, sessionHistory } from './tmvpn.reducer';
import { getDockerImages, getDockerContainers, getImagesClients, isLoggedOutNode , connectionStatus} from './node.reducer';
import { networkChange } from './NetworkChange'

const rootReducer = combineReducers({
    setLanguage,
    createAccount,
    setComponent,
    setTestNet,
    getWalletType,
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
    vpnType: setVpnType,
    getVpnList,
    testSENTHistory,
    testETHHistory,
    connectVPNReducer,
    initPaymentDetails,
    VPNUsage,
    getKeys,
    setTMComponent,
    createTMAccount,
    tmBalance,
    setVpnStatus,
    setTendermint,
    payVPNTM,
    setTMAccount,
    sessionInfo: getSessionInfo,
    networkChange,
    getActiveVpn,
    getCurrentVpn,
    sessionHistory,
    getDockerImages,
    getDockerContainers,
    getImagesClients,
    isLoggedOutNode,
    connectionStatus
});

export default rootReducer;