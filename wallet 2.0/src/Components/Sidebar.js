import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { menuItems } from '../Constants/constants';
import { sidebarStyles } from '../Assets/sidebar.styles';
import { setCurrentTab } from '../Actions/sidebar.action';
import MenuIcon from '@material-ui/icons/Menu';
import { Drawer, IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';

const Customstyles = theme => ({
    paper: {
        height: 522,
        top: 70,
        width: 180
    }
});

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDrawer: false
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

    toggleDrawer = (value) => () => {
        this.setState({ openDrawer: value })
    }

    render() {
        let { classes } = this.props;
        let currentTab = this.props.currentTab;
        let isTest = this.props.isTest;
        return (
            <div>
                <div style={sidebarStyles.menuIconStyle}>
                    <MenuIcon onClick={this.toggleDrawer(true)} />
                </div>
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
                                        <MenuIcon />
                                    </label>
                                </div>
                                <hr style={{ margin: 0 }} />
                            </div>
                        )
                    })
                }
                <Drawer
                    open={this.state.openDrawer}
                    onClose={this.toggleDrawer(false)}
                    classes={{ paper: classes.paper }}
                >
                    <div
                        tabIndex={0}
                        role="button"
                    >
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
                </Drawer>
            </div>
        )
    }
}

Sidebar.propTypes = {
    classes: PropTypes.object.isRequired
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

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(Sidebar);