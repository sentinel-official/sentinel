import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List, ListItem } from '@material-ui/core';
import lang from '../Constants/language';
import Flag from 'react-world-flags';
import { Grid, Row, Col } from 'react-flexbox-grid';

class VpnListView extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let language = this.props.lang;
        return (
            <div>Hello</div>
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