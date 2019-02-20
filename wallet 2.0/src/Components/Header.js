import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import {
    Switch, Snackbar, Tooltip, IconButton, Menu, MenuItem, MenuList,
    Select, Paper, Grow, ClickAwayListener, Popper, Divider, ListItemText, ListItemIcon
} from '@material-ui/core';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import { headerStyles } from '../Assets/header.styles';
import { setTestNet, getETHBalance, getSentBalance, setTendermint, setWalletType } from '../Actions/header.action';
import { setComponent } from '../Actions/authentication.action';
import { getTMBalance, getKeys, setTMAccount } from '../Actions/tendermint.action';
import { setCurrentTab } from './../Actions/sidebar.action';
import { logoutNode } from './../Actions/node.action';
import { setTMConfig } from '../Utils/UserConfig';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { disabledItemsMain, disabledItemsTest } from '../Constants/constants';
import RefreshIcon from '@material-ui/icons/Refresh';
import LogoutIcon from '@material-ui/icons/PowerSettingsNew';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import ImportIcon from '@material-ui/icons/PlayForWork';
import AccountIcon from '@material-ui/icons/AccountBox';
import DoneIcon from '@material-ui/icons/Done';
import SimpleMenuTestnet from './SharedComponents/SimpleMenuTestnet';
import SendIcon from '@material-ui/icons/Send';
import lang from '../Constants/language';
import { networkChange } from '../Actions/NetworkChange';
import { setVpnType } from '../Actions/vpnlist.action';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import CreateImportDialog from './CreateImportDialog';
import PropTypes from 'prop-types';
import '../Assets/headerStyle.css';

let notTMInterval = null;
let TMInterval = null;

const Customstyles = theme => ({
    primaryText: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        width: 100
    },
    paper: {
        width: '50%',
    },
});

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: '',
            isGetBalanceCalled: false,
            openAccountMenu: false,
            walletType: 'ERC20',
            isLoading: false,
            openedMenu: false,
            openCreateDialog: false,
            isCreate: true
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

    handleMenuClick = event => {
        if (this.state.openedMenu) {
            this.setState({ openedMenu: false });
        } else {
            this.setState({ openedMenu: true });
        }
    };

    handleLogoutMenuClose = (event) => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }
        this.setState({ openedMenu: false });
    };

    onLogoutClicked = () => {
        this.props.logoutNode();
        this.props.setComponent('home');
    }

    testNetChange = () => event => {

        let value = event.target.checked;
        let currentTab = this.props.currentTab;
        this.props.setTestNet(value);
        this.props.setWalletType('ERC')

        if (value) {
            // this.props.setTendermint(true);
            this.props.setVpnType('openvpn');
            this.props.networkChange('public');
            this.setState({
                walletType: 'ERC20'
            })
            // if (this.props.tmAccountDetails) {
            //     this.props.getTMBalance(this.props.tmAccountDetails.address);
            //     this.props.setCurrentTab('vpnList');
            // }
            // else {
            //     this.props.setCurrentTab('receive');
            // }
        }
        if (!value) {
            this.props.setTendermint(false);
            if (disabledItemsMain.includes(currentTab))
                this.props.setCurrentTab('send');
            else
                this.props.setCurrentTab(currentTab);
            this.setState({
                walletType: 'ERC20'
            })
        }
        this.props.getETHBalance(this.props.walletAddress);
        this.props.getSentBalance(this.props.walletAddress);
        if ((value && disabledItemsTest.includes(currentTab))) {
            this.props.setCurrentTab('receive');
        }
    };

    tendermintChange = () => event => {

        let value = event.target.value;
        let currentTab = this.props.currentTab;
        this.props.setWalletType(value)
        if (value !== 'ERC') {
            this.props.setTendermint(true);
            this.props.setVpnType('openvpn');
            this.props.networkChange('public');
            this.setState({
                walletType: 'TENDERMINT'
            })
            if (this.props.tmAccountDetails) {
                this.props.getTMBalance(this.props.tmAccountDetails.address);
                this.props.setCurrentTab(currentTab);
            }
            else {
                this.props.setCurrentTab('receive');
            }
        }


        else {
            this.props.setTendermint(false);
            this.props.getETHBalance(this.props.walletAddress);
            this.props.getSentBalance(this.props.walletAddress);
            this.props.setCurrentTab(currentTab === 'recover' ? 'receive' : currentTab);
            this.setState({
                walletType: 'ERC20'
            })
        }
    };

    getERCBalances = () => {
        this.setState({ isLoading: true });
        this.props.getETHBalance(this.props.walletAddress);
        this.props.getSentBalance(this.props.walletAddress)
            .then((res) => {
                this.setState({ isLoading: false });
            })
    }

    getTMBalance = () => {
        this.setState({ isLoading: true });
        this.props.getTMBalance(this.props.tmAccountDetails.address)
            .then((res) => {
                this.setState({ isLoading: false });
            });
    }

    onClickedAccount = (name) => {
        if (this.props.tmAccountDetails.name === name) {
            this.setState({ openedMenu: false });
        } else {
            let mainAccount = this.props.keys.find(obj => obj.name === name);
            setTMConfig(name, false);
            if (TMInterval) {
                clearInterval(TMInterval);
                TMInterval = null;
            }
            this.props.logoutNode();
            this.props.setTMAccount(mainAccount);
            this.setState({ openedMenu: false });
        }
    }

    handleDialogClose = () => {
        this.setState({ openCreateDialog: false });
    }

    addTMAccount = () => {
        this.setState({ openedMenu: false, isCreate: true, openCreateDialog: true });
    }

    importTMAccount = () => {
        this.setState({ openedMenu: false, isCreate: false, openCreateDialog: true });
    }

    accountTmCreated = (value) => {
        if (value) {
            clearInterval(TMInterval);
            TMInterval = null;
            this.props.logoutNode();
        }
    }

    render() {
        let { balance, isTendermint, tmAccountDetails, tmAccountsList, language, isTest, walletAddress } = this.props;
        const { classes } = this.props;

        if (!isTendermint && !notTMInterval) {
            this.getERCBalances();
            notTMInterval = setInterval(() => {
                this.props.getETHBalance(walletAddress);
                this.props.getSentBalance(walletAddress);
            }, 30000);
        }

        if (isTendermint && !TMInterval && tmAccountDetails) {
            this.getTMBalance();
            TMInterval = setInterval(() => {
                this.props.getTMBalance(tmAccountDetails.address);
            }, 30000);
        }

        if (isTendermint) {
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
                                <span style={headerStyles.basicWallet}>
                                    {isTendermint ? lang[language].WalletTM : lang[language].WalletERC} {lang[language].WalletAddress} </span>
                            </div>
                            <Row>
                                <Col xs={8}><span
                                    style={headerStyles.walletAddress}>
                                    {
                                        isTendermint ?
                                            (tmAccountDetails ? tmAccountDetails.address : lang[language].Loading) :
                                            this.props.walletAddress

                                    }</span>
                                </Col>
                                <Col xs={4}>
                                    {isTendermint && !tmAccountDetails ? null :
                                        <Tooltip title={isTendermint ? lang[language].TMWalletCopy : lang[language].ERC20WalletCopy}>

                                            <CopyToClipboard text={
                                                isTendermint ?
                                                    (tmAccountDetails ? tmAccountDetails.address : lang[language].Loading) :
                                                    this.props.walletAddress

                                            }
                                                onCopy={() => this.setState({
                                                    snackMessage: lang[language].Copied,
                                                    openSnack: true
                                                })} >
                                                <CopyIcon style={headerStyles.clipBoard} />
                                            </CopyToClipboard>
                                        </Tooltip>
                                    }
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={3}>
                            {isTendermint ?
                                (tmAccountDetails ?
                                    < div style={headerStyles.tmBalance}  >

                                        <Row>
                                            <Col xs={6} style={headerStyles.balanceHead}> {lang[language].TSent} </Col>
                                            <Col xs={1}> : </Col>
                                            <Col xs={4} style={headerStyles.balanceText}>
                                                <p style={headerStyles.tmBalanceText}>
                                                    {token && 'denom' in token ?

                                                        (this.state.isLoading ?
                                                            <img src={'../src/Images/load.svg'} alt="loading..." style={{ width: 25 }} />
                                                            :
                                                            (parseInt(token.amount) / (10 ** 8)).toFixed(8))
                                                        :
                                                        <img src={'../src/Images/load.svg'} alt="loading..." style={{ width: 25 }} />}
                                                </p>
                                            </Col>
                                        </Row>
                                    </div>
                                    : null)
                                :
                                <Row>
                                    <Col xs={12} style={{ marginLeft: -55 }}>
                                        <div style={headerStyles.sentBalance}>
                                            <Row>
                                                <Col xs={6} style={headerStyles.balanceHead}> {this.props.isTest ? lang[language].TestSENTunit : lang[language].Sent} </Col>
                                                <Col xs={1}> : </Col>
                                                <Col xs={4} style={headerStyles.balanceText}>
                                                    <p style={headerStyles.tmBalanceText}>
                                                        {this.props.sentBalance === 'Loading...'
                                                            ?
                                                            <img src={'../src/Images/load.svg'} alt="loading..." style={{ width: 25 }} />
                                                            :
                                                            (this.state.isLoading ?
                                                                <img src={'../src/Images/load.svg'} alt="loading..." style={{ width: 25 }} />
                                                                :
                                                                parseFloat(this.props.sentBalance).toFixed(8)
                                                            )
                                                        }</p>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div style={headerStyles.ethBalance}>
                                            <Row>
                                                <Col xs={6} style={headerStyles.balanceHead}> {this.props.isTest ? lang[language].TestETHunit : lang[language].Eth} </Col>
                                                <Col xs={1}> : </Col>
                                                <Col xs={4} style={headerStyles.balanceText}>
                                                    <p style={headerStyles.tmBalanceText}>
                                                        {this.props.ethBalance === 'Loading...'
                                                            ?
                                                            <img src={'../src/Images/load.svg'} alt="loading..." style={{ width: 25 }} />
                                                            :
                                                            (this.state.isLoading ?
                                                                <img src={'../src/Images/load.svg'} alt="loading..." style={{ width: 25 }} />
                                                                :
                                                                parseFloat(this.props.ethBalance).toFixed(8)
                                                            )
                                                        }
                                                    </p>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>

                                </Row>
                            }
                        </Col>


                        <Col xs={2} style={headerStyles.alignRight}>
                            <div style={headerStyles.columnStyle}>
                                <p style={headerStyles.toggleLabelisTest}>{lang[language].TestNet}</p>
                            </div>

                            <Tooltip title={this.props.vpnStatus ? lang[language].CannotSwitch : ''}>
                                <div style={headerStyles.toggleStyle}>
                                    <Switch
                                        disabled={this.props.vpnStatus || isTendermint}
                                        checked={this.props.isTest}
                                        onChange={this.testNetChange()}
                                        color="primary"
                                    />
                                </div>
                            </Tooltip>
                        </Col>
                        <Col xsOffset={1} xs={1}>
                            {isTendermint ?
                                <Tooltip title={lang[language].RefreshBalTM} placement="bottom-end">
                                    <IconButton onClick={() => { this.getTMBalance() }} style={headerStyles.buttonRefresh}>
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>
                                :
                                <Tooltip title={lang[language].RefreshBalETH} placement="bottom-end">
                                    <IconButton onClick={() => { this.getERCBalances() }} style={headerStyles.buttonRefresh}>
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>
                            }
                        </Col>
                        <Col xs={1}>
                            <IconButton
                                buttonRef={node => {
                                    this.anchorEl = node;
                                }}
                                aria-owns={this.state.openedMenu ? 'long-menu' : undefined}
                                aria-haspopup="true"
                                disabled={this.props.vpnStatus}
                                onClick={this.handleMenuClick}
                                style={headerStyles.buttonRefresh}>
                                <MoreVertIcon />
                            </IconButton>
                            <Popper open={this.state.openedMenu} anchorEl={this.anchorEl}
                                placement={'bottom-end'}
                                style={headerStyles.popperDiv}
                                transition disablePortal>
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        id="long-menu"
                                        style={{ transformOrigin: placement === 'bottom' ? 'left top' : 'left bottom' }}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={this.handleLogoutMenuClose}>
                                                {isTendermint && tmAccountDetails ?
                                                    <div>
                                                        <MenuList style={headerStyles.menuListStyle}>
                                                            {
                                                                tmAccountsList.map((item, index) => {
                                                                    return (<MenuItem onClick={() => { this.onClickedAccount(item); }}
                                                                        disabled={this.props.vpnStatus}>
                                                                        <ListItemIcon>
                                                                            <AccountIcon />
                                                                        </ListItemIcon>
                                                                        <ListItemText classes={{ primary: classes.primaryText }} inset
                                                                            primary={item} />
                                                                        {tmAccountDetails.name === item ?
                                                                            <ListItemIcon>
                                                                                <DoneIcon />
                                                                            </ListItemIcon>
                                                                            : null
                                                                        }
                                                                    </MenuItem>)
                                                                })
                                                            }
                                                        </MenuList>
                                                        <Divider variant="light" />
                                                    </div>
                                                    : null}
                                                <MenuList>
                                                    {isTendermint && tmAccountDetails ?
                                                        <div>
                                                            <MenuItem onClick={this.addTMAccount} style={{ height: 20 }}
                                                                disabled={this.props.vpnStatus}>
                                                                <ListItemIcon>
                                                                    <AddIcon />
                                                                </ListItemIcon>
                                                                <ListItemText inset primary={lang[language].CreateAccount} />
                                                            </MenuItem>
                                                            <MenuItem onClick={this.importTMAccount} style={{ height: 20 }}
                                                                disabled={this.props.vpnStatus}>
                                                                <ListItemIcon>
                                                                    <ImportIcon />
                                                                </ListItemIcon>
                                                                <ListItemText inset primary={`${lang[language].Recover} ${lang[language].Account}`} />
                                                            </MenuItem>
                                                        </div>
                                                        : null}
                                                    <MenuItem onClick={this.onLogoutClicked} style={{ height: 20 }}
                                                        disabled={this.props.vpnStatus}>
                                                        <ListItemIcon>
                                                            <LogoutIcon />
                                                        </ListItemIcon>
                                                        <ListItemText inset primary="Logout" />
                                                    </MenuItem>
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
                <CreateImportDialog
                    classes={{
                        paper: classes.paper,
                    }}
                    open={this.state.openCreateDialog}
                    isCreate={this.state.isCreate}
                    tmAccountDone={this.accountTmCreated}
                    onClose={this.handleDialogClose}
                />
            </div >
        )
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        language: state.setLanguage,
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
        tmAccountsList: state.getTMAccountsList,
        keys: state.getKeys
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
        getTMBalance,
        networkChange,
        setVpnType,
        setComponent,
        getKeys,
        setTMAccount,
        logoutNode
    }, dispatch)
}

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(Header);