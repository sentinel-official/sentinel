import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    menuItems, TMdisabledmenuItems, TMrecoverItems, notTestItemIcons, notInTestMenuItems, testMenuItems,
    TMtestMenuItemsIcons,testMenuItemsIcons, disabledItemsMain, disabledItemsTest, disabledItemsTM
} from '../Constants/constants';
import { sidebarStyles } from '../Assets/sidebar.styles';
import { setCurrentTab } from '../Actions/sidebar.action';
import { setTendermint, setWalletType } from '../Actions/header.action';
import MenuIcon from '@material-ui/icons/Menu';
import HistoryIcon from '@material-ui/icons/History';
import SendIcon from '@material-ui/icons/Send';
import SwapIcon from '@material-ui/icons/SwapHoriz';
import SwixerIcon from '@material-ui/icons/SwapHorizontalCircle';
import ListIcon from '@material-ui/icons/List';
import ReceiveIcon from '@material-ui/icons/CallReceived';
import VpnHisIcon from '@material-ui/icons/VpnLock';
import BackIcon from '@material-ui/icons/KeyboardBackspace';
import {  Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import lang from '../Constants/language';

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

        if (item.value === 'eth' && this.props.isTest) {

            console.log("triggered ETH ", item)
            console.log("testnet ", this.props.isTest)
            console.log("current eth ", item.value)

            this.props.setTendermint(false);
            this.props.setWalletType('ERC')


        }

        if (item.value === 'tmint' && this.props.isTest) {
            console.log("triggered TM ", item)
            console.log("testnet ", this.props.isTest)
            console.log("current tm ", item.value)
            this.props.setTendermint(true);
            this.props.setWalletType('TM')

        }

        if (!this.props.isTenderMint) {
            if (!this.props.isTest &&
                disabledItemsMain.includes(item.value)) { }
            else if (this.props.isTest && disabledItemsTest.includes(item.value)) { }
            else {
                if (item.value === 'eth' || item.value === 'tmint') { }
                else {
                    this.props.setCurrentTab(item.value);

                }
            }
        }
        else {
            if (this.props.component !== 'dashboard' && disabledItemsTM.includes(item.value)) { }
            else if (!this.props.isTest) { }
            else {
                if (item.value === 'eth' || item.value === 'tmint') { }
                else {
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

        if( iconName === 'createIcon'){
            return <img src={'../src/Images/create.svg'} alt="create_logo"
                    style={{ width: 25, paddingBottom: 7, marginTop: -3}} />
        }

        if( iconName === 'recoverIcon'){
            return <img src={'../src/Images/recover.svg'} alt="recover_logo"
                    style={{ width: 25, paddingBottom: 7, marginTop: -3}} />
        }
        if( iconName === 'nodeIcon'){
            return <img src={'../src/Images/node.svg'} alt="node_logo"
                    style={{ width: 25, paddingBottom: 7, marginTop: -3}} />
        }
        if (iconName === 'tmintIcon') {
            if (!this.props.isTenderMint)
                return <img src={'../src/Images/tmint-logo-green.svg'} alt="tendermint_logo"
                    style={{ width: 25, paddingBottom: 7, marginTop: -3, opacity: 0.3 }} />
            else
                return <img src={'../src/Images/tmint-logo-green.svg'} alt="tendermint_logo" style={{ width: 25, paddingBottom: 7, marginTop: -3 }} />
        }
        if (iconName === 'ethereumIcon') {
            if (this.props.isTenderMint)
                return <img src={'../src/Images/ethereum.svg'} alt="etherem_logo"
                    style={{ width: 20, paddingBottom: 5, marginTop: -5, opacity: 0.3 }} />

            else
                return <img src={'../src/Images/ethereum.svg'} alt="etherem_logo"
                    style={{ width: 20, paddingBottom: 4, marginTop: -5, }} />
        }

        if (iconName === 'listIcon') {
            if (this.props.isTest) {
                return <img src={'../src/Images/list.svg'} alt="etherem_logo"
                    style={{ width: 25, paddingBottom: 6, marginTop: 2 }} />
            }
            else {
                return <img src={'../src/Images/list.svg'} alt="etherem_logo"
                    style={{ width: 25, paddingBottom: 6, marginTop: 2, opacity: 0.3 }} />
            }

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
        let { classes, isTest, isTenderMint, component, language, account } = this.props;

        let currentTab = this.props.currentTab;
        let sidebarMenuItems = isTest ? (isTenderMint && component !== 'dashboard' ?
            (account ? TMdisabledmenuItems : TMrecoverItems) : testMenuItems) : notInTestMenuItems
        let menuItemsIcons = isTest ?
            (isTenderMint && component !== 'dashboard' ?
                (account ? TMdisabledmenuItems : TMrecoverItems) : (isTenderMint ? TMtestMenuItemsIcons :testMenuItemsIcons ) )
            : notTestItemIcons

        // let menuItemsIcons = isTest ? 
        //     (isTenderMint && component !== 'dashboard') ?
        //         (account ? TMdisabledmenuItems : TMrecoverItems)
        //         :
        //         (isTendermint ? TMtestMenuItemsIcons :testMenuItemsIcons )
        //         :
        //         notTestItemIcons
                

        return (
            <div style={sidebarStyles.totalDiv}>

                {/* <div style={sidebarStyles.IconActiveDivStyle}>
                    <Tooltip title={lang[language].ToggleMenu} placement="right">
                        <MenuIcon onClick={this.toggleDrawer(true)}
                        onMouseEnter={this.toggleDrawer(true)} />
                    </Tooltip>
                </div> */}

                {/* <hr style={sidebarStyles.m_0} />
                <hr style={sidebarStyles.m_0} /> */}

                {
                    menuItemsIcons.map((item) => {
                        let isDisabled = !isTest && disabledItemsMain.includes(item.value);
                        return (
                            <div>
                                <div style={
                                    isDisabled ?
                                        sidebarStyles.IconDisabledDivStyle :
                                        (item.value === currentTab ?
                                            sidebarStyles.IconCurrentDivStyle :
                                            sidebarStyles.IconActiveDivStyle)
                                } onClick={() => { this.setMenu(item); }}
                                >
                                    <Tooltip title={lang[language][item.name]} placement="right">
                                        <label
                                            style={
                                                isDisabled ?
                                                    sidebarStyles.disabledLabelStyle :
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
        account: state.createTMAccount
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
