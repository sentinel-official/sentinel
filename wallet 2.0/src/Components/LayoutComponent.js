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
import TMRecoverWallet from './TMRecoverWallet';
import AddNode from './AddNode';

class LayoutComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let component = this.props.currentTab;
        let { isTm, isTest } = this.props;
        if (component !== 'send' && isTm) {
            this.props.payVPNTM({ 'isPayment': false })
        }
        switch (component) {
            case 'history':
                {
                    return isTm ? <TMTransactionsHistory /> : <TxnHistory />;
                }
            case 'vpnList':
                {
                    return <VpnList />
                }
            case 'receive':
                {
                    return isTm ? <TenderMint /> : <Receive />
                }
            case 'vpnHistory':
                {
                    return (
                        <div style={vpnhistoryStyles.contianer}>
                            {isTm ? <TMSessions /> : <VPNHistory />}
                        </div>
                    )
                }

            case 'addNode':
            {
                return (
                    <div style={vpnhistoryStyles.contianer}>
                         <AddNode />                     
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
            case 'recover':
                {
                    return <TMRecoverWallet />
                }
            default:
                {
                    return isTm ? <TMTransfer /> : <SendComponent />
                }
        }
    }
}

function mapStateToProps(state) {
    return {
        currentTab: state.setCurrentTab,
        isTm: state.setTendermint,
        isTest: state.setTestNet
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        payVPNTM
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(LayoutComponent);