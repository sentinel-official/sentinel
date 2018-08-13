import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List, ListItem, ListItemText, Divider } from '@material-ui/core';
import lang from '../Constants/language';
import Flag from 'react-world-flags';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { listStyles } from '../Assets/vpnListView.styles';
import EnhancedTable from "./customTable";
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
            list = list.filter(function (item) {
                return (item.location.city.toLowerCase().search(
                    nextProps.query.toLowerCase()
                ) !== -1) || (item.location.country.toLowerCase().search(
                    nextProps.query.toLowerCase()
                ) !== -1);
            });
            this.setState({ updatedList: list });
    }



    render() {
        console.log('dvpn query', this.props.query);
        let language = this.props.lang;
        let vpnsList = this.state.updatedList;

        return (
            <div>
                {
                    vpnsList.length !== 0 ?
                        <EnhancedTable/>
                        :
                        <div/>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        availableVpns: state.getVpnList
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(VpnListView);