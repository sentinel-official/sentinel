import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { menuItems, TMmenuItems, menuItemsIcons, disabledItemsMain, disabledItemsTest, disabledItemsTM } from '../Constants/constants';
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
import BackArrowIcon from '@material-ui/icons/ArrowBackOutlined';
import { compose } from 'recompose';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

import './sidebarStyle.css'

const Customstyles = theme => ({
    paper: {
        height: 511,
        top: 70,
        width: 250
    }
});


const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openDrawer: false,
            openEth: true,
            openTmd: false,
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
            if (this.props.component !== 'dashboard' && disabledItemsTM.includes(item.value)) { }
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
                return <img src={'../src/Images/tendermint-disable.png'} style={{ width: 20 }} />
            else
                return <img src={'../src/Images/tmint-logo-green.svg'} alt="tendermint_logo" style={{ width: 20 }} />
        }
        if (iconName === 'ethereumIcon') {

            return <img src={'../src/Images/ethereum.svg'} alt="etherem_logo"
                style={{ width: 20 }} />
        }
        else {
            let Icon = this.components[iconName];
            return <Icon />
        }
    }


    handleEthClick = () => {
        this.setState(state => ({
            openEth: !state.openEth,
            openTmd: false,
        }));
    };
    handleTmdClick = () => {
        this.setState(state => ({
            openTmd: !state.openTmd,
            openEth: false
        }));
    };


    render() {
        let { classes, isTest, isTenderMint, component } = this.props;
        let currentTab = this.props.currentTab;
        return (
            <div style={sidebarStyles.totalDiv}>
                <div style={sidebarStyles.IconActiveDivStyle}>
                    <Tooltip title="Toggle Menu">
                        <MenuIcon onClick={this.toggleDrawer(true)} />
                    </Tooltip>
                </div>
                <hr style={sidebarStyles.m_0} />

                {
                    menuItemsIcons.map((item) => {
                        let isDisabled = !isTenderMint ? (!isTest && disabledItemsMain.includes(item.value))
                            || (isTest && disabledItemsTest.includes(item.value)) : disabledItemsTM.includes(item.value);
                        return (
                            <div>
                                <div style={
                                    isDisabled ?
                                        sidebarStyles.IconDisabledDivStyle :
                                        (item.value === currentTab ?
                                            sidebarStyles.IconCurrentDivStyle :
                                            sidebarStyles.IconActiveDivStyle)
                                } onClick={() => { this.setMenu(item); }}
                                    onMouseEnter={this.toggleDrawer(true)}
                                // onMouseOut = {this.toggleDrawer(false)}
                                >
                                    <Tooltip title={item.name} placement="right">
                                        <label
                                            style={
                                                isDisabled
                                                    ?
                                                    sidebarStyles.IconDisabledLabelStyle :
                                                    (item.value === currentTab ?
                                                        sidebarStyles.IconActiveLabelStyle :
                                                        sidebarStyles.IconNormalLabelStyle)
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
                        {/* <span onClick = {this.toggleDrawer(false)}><i class="material-icons">keyboard_backspace</i></span> */}
                        <IconButton aria-label="Back"  style={sidebarStyles.backArrowStyle} onClick={this.toggleDrawer(false)}>
                            <BackArrowIcon />
                        </IconButton>
                        {/* <span style={sidebarStyles.drawerHeading}>SENTINEL</span> */}

                        <div style={sidebarStyles.giveSpace}></div>
                        <ListItem button onClick={this.handleTmdClick} disabled={!isTenderMint}>
                            <ListItemIcon>

                                {this.props.isTenderMint ?
                                    <img src={'../src/Images/tmint-logo-green.svg'} alt="tendermint_logo"
                                        style={{ width: 18, marginTop: -5 }} />
                                    :
                                    <img src={'../src/Images/tendermint-disable.png'} style={{ width: 20 }} />
                                }
                            </ListItemIcon>
                            <ListItemText inset primary="TENDERMINT" style={sidebarStyles.collapseType} />
                            {this.state.openTmd ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>

                        <Collapse in={this.state.openTmd && isTenderMint} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {

                                    TMmenuItems.map((item) => {
                                        let isDisabled = component === 'dashboard' ? false : disabledItemsTM.includes(item.value)
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
                                                        <span className="iconStyle"> {this.getIcon(item.icon)}</span> {item.name}

                                                    </label>
                                                </div>
                                                <hr style={sidebarStyles.m_0} />
                                            </div>
                                        )
                                    })
                                }
                            </List>
                        </Collapse>

                        <ListItem button onClick={this.handleEthClick} disabled={isTenderMint}>
                            <ListItemIcon>

                                <img src={'../src/Images/ethereum.svg'} alt="etherem_logo"
                                    style={{ width: 20, marginTop: -5 }} />


                            </ListItemIcon>
                            <ListItemText inset primary="ETHEREUM" style={sidebarStyles.collapseType} />
                            {this.state.openEth ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>

                        <Collapse in={this.state.openEth && !isTenderMint} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
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
                                                       <span> <span className="iconStyle"> {this.getIcon(item.icon)}</span>
                                                                <span 
                                                                // className="headingStyle"
                                                                > {item.name} </span></span>

                                                    </label>
                                                </div>
                                                <hr style={sidebarStyles.m_0} />
                                            </div>
                                        )
                                    })
                                }
                            </List>
                        </Collapse>



                        {/* {
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
                                               <span className="iconStyle"> {this.getIcon(item.icon)}</span> {item.name}

                                            </label>
                                        </div>
                                        <hr style={sidebarStyles.m_0} />
                                    </div>
                                )
                            })
                        } */}

                        <span style={sidebarStyles.drawerHeading}><img src={'../src/Images/Sentinel.png'} alt="sentinel_logo"
                            style={{ width: 139, paddingRight: 5, marginTop: -2 }} /></span>
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
        isTenderMint: state.setTendermint,
        component: state.setTMComponent,
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setCurrentTab
    }, dispatch)
}

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(Sidebar);
