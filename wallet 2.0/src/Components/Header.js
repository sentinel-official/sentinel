import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import {
    Switch, Snackbar, Tooltip,
} from '@material-ui/core';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import { headerStyles } from '../Assets/header.styles';
import { setTestNet, getETHBalance, getSentBalance, setTendermint } from '../Actions/header.action';
import { getTMBalance } from '../Actions/tendermint.action';
import { setCurrentTab } from './../Actions/sidebar.action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { disabledItemsMain, disabledItemsTest } from '../Constants/constants';
import RefreshIcon from '@material-ui/icons/Refresh';

let notTMInterval = null;
let TMInterval = null;

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: '',
            isGetBalanceCalled: false,
            openAccountMenu: false
        }
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
        this.props.getETHBalance(this.props.walletAddress, value);
        this.props.getSentBalance(this.props.walletAddress, value);
        if ((value && disabledItemsTest.includes(currentTab)) ||
            (!value && disabledItemsMain.includes(currentTab))) {
            this.props.setCurrentTab('send');
        }
    };

    tendermintChange = () => event => {
        let value = event.target.checked;
        this.props.setTendermint(value);
        if (value) {
            this.props.setCurrentTab('tmint');
        }
        else {
            this.props.setCurrentTab('send');
        }
    };

    render() {
        let { balance, isTendermint, tmAccountDetails, isTest, walletAddress } = this.props;
        if (!this.props.isTendermint && !notTMInterval) {
            notTMInterval = setInterval(() => {
                this.props.getETHBalance(walletAddress, isTest);
                this.props.getSentBalance(walletAddress, isTest);
            }, 15000);
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
                            <img src={'../src/Images/logo.svg'} alt="logo" style={headerStyles.logoStyle} />
                        </Col>
                        <Col xs={4} style={headerStyles.sentinelColumn}>
                            <div>
                                <span style={headerStyles.basicWallet}>SENTINEL</span>
                            </div>
                            <Row>
                                <Col xs={8}><span
                                    style={headerStyles.walletAddress}>
                                    {
                                        isTendermint ?
                                            (tmAccountDetails ? tmAccountDetails.address : 'Loading...') :
                                            this.props.walletAddress

                                    }</span>
                                </Col>
                                <Col xs={4}>
                                    {isTendermint && !tmAccountDetails ? null :
                                        <Tooltip title="Copy">
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
                        <Col xs={4}>
                            {isTendermint ?
                                (tmAccountDetails ?
                                    < div style={headerStyles.ethBalance} >
                                        <span>{'SUT: '}</span>
                                        <span style={headerStyles.balanceText}>
                                            {token && 'denom' in token ? (parseInt(token.amount) / (10 ** 8)).toFixed(3) : 'Loading...'}
                                            {token && 'denom' in token ? '' : ''}
                                            {' '}
                                            <IconButton onClick={() => { this.getHistory() }} style={headerStyles.buttonRefresh}>
                                                <RefreshIcon />
                                            </IconButton>
                                        </span>
                                    </div>
                                    : null)
                                :
                                <div>
                                    <div style={headerStyles.sentBalance}>
                                        <span>{this.props.isTest ? 'TEST SENT: ' : 'SENT: '}</span>
                                        <span style={headerStyles.balanceText}>{this.props.sentBalance}</span>
                                    </div>
                                    <div style={headerStyles.ethBalance}>
                                        <span>{this.props.isTest ? 'TEST ETH: ' : 'ETH: '}</span>
                                        <span style={headerStyles.balanceText}>{this.props.ethBalance === 'Loading'
                                            ? this.props.ethBalance :
                                            parseFloat(this.props.ethBalance).toFixed(8)
                                        }</span>
                                    </div>
                                </div>
                            }
                        </Col>
                        <Col xs={1} style={headerStyles.alignRight}>
                            <div style={headerStyles.columnStyle}>
                                <p style={headerStyles.toggleLabelisTest}>TESTNET</p>
                            </div>
                            <div style={headerStyles.toggleStyle}>
                                <Switch
                                    checked={this.props.isTest}
                                    onChange={this.testNetChange()}
                                    color="primary"
                                    disabled={this.props.isTendermint}
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
                                    <Grow
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
                        <Col xs={1} style={headerStyles.alignRight}>
                            <div style={headerStyles.columnStyle}>
                                <p style={headerStyles.toggleLabelisTest}>TENDERMINT</p>
                            </div>
                            <div style={headerStyles.toggleStyle}>
                                <Switch
                                    checked={this.props.isTendermint}
                                    onChange={this.tendermintChange()}
                                    color="primary"
                                    disabled={this.props.vpnStatus}
                                />
                            </div>
                        </Col>
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
        getTMBalance
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(Header);