import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    menuItems, TMdisabledmenuItems, notTestItemIcons,notInTestMenuItems,testMenuItems,
    testMenuItemsIcons, disabledItemsMain, disabledItemsTest, disabledItemsTM
} from '../Constants/constants';
import { sidebarStyles } from '../Assets/sidebar.styles';
import { setCurrentTab } from '../Actions/sidebar.action';
import { setTendermint, setWalletType  } from '../Actions/header.action';

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
import lang from '../Constants/language';



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

const electron = window.require('electron');
const remote = electron.remote;

const Customstyles = theme => ({
    paper: {
        height: remote.process.platform === 'win32' ? 516 : 512,
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

        if(item.value === 'eth' && this.props.isTest){

            console.log("triggered ETH ", item)
            console.log("testnet ", this.props.isTest)
            console.log("current eth ",item.value)

            this.props.setTendermint(false);
            this.props.setWalletType('ERC')

          
        }

        if(item.value === 'tmint' && this.props.isTest){
            console.log("triggered TM ", item)
            console.log("testnet ", this.props.isTest)
            console.log("current tm ",item.value)
            this.props.setTendermint(true);
            this.props.setWalletType('TM')
           
        }

        if (!this.props.isTenderMint ) {
            if (!this.props.isTest &&
                disabledItemsMain.includes(item.value)) { }
            else if (this.props.isTest && disabledItemsTest.includes(item.value)) { }
            else {
                console.log("setting current ", item.value)
                if(item.value ==='eth'|| item.value==='tmint'){ console.log("not setting current1 ", item.value)}
                else{
                    console.log("setting current1 ", item.value)
                    this.props.setCurrentTab(item.value);

                }
            }
        }
        else {
            if (this.props.component !== 'dashboard' && disabledItemsTM.includes(item.value)) { }
            else if(!this.props.isTest){}
            else {

                console.log("in last if condition jh", this.props.isTest)
                if(item.value ==='eth'|| item.value==='tmint'){  console.log("not setting current2 ", item.value) }
                else{
                    console.log("setting current2 ", item.value)
                    this.props.setCurrentTab(item.value);

                }
               
            }
        }

    }

    componentWillReceiveProps = (next) => {
        if (next.isTenderMint !== this.props.isTenderMint || next.isTest !== this.props.isTest) {
            this.setState({ openEth: !next.isTenderMint, openTmd: next.isTenderMint })
        }
    }

    toggleDrawer = (value) => () => {
        this.setState({ openDrawer: value })
    }

    getIcon = (iconName) => {
        if (iconName === 'tmintIcon') { 
            if (!this.props.isTenderMint)
                return <img src={'../src/Images/tmint-logo-green.svg'} alt="tendermint_logo"
                    style={{ width: 25, paddingBottom: 7, marginTop:-3 ,opacity:0.3 }} />
            else
                return <img src={'../src/Images/tmint-logo-green.svg'} alt="tendermint_logo" style={{ width: 25, paddingBottom: 7, marginTop:-3 }} />
        }
        if (iconName === 'ethereumIcon') {
            if (this.props.isTenderMint)
                return <img src={'../src/Images/ethereum.svg'} alt="etherem_logo"
                    style={{ width: 20, paddingBottom:5, marginTop:-5,opacity:0.3  }} />

            else
                return <img src={'../src/Images/ethereum.svg'} alt="etherem_logo"
                    style={{ width: 20, paddingBottom:4, marginTop:-5, }} />
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
        let { classes, isTest, isTenderMint, component, language } = this.props;

        let currentTab = this.props.currentTab;
        let sidebarMenuItems = isTest ?  (isTenderMint && component !== 'dashboard' ?
        TMdisabledmenuItems : testMenuItems) : notInTestMenuItems
        let menuItemsIcons = isTest ?
            (isTenderMint && component !== 'dashboard' ?
                TMdisabledmenuItems : testMenuItemsIcons)
            : notTestItemIcons
        return (
            <div style={sidebarStyles.totalDiv}>
                <div style={sidebarStyles.IconActiveDivStyle}>
                    <Tooltip title={lang[language].ToggleMenu} placement="right">
                        <MenuIcon onClick={this.toggleDrawer(true)}
                        onMouseEnter={this.toggleDrawer(true)} />
                    </Tooltip>
                </div>
                <hr style={sidebarStyles.m_0} />
                {/* <div style={sidebarStyles.IconActiveDivStyle}
                >
                    <Tooltip title={lang[language][isTenderMint ? 'TM' : 'ETH']} placement="right">
                        <label
                            style={sidebarStyles.IconNormalLabelStyle}>
                            {this.getIcon('tmintIcon')}

                        </label>
                    </Tooltip>
                </div> */}
                <hr style={sidebarStyles.m_0} />

                {
                    menuItemsIcons.map((item) => {

                        return (
                            <div>
                                <div style={
                                    (item.value === currentTab ?
                                        sidebarStyles.IconCurrentDivStyle :
                                        sidebarStyles.IconActiveDivStyle)
                                } onClick={() => { this.setMenu(item); }}
                                >
                                    <Tooltip title={lang[language][item.name]} placement="right">
                                        <label
                                            style={
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
                        <IconButton aria-label="Back" style={sidebarStyles.backArrowStyle} onClick={this.toggleDrawer(false)}>
                            <BackArrowIcon />
                        </IconButton>
                        <div>
                            {this.props.isTenderMint ?
                                <div className="collapse_header">
                                    <img src={'../src/Images/tmint-logo-green.svg'} alt="tendermint_logo"
                                        style={{ width: 20, }} />
                                    <span className="collapse_heading">{lang[language].TM}</span>
                                </div>
                                :
                                <div className="collapse_header"> <img src={'../src/Images/ethereum.svg'} alt="etherem_logo"
                                    style={{ width: 20 }} />
                                    <span className="collapse_heading">{lang[language].ETH}</span>

                                </div>
                            }
                            <hr style={sidebarStyles.m_0} />

                            <List component="div" disablePadding>
                                {

                                    sidebarMenuItems.map((item) => {
                                        // let isDisabled = component === 'dashboard' ? false : disabledItemsTM.includes(item.value)
                                        return (
                                            <div>
                                                <div style={
                                                    (item.value === currentTab ?
                                                        sidebarStyles.currentDivStyle :
                                                        sidebarStyles.activeDivStyle)
                                                } onClick={() => { this.setMenu(item),this.setState({openDrawer: false}) }}>
                                                    <label
                                                        style={
                                                            // isDisabled
                                                            //     ?
                                                            //     sidebarStyles.disabledLabelStyle :
                                                            (item.value === currentTab ?
                                                                sidebarStyles.activeLabelStyle :
                                                                sidebarStyles.normalLabelStyle)
                                                        }>
                                                        <span className="iconStyle"> {this.getIcon(item.icon)}</span> {lang[language][item.name]}

                                                    </label>
                                                </div>
                                                <hr style={sidebarStyles.m_0} />
                                            </div>
                                        )
                                    })
                                }
                            </List>
                        </div>

                          <span style={sidebarStyles.drawerHeading}><span className='version_style'>{lang[language].VersionInSidebar}</span></span>
                      
                        {/* <span style={sidebarStyles.drawerHeading}><img src={'../src/Images/client_sent.png'} alt="sentinel_logo"
                            style={{ width: 139, paddingRight: 5, position: 'absolute', bottom: 55 }} /></span> */}

                        {/* <ul id="social" class="list-unstyled">
                            <li><a href="https://medium.com/sentinel" id="md" rel="me" target="_blank">Medium</a>
                            </li>
                            <li><a href="https://twitter.com/Sentinel_co" id="tw" rel="me" target="_blank">Twitter</a>
                            </li>
                            <li><a href="https://t.me/sentinel_co" id="tl" rel="me" target="_blank">Telegram</a>
                            </li>
                            <li><a href="https://sentinel.co/" id="snt" rel="me author" target="_blank">Sentinel</a>
                            </li>
                        </ul> */}
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
        language: state.setLanguage,
        isTest: state.setTestNet,
        currentTab: state.setCurrentTab,
        isTenderMint: state.setTendermint,
        component: state.setTMComponent,
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setCurrentTab,
        setTendermint,
        setWalletType,
    }, dispatch)
}

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(Sidebar);
