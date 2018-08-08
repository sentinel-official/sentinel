import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List, ListItem } from '@material-ui/core';
import lang from '../Constants/language';
import Flag from 'react-world-flags';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { listStyles } from '../Assets/vpnListView.styles';
let Country = window.require('countrynames');

class VpnListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let language = this.props.lang;
        let vpnsList = this.props.availableVpns;
        return (
            <div>
                {
                    vpnsList.length !== 0 ?
                        <List>
                            
                        </List>
                        :
                        <div></div>
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