import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { menuItems, disabledItemsMain, disabledItemsTest, disabledItemsTM } from '../Constants/constants';
import { sidebarStyles } from '../Assets/sidebar.styles';
import { setCurrentTab } from '../Actions/sidebar.action';
import MenuIcon from '@material-ui/icons/Menu';
import HistoryIcon from '@material-ui/icons/History';
import SendIcon from '@material-ui/icons/Send';
import SwapIcon from '@material-ui/icons/SwapHoriz';
import SwixerIcon from '@material-ui/icons/SwapHorizontalCircle';
import ListIcon from '@material-ui/icons/List';
import ReceiveIcon from '@material-ui/icons/CallReceived';
import VpnHisIcon from '@material-ui/icons/VpnLock';
import BackIcon from '@material-ui/icons/KeyboardBackspace';
import { Drawer, IconButton, Tooltip } from '@material-ui/core';
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
        this.components = {
            sendIcon: SendIcon,
            historyIcon: HistoryIcon,
            receiveIcon: ReceiveIcon,
            listIcon: ListIcon,
            vpnHisIcon: VpnHisIcon,
            swixerIcon: SwixerIcon,
            swapIcon: SwapIcon
        }
    }

    setMenu = (item) => {
        if (!this.props.isTenderMint) {
            if (!this.props.isTest &&
                disabledItemsMain.includes(item.value)) { }
            else if (this.props.isTest && disabledItemsTest.includes(item.value)) { }
            else {
                this.props.setCurrentTab(item.value);
            }
        }
        else {
            if (disabledItemsTM.includes(item.value)) { }
            else {
                this.props.setCurrentTab(item.value);
            }
        }

    }

    toggleDrawer = (value) => () => {
        this.setState({ openDrawer: value })
    }

    getIcon = (iconName) => {
        if (iconName === 'tmintIcon') {
            if (!this.props.isTenderMint)
                return <img src={'../src/Images/tendermint-disable.png'} style={{ width: 24, height: 24 }} />
            else
                return <img src={'../src/Images/tendermint.png'} style={{ width: 24, height: 24 }} />
        }
        else {
            let Icon = this.components[iconName];
            return <Icon />
        }
    }

    render() {
        let { classes, isTest, isTenderMint } = this.props;
        let currentTab = this.props.currentTab;
        return (
            <div>
                <div style={sidebarStyles.activeDivStyle}>
                    <Tooltip title="Toggle Menu">
                        <MenuIcon onClick={this.toggleDrawer(true)} />
                    </Tooltip>
                </div>
                {
                    menuItems.map((item) => {
                        let isDisabled = !isTenderMint ? (!isTest && disabledItemsMain.includes(item.value))
                            || (isTest && disabledItemsTest.includes(item.value)) : disabledItemsTM.includes(item.value);
                        return (
                            <div>
                                <div style={
                                    isDisabled ?
                                        sidebarStyles.disabledDivStyle :
                                        (item.value === currentTab ?
                                            sidebarStyles.currentDivStyle :
                                            sidebarStyles.activeDivStyle)
                                } onClick={() => { this.setMenu(item); }}>
                                    <Tooltip title={item.name}>
                                        <label
                                            style={
                                                isDisabled
                                                    ?
                                                    sidebarStyles.disabledLabelStyle :
                                                    (item.value === currentTab ?
                                                        sidebarStyles.activeLabelStyle :
                                                        sidebarStyles.normalLabelStyle)
                                            }>
                                            {this.getIcon(item.icon)}
                                        </label>
                                    </Tooltip>
                                </div>
                                <hr style={sidebarStyles.m_0} />
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
                        style={sidebarStyles.outlineNone}
                    >
                        {
                            menuItems.map((item) => {
                                let isDisabled = !isTenderMint ? (!isTest && disabledItemsMain.includes(item.value))
                                    || (isTest && disabledItemsTest.includes(item.value)) : disabledItemsTM.includes(item.value);
                                return (
                                    <div>
                                        <div style={
                                            isDisabled ?
                                                sidebarStyles.disabledDivStyle :
                                                (item.value === currentTab ?
                                                    sidebarStyles.currentDivStyle :
                                                    sidebarStyles.activeDivStyle)
                                        } onClick={() => { this.setMenu(item); }}>
                                            <label
                                                style={
                                                    isDisabled
                                                        ?
                                                        sidebarStyles.disabledLabelStyle :
                                                        (item.value === currentTab ?
                                                            sidebarStyles.activeLabelStyle :
                                                            sidebarStyles.normalLabelStyle)
                                                }>
                                                {item.name}
                                            </label>
                                        </div>
                                        <hr style={sidebarStyles.m_0} />
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
        currentTab: state.setCurrentTab,
        isTenderMint: state.setTendermint
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setCurrentTab
    }, dispatch)
}

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(Sidebar);
