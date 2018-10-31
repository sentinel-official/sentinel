import React, { Component } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import LayoutComponent from './LayoutComponent';
import { getAccount } from '../Actions/dashboard.action';
import { getVPNUsageData } from "../Utils/utils";
import { getVPNConnectedData } from '../Utils/VpnConfig';
import { setTestNet, setWalletType } from '../Actions/header.action';
import { setActiveVpn, setVpnType, setVpnStatus } from './../Actions/vpnlist.action';
import { getKeys, setTMComponent, getTendermintAccount, setTMAccount } from './../Actions/tendermint.action';
import { calculateUsage, getStartValues, socksVpnUsage } from '../Actions/calculateUsage';
import { dashboardStyles } from '../Assets/dashboard.styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

let UsageInterval = null;
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#2196f3'
        }
    }
});

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scene: null,
            lang: 'en'
        }
    }

    componentWillMount = () => {
        this.props.getAccount();
        this.props.setTestNet(false);
        this.props.setWalletType('TM');
        getVPNConnectedData((err, data, sock) => {
            if (err) { }
            else {
                this.props.setTestNet(true);
                this.props.setActiveVpn(data);
                this.props.setVpnType(sock ? 'socks5' : 'openvpn');
                this.props.setVpnStatus(true);
                this.props.setWalletType('ERC');
                getStartValues();
            }
        })
        this.props.getKeys().then(res => {
            if (res.payload.length !== 0) {
                getTendermintAccount((name) => {
                    if (name) {
                        let mainAccount = res.payload.find(obj => obj.name === name)
                        if (mainAccount) {
                            this.props.setTMAccount(mainAccount);
                            this.props.setTMComponent('dashboard');
                        }
                        else {
                            console.log("Account...", mainAccount, name)
                            this.props.setTMComponent('home');
                        }
                    }
                    else {
                        console.log("No Account in TMConfig..", name)
                        this.props.setTMComponent('home');
                    }
                });
            }
            else {
                console.log("No Keys")
                this.props.setTMComponent('home');
            }
        });
    }
    render() {
        if (this.props.vpnStatus && !UsageInterval) {
            UsageInterval = setInterval(async () => {
                if (this.props.vpnType === 'socks5') {
                    calculateUsage(this.props.getAccount, false, (usage) => {
                        this.props.socksVpnUsage(usage);
                    });
                } else {
                    this.props.getVPNUsageData(this.props.isTm ? this.props.tmAccount.address : this.props.walletAddress);
                }
            }, 3000);
        }

        if (!this.props.vpnStatus) {
            if (UsageInterval) {
                clearInterval(UsageInterval);
                UsageInterval = null;
            }
        }
        return (
            <MuiThemeProvider theme={theme}>
                <div>
                    <Header />
                    <div style={dashboardStyles.layoutStyle}>
                        <div style={dashboardStyles.sideBarStyle}>
                            <Sidebar />
                        </div>
                        <div style={dashboardStyles.componentStyle}>
                            <LayoutComponent />
                        </div>
                    </div>
                    <Footer />
                </div>
            </MuiThemeProvider>
        )
    }
}

function mapStateToProps(state) {
    return {
        walletAddress: state.getAccount,
        vpnType: state.vpnType,
        vpnStatus: state.setVpnStatus,
        isTm: state.setTendermint,
        tmAccount: state.setTMAccount,
        data: state.getActiveVpn
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        getAccount,
        getVPNUsageData,
        setActiveVpn,
        setTestNet,
        setWalletType,
        setVpnStatus,
        setVpnType,
        socksVpnUsage,
        getKeys,
        setTMComponent,
        setTMAccount
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(Dashboard);