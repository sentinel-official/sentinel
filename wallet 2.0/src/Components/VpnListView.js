import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import EnhancedTable from "./customTable";
import { sessionStyles } from '../Assets/tmsessions.styles';
import lang from '../Constants/language';

let Country = window.require('countrynames');

class VpnListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedList: []
        }
    }

    componentWillReceiveProps(nextProps) {

        let list = nextProps.availableVpns;
        if (nextProps.isTM) {
            list.map((node, i) => {
                node.net_speed = node.netSpeed;
                node.account_addr = node.accountAddress;
                node.price_per_GB = node.pricePerGB;
                node.enc_method = node.encMethod;
                node.ip = node.IP;
            })
        }
        list = list.filter(function (item) {
            return (item.location.city.toLowerCase().search(
                nextProps.query.toLowerCase()
            ) !== -1) || (item.location.country.toLowerCase().search(
                nextProps.query.toLowerCase()
            ) !== -1) ||
            (item.moniker.toLowerCase().search(
                nextProps.query.toLowerCase()
            ) !== -1)
            ||
            (item.version.toLowerCase().search(
                nextProps.query.toLowerCase()
            ) !== -1)
            ||
            (item.nodeType.toLowerCase().search(
                nextProps.query.toLowerCase()
            ) !== -1)
            ||
            (item.pricePerGB.toString().search(
                nextProps.query
            ) !== -1)
            
            ;
        });
        this.setState({ updatedList: list });
    }

    componentDidMount() {
        let list = this.props.availableVpns;
        if (this.props.isTM) {
            list.map((node) => {
                node.net_speed = node.netSpeed;
                node.account_addr = node.accountAddress;
                node.price_per_GB = node.pricePerGB;
                node.enc_method = node.encMethod;
                node.ip = node.IP;
            })
        }
        this.setState({ updatedList: list });
    }

    render() {
        let language = this.props.lang;
        let vpnsList = this.state.updatedList;

        return (
            <div>
                {
                    this.props.loading ?
                        <div style={sessionStyles.noTransactionsStyle}>{lang[language].Loading} </div>
                        :
                        (vpnsList.length !== 0 ?
                            <EnhancedTable data={vpnsList} />
                            :
                            <div style={sessionStyles.noTransactionsStyle}> {lang[language].NodVPNNodes}</div>)
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        availableVpns: state.getVpnList,
        isTM: state.setTendermint
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(VpnListView);