import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setListViewType, getVpnList, setVpnType } from '../Actions/vpnlist.action';
import VpnListView from './VpnListView';
import VpnMapView from './VpnMapView';

class VpnList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isGetVPNCalled: false
        }
    }

    getVPNs = () => {
        this.props.getVpnList(this.props.vpnType);
    }

    render() {
        let self = this;
        if (!this.state.isGetVPNCalled && this.props.isTest) {
            setInterval(function () {
                self.getVPNs()
            }, 10000);
            this.setState({ isGetVPNCalled: true });
        }
        return (
            <div>
                {
                    this.props.listView === 'list' ?
                        <VpnListView />
                        :
                        <VpnMapView />
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        isTest: state.setTestNet,
        listView: state.setListViewType,
        vpnType: state.setVpnType
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setListViewType,
        getVpnList,
        setVpnType
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(VpnList);