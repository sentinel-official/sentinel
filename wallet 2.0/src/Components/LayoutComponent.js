import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import VPNHistory from './VPNHistory';
import { vpnhistoryStyles }from '../Assets/vpnhistory.style';

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
                    return <div>VPN List</div>
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
                    return <div>Swixer</div>
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