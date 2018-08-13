import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class VpnMapView extends Component {

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

export default connect(mapStateToProps, mapDispatchToActions)(VpnMapView);