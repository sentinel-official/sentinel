import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import {
    Switch, Snackbar, Tooltip, IconButton, Paper, ClickAwayListener, Popper,
    MenuList, MenuItem, Grow
} from '@material-ui/core';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import AccountIcon from '@material-ui/icons/AccountCircle';
import { headerStyles } from '../Assets/header.styles';
import { setTestNet, getETHBalance, getSentBalance } from '../Actions/header.action';
import { setCurrentTab } from './../Actions/sidebar.action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
    }

    handleMenuToggle = () => {
        this.setState(state => ({ openAccountMenu: !state.openAccountMenu }));
    };

    testNetChange = () => event => {
        let value = event.target.checked;
        let currentTab = this.props.currentTab;
        this.props.setTestNet(value);
        this.props.getETHBalance(this.props.walletAddress, value);
        this.props.getSentBalance(this.props.walletAddress, value);
        if ((value && currentTab === 'swixer' || currentTab === 'swaps') ||
            (!value && (currentTab === 'vpnList' || currentTab === 'vpnHistory'))) {
            this.props.setCurrentTab('send');
        }
    };

    render() {
        let self = this;
        if (!this.state.isGetBalanceCalled) {
            setInterval(function () {
                self.props.getETHBalance(self.props.walletAddress, self.props.isTest);
                self.props.getSentBalance(self.props.walletAddress, self.props.isTest);
            }, 5000);

            this.setState({ isGetBalanceCalled: true });
        }
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
                                    {this.props.walletAddress}</span>
                                </Col>
                                <Col xs={4}>
                                    <Tooltip title="Copy">
                                        <CopyToClipboard text={this.props.walletAddress}
                                            onCopy={() => this.setState({
                                                snackMessage: 'Copied Successfully',
                                                openSnack: true
                                            })} >
                                            <CopyIcon style={headerStyles.clipBoard} />
                                        </CopyToClipboard>
                                    </Tooltip>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={4}>
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
                        </Col>
                        <Col xs={2} style={headerStyles.alignRight}>
                            <div style={headerStyles.columnStyle}>
                                <p style={headerStyles.toggleLabelisTest}>TESTNET</p>
                            </div>
                            <div style={headerStyles.toggleStyle}>
                                <Switch
                                    checked={this.props.isTest}
                                    onChange={this.testNetChange()}
                                    color="primary"
                                />
                            </div>
                        </Col>
                        <Col xs={1} style={headerStyles.alignRight}>
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
        currentTab: state.setCurrentTab
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setTestNet,
        getETHBalance,
        getSentBalance,
        setCurrentTab
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(Header);