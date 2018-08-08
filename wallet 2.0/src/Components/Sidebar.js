import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { menuItems } from '../Constants/constants';
import { sidebarStyles } from '../Assets/sidebar.styles';
import { setCurrentTab } from '../Actions/sidebar.action';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    setMenu = (item) => {
        if (!this.props.isTest &&
            (item.value === 'vpnList' || item.value === 'vpnHistory')) { }
        else if (this.props.isTest && item.value === 'swixer') { }
        else {
            this.props.setCurrentTab(item.value);
        }
    }

    render() {
        let currentTab = this.props.currentTab;
        let isTest = this.props.isTest;
        return (
            <div>
                {
                    menuItems.map((item) => {
                        return (
                            <div>
                                <div style={
                                    !isTest && (item.value === 'vpnList' || item.value === 'vpnHistory') ?
                                        sidebarStyles.disabledDivStyle : sidebarStyles.activeDivStyle
                                } onClick={() => { this.setMenu(item); }}>
                                    <label
                                        style={
                                            (!isTest && (item.value === 'vpnList' || item.value === 'vpnHistory'))
                                                || (isTest && (item.value === 'swixer'))
                                                ?
                                                sidebarStyles.disabledLabelStyle :
                                                (item.value === currentTab ?
                                                    sidebarStyles.activeLabelStyle :
                                                    sidebarStyles.normalLabelStyle)
                                        }>
                                        {item.name}
                                    </label>
                                </div>
                                <hr style={{ margin: 0 }} />
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        isTest: state.setTestNet,
        currentTab: state.setCurrentTab
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setCurrentTab
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(Sidebar);