import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import {
    Switch, Snackbar, Tooltip, IconButton
} from '@material-ui/core';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import { headerStyles } from '../Assets/header.styles';
import { setTestNet, getETHBalance, getSentBalance, setTendermint, setWalletType } from '../Actions/header.action';
import { getTMBalance } from '../Actions/tendermint.action';
import { setCurrentTab } from './../Actions/sidebar.action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { disabledItemsMain, disabledItemsTest } from '../Constants/constants';
import RefreshIcon from '@material-ui/icons/Refresh';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SimpleMenuTestnet from './SharedComponents/SimpleMenuTestnet';
import Select from '@material-ui/core/Select';
import SendIcon from '@material-ui/icons/Send';
import '../Assets/headerStyle.css';

let notTMInterval = null;
let TMInterval = null;

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: '',
            isGetBalanceCalled: false,
            openAccountMenu: false,
            walletType: 'ERC20'
        }
    }

    componentWillMount = () => {
        this.getERCBalances()
    }

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };

    handleMenuClose = (event) => {
        this.setState({ openAccountMenu: false })
    };

    handleMenuToggle = () => {
        this.setState(state => ({ openAccountMenu: !state.openAccountMenu }));
    };

    testNetChange = () => event => {

        let value = event.target.checked;
        let currentTab = this.props.currentTab;
        this.props.setTestNet(value);
        this.props.setWalletType('TM')

        if (value) {
            this.props.setTendermint(true);
            this.props.setCurrentTab('tmint');
            this.setState({
                walletType: 'TENDERMINT'
            })

        }
        if (!value) {
            this.props.setTendermint(false);
            this.props.setCurrentTab('send');
            this.setState({
                walletType: 'ERC20'
            })
            this.props.getETHBalance(this.props.walletAddress);
            this.props.getSentBalance(this.props.walletAddress);
        }
        if ((value && disabledItemsTest.includes(currentTab))) {
            this.props.setCurrentTab('tmint');
        }

        //     if ((!value && disabledItemsMain.includes(currentTab))) {
        //     this.props.setCurrentTab('send');
        // }


        // this.props.getETHBalance(this.props.walletAddress);
        // this.props.getSentBalance(this.props.walletAddress);
        // if ((value && disabledItemsTest.includes(currentTab)) ||
        //     (!value && disabledItemsMain.includes(currentTab))) {
        //     this.props.setCurrentTab('send');
        // }
    };

    tendermintChange = () => event => {

        console.log("dropdown value ", event.target.value);
        let value = event.target.value;
        let currentTab = this.props.currentTab;
        this.props.setWalletType(value)
        if (value !== 'ERC') {
            this.props.setTendermint(true);
            this.props.setCurrentTab('tmint');
            this.setState({
                walletType: 'TENDERMINT'
            })
        }

        // if (value) {
        //     this.props.setCurrentTab('tmint');
        // }
        else {
            this.props.setTendermint(false);
            this.props.getETHBalance(this.props.walletAddress);
            this.props.getSentBalance(this.props.walletAddress);
            this.props.setCurrentTab('send');
            this.setState({
                walletType: 'ERC20'
            })
        }
    };

    getERCBalances = () => {
        this.props.getETHBalance(this.props.walletAddress);
        this.props.getSentBalance(this.props.walletAddress);
    }

    render() {
        let { balance, isTendermint, tmAccountDetails, isTest, walletAddress } = this.props;
        if (!this.props.isTendermint && !notTMInterval) {
            notTMInterval = setInterval(() => {
                this.props.getETHBalance(walletAddress);
                this.props.getSentBalance(walletAddress);
            }, 30000);
        }

        if (this.props.isTendermint && !TMInterval && tmAccountDetails) {
            TMInterval = setInterval(() => {
                this.props.getTMBalance(tmAccountDetails.address);
            }, 30000);
        }

        if (this.props.isTendermint) {
            if (notTMInterval) {
                clearInterval(notTMInterval);
                notTMInterval = null;
            }
        } else {
            if (TMInterval) {
                clearInterval(TMInterval);
                TMInterval = null;
            }
        }
        let balValue = (typeof balance === 'object' && balance !== null) ? ('value' in balance ? balance.value : {}) : {};
        let coins = (typeof balValue === 'object' && balValue !== null) ? ('coins' in balValue ? balValue.coins : []) : [];
        let token = coins && coins.length !== 0 ? coins.find(o => o.denom === 'sut') : {};
        return (
            <div style={headerStyles.mainDivStyle}>
                <Grid>
                    <Row style={headerStyles.firstRowStyle}>
                        <Col xs={1}>
                            <img src={'../src/Images/logo.svg'} alt="sentinel network" style={headerStyles.logoStyle} />
                        </Col>
                        <Col xs={3} style={headerStyles.sentinelColumn}>
                            <div>
                                <span style={headerStyles.basicWallet}> {this.state.walletType} WALLET ADDRESS </span>
                            </div>
                            <Row>
                                <Col xs={8}><span
                                    // xs={8} initially , changed to get 10 digits
                                    style={headerStyles.walletAddress}>
                                    {
                                        isTendermint ?
                                            (tmAccountDetails ? tmAccountDetails.address : 'Loading...') :
                                            this.props.walletAddress

                                    }</span>
                                </Col>
                                <Col xs={4}>
                                    {isTendermint && !tmAccountDetails ? null :
                                        <Tooltip title={this.state.walletType === 'ERC20' ? "Copy ERC20 Sent Wallet Address" : "Copy Tendermint Wallet Address"}>
                                            <CopyToClipboard text={
                                                isTendermint ?
                                                    (tmAccountDetails ? tmAccountDetails.address : 'Loading...') :
                                                    this.props.walletAddress

                                            }
                                                onCopy={() => this.setState({
                                                    snackMessage: 'Copied Successfully',
                                                    openSnack: true
                                                })} >
                                                <CopyIcon style={headerStyles.clipBoard} />
                                            </CopyToClipboard>
                                        </Tooltip>
                                    }
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={2}>
                            {isTendermint ?
                                (tmAccountDetails ?
                                    < div style={headerStyles.tmBalance} >

                                        <Row>
                                            <Col xs={6} style={headerStyles.balanceHead}> {'TSENT'} </Col>
                                            <Col xs={1}> : </Col>
                                            <Col xs={4} style={headerStyles.balanceText}>
                                                {token && 'denom' in token ? (parseInt(token.amount) / (10 ** 8)).toFixed(3) : 'Loading...'}
                                                {token && 'denom' in token ? '' : ''}
                                                {' '}

                                            </Col>
                                        </Row>
                                    </div>
                                    : null)
                                :
                                <Row>
                                    <Col xs={this.props.isTest ? 12 : 12}>
                                        <div style={headerStyles.sentBalance}>
                                            <Row>
                                                <Col xs={6} style={headerStyles.balanceHead}> {this.props.isTest ? 'TEST SENT' : 'SENT'} </Col>
                                                <Col xs={1}> : </Col>
                                                <Col xs={4} style={headerStyles.balanceText}>{this.props.sentBalance}</Col>
                                            </Row>
                                        </div>
                                        <div style={headerStyles.ethBalance}>
                                            <Row>
                                                <Col xs={6} style={headerStyles.balanceHead}> {this.props.isTest ? 'TEST ETH' : 'ETH'} </Col>
                                                <Col xs={1}> : </Col>
                                                <Col xs={4} style={headerStyles.balanceText}>{this.props.ethBalance === 'Loading'
                                                    ? this.props.ethBalance :
                                                    parseFloat(this.props.ethBalance).toFixed(8)
                                                }</Col>
                                            </Row>
                                        </div>
                                    </Col>

                                </Row>
                            }
                        </Col>


                        <Col xs={2} style={headerStyles.alignRight}>
                            <div style={headerStyles.columnStyle}>
                                <p style={headerStyles.toggleLabelisTest}>TESTNET</p>
                            </div>
                            <div style={headerStyles.toggleStyle}>
                                <Switch
                                    disabled={this.props.vpnStatus}
                                    checked={this.props.isTest}
                                    onChange={this.testNetChange()}
                                    color="primary"
                                // disabled={this.props.isTendermint}
                                />
                            </div>
                        </Col>


                        {/* <Col xs={1} style={headerStyles.alignRight}>
                            <IconButton
                                style={{ outline: 'none' }}
                                aria-label="Account"
                                aria-owns={this.state.openAccountMenu ? 'menu-list-grow' : null}
                                aria-haspopup="true"
                                onClick={this.handleMenuToggle}
                            >
                                <AccountIcon style={headerStyles.accountIconColor} />
                            </IconButton>
                            <Popper open={this.state.openAccountMenu} transition disablePortal>
                                {({ TransitionProps, placement }) => (
                                    <Growcol-xs-1
                                        {...TransitionProps}
                                        id="menu-list-grow"
                                        style={{ transformOrigin: 'center bottom' }}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={this.handleMenuClose}>
                                                <MenuList>
                                                    <MenuItem onClick={this.handleMenuClose}>Create Account</MenuItem>
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </Col> */}


                        <Col xs={3} style={headerStyles.alignRight}>
                            {/* <div style={headerStyles.columnStyle}>
                                <p style={headerStyles.toggleLabelisTest}>TENDERMINT</p>
                            </div> */}
                            <div
                            // style={headerStyles.toggleStyle}
                            >
                                {/* <Switch
                                    checked={this.props.isTendermint}
                                    onChange={this.tendermintChange()}
                                    color="primary"
                                    disabled={this.props.vpnStatus}
                                /> */}


                                <Select
                                    displayEmpty
                                    disabled={!this.props.isTest || this.props.vpnStatus ? true : false}
                                    value={this.props.walletValue}
                                    onChange={this.tendermintChange()}

                                    className={this.props.isTest ? 'dropDownStyle' : 'disabledDropDownStyle'}
                                >

                                    <MenuItem value='TM'>
                                        <img src={'../src/Images/tmint-logo-green.svg'} alt="tendermint_logo"
                                            style={{ width: 17, paddingRight: 5, marginTop: -5 }} />
                                        TENDERMINT TESTNET</MenuItem>
                                    <MenuItem value='ERC'>
                                        {/* <SendIcon /> */}
                                        <img src={'../src/Images/ethereum.svg'} alt="etherem_logo"
                                            style={{ width: 17, paddingRight: 5, marginTop: -5 }} />
                                        ETHEREUM TESTNET</MenuItem>

                                </Select>


                            </div>

                        </Col>
                        <Col xs={1}>

                            {isTendermint ?

                                <Tooltip title="Refresh TENDERMINT Balance ">
                                    <IconButton onClick={() => { this.props.getTMBalance(tmAccountDetails.address) }} style={headerStyles.buttonRefresh}>
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>
                                :
                                <Tooltip title="Refresh ERC20 Balance">
                                    <IconButton onClick={() => { this.getERCBalances() }} style={headerStyles.buttonRefresh}>
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                        </Col>

                        {/* <div><SimpleMenuTestnet token={this.setToken} isSend={true} isVPN={this.state.isVPNPayment} />
                        </div> */}
                    </Row>
                </Grid>
                <Snackbar
                    open={this.state.openSnack}
                    autoHideDuration={4000}
                    onClose={this.handleClose}
                    message={this.state.snackMessage}
                />
            </div >
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        isTest: state.setTestNet,
        walletValue: state.getWalletType,
        walletAddress: state.getAccount,
        ethBalance: state.getETHBalance,
        sentBalance: state.getSentBalance,
        currentTab: state.setCurrentTab,
        isTendermint: state.setTendermint,
        vpnStatus: state.setVpnStatus,
        balance: state.tmBalance,
        tmAccountDetails: state.setTMAccount,
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setTestNet,
        getETHBalance,
        getSentBalance,
        setCurrentTab,
        setTendermint,
        setWalletType,
        getTMBalance
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(Header);