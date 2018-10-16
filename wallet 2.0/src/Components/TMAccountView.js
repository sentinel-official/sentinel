import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, CardContent, CardHeader, Tooltip, Snackbar, IconButton, Button } from '@material-ui/core';
import { accountStyles } from '../Assets/tmaccount.styles';
import { withStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { QRCode } from 'react-qr-svg';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getTMBalance, getFreeTokens } from '../Actions/tendermint.action';
import { receiveStyles } from './../Assets/receive.styles';
let lang = require('./../Constants/language');

const customStyles = theme => ({
    title: accountStyles.titleStyle
})

class TMAccountView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: '',
            isFreeLoading: false
        }
    }

    componentWillMount = () => {
        this.props.getTMBalance(this.props.account.address);
    }

    getBalance = () => {
        this.props.getTMBalance(this.props.account.address);
    }

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };

    getFree() {
        this.setState({ isFreeLoading: true })
        this.props.getFreeTokens(this.props.account.address)
            .then((res) => {
                if (res.error) this.setState({ openSnack: true, snackMessage: res.error, isFreeLoading: false })
                else this.setState({ openSnack: true, snackMessage: res.payload, isFreeLoading: false })
            })
    }

    render() {
        let account_key = this.props.account;
        let { classes, language, balance, vpnStatus, currentUsage, activeVpn } = this.props;
        let balValue = (typeof balance === 'object' && balance !== null) ? ('value' in balance ? balance.value : {}) : {};
        let coins = (typeof balValue === 'object' && balValue !== null) ? ('coins' in balValue ? balValue.coins : []) : [];
        let token = coins && coins.length !== 0 ? coins.find(o => o.denom === 'sut') : {};
        let usedTokens = 0;
        if (vpnStatus) {
            let downloadData = parseInt(currentUsage && 'down' in currentUsage ? currentUsage.down : 0) / (1024 * 1024);
            usedTokens = ((this.props.activeVpn.price_per_GB * downloadData) / 1024).toFixed(3);
        }
        return (
            <div>
                <Button
                    disabled={this.state.isFreeLoading}
                    onClick={this.getFree.bind(this)}
                    style={this.state.isFreeLoading ? receiveStyles.flatButtonStyleOffTest : receiveStyles.flatButtonStyleOnTest}
                >{this.state.isFreeLoading ? 'Loading...' : lang[language].GetTokens}</Button>
                <div style={accountStyles.formStyle}>
                    <Card style={accountStyles.cardStyle}>
                        {/* <CardHeader
                            action={
                                <IconButton onClick={() => { this.getBalance() }} style={accountStyles.outlineNone}>
                                    <RefreshIcon />
                                </IconButton>
                            }
                        /> */}
                        <CardContent>
                            <QRCode
                                bgColor="#FFFFFF"
                                level="Q"
                                style={accountStyles.qrCodeStyle}
                                value={account_key ? account_key.address : 'Loading...'}
                                fgColor="#000000"
                            />
                            <label style={accountStyles.addressStyle}>
                                {account_key ? account_key.address : 'Loading...'}</label>
                            <Tooltip title="Copy">
                                <CopyToClipboard text={account_key ? account_key.address : 'Loading...'}
                                    onCopy={() => this.setState({
                                        snackMessage: lang[language].Copied,
                                        openSnack: true
                                    })}>
                                    <img src={'../src/Images/download.jpeg'}
                                        alt="Copy"
                                        style={accountStyles.clipBoard} />
                                </CopyToClipboard>
                            </Tooltip>

                            {balance === "" ?
                                <p style={accountStyles.notInNetStyle}>
                                    Note: Your account balance is 0 TSENT. You can get 300 TSENTs for free, click on GET TOKENs above.
                            </p>
                                :
                                // <p style={accountStyles.balanceStyle}>
                                //     {token && 'denom' in token ? (parseInt(token.amount) / (10 ** 8)).toFixed(3) : 'Loading...'}
                                //     {token && 'denom' in token ? ' SUTs' : ''}
                                // </p>
                                null
                            }
                            {/* {balance === "" ? <p>*Use faucet to get tokens and join the network</p> : null} */}
                            {
                                vpnStatus ?
                                    <div style={accountStyles.lastDiv}>
                                        <p><span style={accountStyles.notInNetStyle}>Total TSENTs Locked: </span>
                                            {localStorage.getItem('lockedAmount')}</p>
                                        <p><span style={accountStyles.notInNetStyle}>Current Session Usage (TSENTs): </span>
                                            {usedTokens}</p>
                                    </div> :
                                    null
                            }
                        </CardContent>
                    </Card>
                    <Snackbar
                        open={this.state.openSnack}
                        autoHideDuration={4000}
                        onClose={this.handleClose}
                        message={this.state.snackMessage}
                    />
                </div >
            </div>
        )
    }
}

TMAccountView.propTypes = {
    classes: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        language: state.setLanguage,
        isTest: state.setTestNet,
        account: state.setTMAccount,
        balance: state.tmBalance,
        vpnStatus: state.setVpnStatus,
        currentUsage: state.VPNUsage,
        activeVpn: state.getActiveVpn
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        getTMBalance,
        getFreeTokens
    }, dispatch)
}

export default compose(withStyles(customStyles), connect(mapStateToProps, mapDispatchToActions))(TMAccountView);