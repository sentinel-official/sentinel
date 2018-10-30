import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Receive from './Receive';
import Swaps from './Swaps';
import TenderMint from './TenderMint';
import TxnHistory from '../containers/txnHistory'
import VPNHistory from './VPNHistory';
import { vpnhistoryStyles } from '../Assets/vpnhistory.style';
import { payVPNTM } from '../Actions/vpnlist.action';
import SendComponent from './SendComponent';
import Swixer from './Swixer';
import VpnList from './VpnList';
import TMSessions from './TMSessions';
import TMTransactionsHistory from './TMTransactionsHistory';
import TMTransfer from './TMTransfer';

class LayoutComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let component = this.props.currentTab;
        if (component !== 'transfer' && this.props.isTM) {
            this.props.payVPNTM({ 'isPayment': false })
        }
        switch (component) {
            case 'history':
                {
                    return <TxnHistory />;
                }
            case 'vpnList':
                {
                    return <VpnList />
                }
            case 'receive':
                {
                    return <Receive />
                }
            case 'vpnHistory':
                {
                    return (
                        <div style={vpnhistoryStyles.contianer}>
                            <VPNHistory />
                        </div>
                    )
                }
            case 'swixer':
                {
                    return <Swixer />
                }
            case 'swaps':
                {
                    return <Swaps />
                }
            case 'tmint':
                {
                    return <TenderMint />
                }
            case 'transfer':
                {
                    return <TMTransfer />
                }
            case 'tmTxHistory':
                {
                    return <TMTransactionsHistory />
                }
            case 'tmVpnHistory':
                {
                    return <TMSessions />
                }
            default:
                {
                    return <div><SendComponent /></div>
                }
        }
    }
}

function mapStateToProps(state) {
    return {
        currentTab: state.setCurrentTab,
        isTM: state.setTendermint,
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        payVPNTM
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(LayoutComponent);