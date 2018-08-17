import React, { Component } from 'react';
import { CircularProgress } from '@material-ui/core'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setListViewType, getVpnList, setVpnType } from '../Actions/vpnlist.action';
import CustomTextfield from "./customTextfield";
import VpnListView from './VpnListView';
import VpnMapView from './VpnMapView';
import CustomButton from "./customButton";
import {margin} from "../Assets/commonStyles";

class VpnList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isGetVPNCalled: false,
                dVpnQuery: ''
        }
    }

    getVPNs = () => {
        this.props.getVpnList(this.props.vpnType);
    };

    componentWillMount = () => {
        this.props.getVpnList(this.props.vpnType);
    };

    render() {
        console.log(this.props.vpnList, 'list here');

        // let self = this;
        // if (!this.state.isGetVPNCalled && this.props.isTest) {
        //     setInterval(function () {
        //         self.getVPNs()
        //     }, 10000);
        //     this.setState({ isGetVPNCalled: true });
        // }
        return (
            <div>
                <div style={{ display: 'flex' }} >
                    <div>
                        <CustomTextfield type={'text'} onChange={ (e) => { this.setState({ dVpnQuery: e.target.value }) } } />
                    </div>
                    <div style={ margin }>
                        <CustomButton color={'#FFFFFF'}  label={'LIST'} active={!this.state.isActive}
                                      onClick={this.testSentHistory} />
                    </div>
                    <div style={ margin }>
                        <CustomButton color={'#F2F2F2'} label={'MAP'} active={this.state.isActive}
                                      onClick={this.testEthHistory}/>
                    </div>
                </div>
                {
                    this.props.vpnList.length === 0 ?
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} ><CircularProgress size={50} /></div> :
                    this.props.listView === 'list' ?
                        <div style={{ maxWidth: 895, marginLeft: 20 }} >
                            <VpnListView query={this.state.dVpnQuery} />
                        </div>
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
        vpnType: state.setVpnType,
        vpnList: state.getVpnList
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