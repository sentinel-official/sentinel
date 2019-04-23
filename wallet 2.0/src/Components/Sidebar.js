import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    menuItems, TMdisabledmenuItems, TMrecoverItems, notTestItemIcons, notInTestMenuItems, testMenuItems,
    TMtestMenuItemsIcons, testMenuItemsIcons, disabledItemsMain, disabledItemsTest, disabledItemsTM
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
import { Tooltip } from '@material-ui/core';
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
            activeMenu: ''
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

    getIcon = (iconName, item) => {
        if (iconName === 'createIcon') {
            return <img src={'../src/Images/create.svg'} alt="create_logo"
                style={{ width: 25, paddingBottom: 7, marginTop: -3, opacity: 0.7 }} />
        }

        if (iconName === 'recoverIcon') {
            return <img src={'../src/Images/recover.svg'} alt="recover_logo"
                style={{ width: 25, paddingBottom: 7, marginTop: -3, opacity: 0.7 }} />
        }
        if (iconName === 'nodeIcon') {

            return (
                item.value === this.props.currentTab ?

                    <div className="new_image">
                        <img src={'../src/Images/sidebar_icons_new/NMT_c.png'}  alt="NMT_logo"
                            style={{ width: 20, paddingBottom: 7, marginTop: -3, }} />
                    </div>
                    :

                    <div className="new_image">
                        <img src={'../src/Images/sidebar_icons_new/NMT.png'}  alt="NMT_logo"
                            style={{ width: 20, paddingBottom: 7, marginTop: -3, }} />
                    </div>
            )

            // return <img src={'../src/Images/NMT.svg'} alt="node_logo"
            //         style={{ width: 20, paddingBottom: 7, marginTop: -3, opacity: 0.7}} />
        }
        if (iconName === 'tmintIcon') {
            if (!this.props.isTenderMint)
                return <img src={'../src/Images/tmint-logo-green.svg'} alt="tendermint_logo"
                    style={{ width: 25, paddingBottom: 7, marginTop: -3, opacity: 0.3 }} />
            else
                return <img src={'../src/Images/tmint-logo-green.svg'} alt="tendermint_logo" style={{ width: 25, paddingBottom: 7, marginTop: -3, opacity: 0.7 }} />
        }
        if (iconName === 'ethereumIcon') {
            if (this.props.isTenderMint)
                return <img src={'../src/Images/ethereum.svg'} alt="etherem_logo"
                    style={{ width: 20, paddingBottom: 5, marginTop: -5, opacity: 0.3 }} />

            else
                return <img src={'../src/Images/ethereum.svg'} alt="etherem_logo"
                    style={{ width: 20, paddingBottom: 5, marginTop: -5, opacity: 0.7 }} />
        }
        if (iconName === 'listIcon') {

            if (this.props.isTest)
                return (
                    item.value === this.props.currentTab ?
                        <div className="new_image">
                            <img src={'../src/Images/sidebar_icons_new/VPN_list_c.png'}  alt="list_logo"
                                style={{ width: 25, paddingBottom: 5, marginTop: -5, }} />
                        </div>
                        :

                        <div className="new_image">
                            <img src={'../src/Images/sidebar_icons_new/VPN_list.png'}  alt="list_logo"
                                style={{ width: 25, paddingBottom: 5, marginTop: -5, }} />
                        </div>
                )

            else {
                return (
                    <div className="">
                        <img src={'../src/Images/sidebar_icons_new/VPN_list.png'}  alt="list_logo"
                            style={{ width: 25, paddingBottom: 5, marginTop: -5, opacity: 0.3}} />
                    </div>
                )
            }
            // if (this.props.isTest)
            //     return <img src={'../src/Images/VPN_list.svg'} alt="vpn_list_logo"
            //         style={{ width: 25, paddingBottom: 5, marginTop: -5,opacity: 0.7 }} />

            // else
            //     return <img src={'../src/Images/VPN_list.svg'} alt="vpn_list_logo"
            //         style={{ width: 25, paddingBottom: 5, marginTop: -5, opacity: 0.3 }} />
        }
        if (iconName === 'vpnHisIcon') {

            if (this.props.isTest)
                return (

                    item.value === this.props.currentTab ?
                        <div className="new_image">
                            <img src={'../src/Images/sidebar_icons_new/VPN_history_c.png'}  alt="vpvHistory_logo"
                                style={{ width: 25, paddingBottom: 5, marginTop: -5, }} />
                        </div>
                        :
                        <div className="new_image">
                            <img src={'../src/Images/sidebar_icons_new/VPN_history.png'}  alt="vpvHistory_logo"
                                style={{ width: 25, paddingBottom: 5, marginTop: -5, }} />
                        </div>
                )

            else {
                return (
                    <div className="">
                        <img src={'../src/Images/sidebar_icons_new/VPN_history.png'}  alt="vpvHistory_logo"
                            style={{ width: 25, paddingBottom: 5, marginTop: -5,opacity: 0.3 }} />
                    </div>
                )
            }


            // if (this.props.isTest)
            //     return <img src={'../src/Images/VPN_history.svg'} alt="vpn_history_logo"
            //         style={{ width: 25, paddingBottom: 5, marginTop: -5,opacity: 0.7 }} />

            // else
            //     return <img src={'../src/Images/VPN_history.svg'} alt="vpn_history_logo"
            //         style={{ width: 25, paddingBottom: 5, marginTop: -5, opacity: 0.3 }} />
        }
        if (iconName === 'sendIcon') {
            return (

                item.value === this.props.currentTab ?
                    <div className="new_image">
                        <img src={'../src/Images/sidebar_icons_new/Send_c.png'}  alt="send_logo"
                            style={{ width: 30, marginLeft: 5, }} />
                    </div>

                    :

                    <div className="new_image">
                        <img src={'../src/Images/sidebar_icons_new/Send.png'}  alt="send_logo"
                            style={{ width: 30, marginLeft: 5, }} />
                    </div>
            )

            // return <img src={'../src/Images/Send.svg'} alt="send_logo"
            //     style={{ width: 30, marginLeft:5, opacity: 0.7}} />

        }
        if (iconName === 'receiveIcon') {


            return (
                item.value === this.props.currentTab ?
                    <div className="new_image">
                        <img src={'../src/Images/sidebar_icons_new/Receive_c.png'}  alt="receive_logo"
                            style={{ width: 30, marginLeft: 5, }} />
                    </div>
                    :
                    <div className="new_image">
                        <img src={'../src/Images/sidebar_icons_new/Receive.png'}  alt="receive_logo"
                            style={{ width: 30, marginLeft: 5, }} />
                    </div>
            )


            // return <img src={'../src/Images/Receive.svg'} alt="receive_logo"
            //     style={{ width: 30,marginLeft:5, opacity: 0.7 }} />

        }
        if (iconName === 'historyIcon') {

            return (
                item.value === this.props.currentTab ?
                    <div className="new_image">
                        <img src={'../src/Images/sidebar_icons_new/Tr_list_c.png'}  alt="tx_list_logo"
                            style={{ width: 25, paddingBottom: 5, marginTop: -5, }} />
                    </div>
                    :

                    <div className="new_image">
                        <img src={'../src/Images/sidebar_icons_new/Tr_list.png'}  alt="tx_list_logo"
                            style={{ width: 25, paddingBottom: 5, marginTop: -5, }} />
                    </div>
            )
            // return <img src={'../src/Images/Tr_list.svg'} alt="tx_history_logo"
            //     style={{ width: 25, paddingBottom: 5, marginTop: -5, opacity: 0.7  }} />

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
                (account ? TMdisabledmenuItems : TMrecoverItems) : (isTenderMint ? TMtestMenuItemsIcons : testMenuItemsIcons))
            : notTestItemIcons

        return (
            <div style={sidebarStyles.totalDiv}>


                {
                    menuItemsIcons.map((item) => {
                        let isDisabled = !isTest && disabledItemsMain.includes(item.value);
                        return (
                            <div>
                                <div 
                                  className={
                                    isDisabled ?
                                        'IconDisabledDivStyle' :
                                        (item.value === currentTab ?
                                            'IconCurrentDivStyle' :
                                            'IconActiveDivStyle')
                                }
                                
                                // style={
                                //     isDisabled ?
                                //         sidebarStyles.IconDisabledDivStyle :
                                //         (item.value === currentTab ?
                                //             sidebarStyles.IconCurrentDivStyle :
                                //             sidebarStyles.IconActiveDivStyle)
                                // } 
                                onClick={() => { this.setMenu(item); }}
                                >
                                    <Tooltip title={lang[language][item.name]} placement="right">
                                        <label
                                            className={
                                                isDisabled ?
                                                    'disabledLabelStyle' :
                                                    (item.value === currentTab ?
                                                        'IconActiveLabelStyle' :
                                                        'IconNormalLabelStyle')
                                            }
                                        >
                                            {this.getIcon(item.icon, item)}

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
