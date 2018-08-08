import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Swixer from './Swixer';
import VpnList from './VpnList';
import Receive from './Receive';

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
                    return <div>History</div>
                }
            case 'vpnList':
                {
                    return <VpnList />
                }
            case 'receive':
                {
                    return <Receive/>
                }
            case 'vpnHistory':
                {
                    return <div>VPN History</div>
                }
            case 'swixer':
                {
                    return <Swixer />
                }
            default:
                {
                    return <div>Send</div>
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