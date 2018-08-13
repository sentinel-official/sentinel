import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TxnHistory from '../containers/txnHistory'
import VPNHistory from './VPNHistory';
import { vpnhistoryStyles }from '../Assets/vpnhistory.style';
import SendComponent from './SendComponent';
import Swixer from './Swixer';
import VpnList from './VpnList';

class LayoutComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        let component = this.props.currentTab;
        switch (component) {
            case 'history':
                {
                    return <TxnHistory/>;
                }
            case 'vpnList':
                {
                    return <VpnList />
                }
            case 'receive':
                {
                    return <div>Receive</div>
                }
            case 'vpnHistory':
                {
                    return  (
                        <div style={vpnhistoryStyles.contianer}>
                    <VPNHistory />
                    </div>)
                }
            case 'swixer':
                {
                    return <Swixer />
                }
            default:
                {
                    return <div><SendComponent/></div>
                }
        }
    }
}

function mapStateToProps(state) {
    return {
        currentTab: state.setCurrentTab
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(LayoutComponent);