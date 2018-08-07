import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SendComponent from './SendComponent';

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
                    return <div>VPN History</div>
                }
            case 'swixer':
                {
                    return <div>Swixer</div>
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