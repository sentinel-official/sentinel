import React, { Component } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import LayoutComponent from './LayoutComponent';
import { getAccount } from '../Actions/dashboard.action';
import { getVPNUsageData } from "../Utils/utils";
import { calculateUsage } from '../Actions/calculateUsage';
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
        localStorage.setItem('isTM', false)
        localStorage.setItem('config', 'MAIN');
    }
    render() {
        console.log("Status...", this.props.vpnStatus);
        if (this.props.vpnStatus && !UsageInterval) {
            UsageInterval = setInterval(() => {
                if (this.props.vpnType === 'SOCKS5') {
                    calculateUsage(this.props.getAccount, this.props.data.vpn_addr, false)
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
        getVPNUsageData
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(Dashboard);