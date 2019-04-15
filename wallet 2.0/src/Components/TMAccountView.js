import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    Card, CardContent, CardHeader, Tooltip, Snackbar, IconButton, Button, TextField, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle
} from '@material-ui/core';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { accountStyles } from '../Assets/tmaccount.styles';
import { withStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { QRCode } from 'react-qr-svg';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getTMBalance, getFreeTokens, getManualRefund, addTransaction } from '../Actions/tendermint.action';
import { receiveStyles } from './../Assets/receive.styles';
import { createAccountStyle } from '../Assets/createtm.styles';

let lang = require('./../Constants/language');

const Customstyles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    enableButton: {
        "&:hover": {
            backgroundColor: '#2f3245'
        },
        backgroundColor: '#2f3245',
        outline: 'none'
        // height: '45px',
    },
    disableButton: {
        backgroundColor: '#BDBDBD',
        // height: '45px',
        cursor: 'not-allowed',
        outline: 'none'
    },
    submitButton: {
        outline: 'none'
    }
});

class TMAccountView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: '',
            isFreeLoading: false,
            open: false,
            sessionId: '',
            password: ''
        }
    }

    componentWillMount = () => {
        this.props.getTMBalance(this.props.account.address);
        localStorage.setItem('tmAccount', this.props.account.address);
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
                if (res.error) {
                    let regError = (res.error).replace(/\s/g, "");
                    this.setState({
                        openSnack: true,
                        snackMessage: lang[this.props.language][regError] ?
                            lang[this.props.language][regError] : res.error,
                        isFreeLoading: false
                    })
                }
                else {
                    let regError = (res.payload).replace(/\s/g, "");
                    this.setState({
                        openSnack: true,
                        snackMessage: lang[this.props.language][regError] ?
                            lang[this.props.language][regError] : res.payload,
                        isFreeLoading: false
                    });
                    setTimeout(() => {
                        this.props.getTMBalance(this.props.account.address);
                    }, 7000);
                }
            })
    }

    getRefund = () => {
        let data = {
            session_id: this.state.sessionId,
            name: this.props.account.name,
            password: this.state.password,
            gas: 200000
        }
        this.props.getManualRefund(data).then((res) => {
            if (res.error) {
                if (res.error.data === 'Ciphertext decryption failed') {
                    this.setState({
                        openSnack: true, snackMessage: lang[this.props.language].IncorrectPwd,
                        password: ''
                    })
                } else if (res.error.data.includes('24 hours')) {
                    this.setState({
                        openSnack: true, snackMessage: lang[this.props.language].TryAfter24hours,
                        password: ''
                    })
                } else {
                    this.setState({
                        openSnack: true, snackMessage: lang[this.props.language].InvalidSession,
                        password: ''
                    })
                }
            } else {
                addTransaction({
                    fromAccountAddress: 'REFUND_AMOUNT',
                    toAccountAddress: this.props.account.address,
                    txHash: res.payload.hash
                })
                this.setState({
                    openSnack: true, snackMessage: lang[this.props.language].RefundSuccess,
                })
            }
        })
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleDialogClose = () => {
        this.setState({ open: false });
    };

    render() {
        let account_key = this.props.account;
        let { classes, language, balance, vpnStatus, currentUsage, activeVpn, isConnectionEstablishing } = this.props;
        let balValue = (typeof balance === 'object' && balance !== null) ? ('value' in balance ? balance.value : {}) : {};
        let coins = (typeof balValue === 'object' && balValue !== null) ? ('coins' in balValue ? balValue.coins : []) : [];
        let token = coins && coins.length !== 0 ? coins.find(o => o.denom === 'sut') : {};
        let usedTokens = 0, remainingData;
            if (vpnStatus) {
            let downloadData = parseInt(currentUsage && 'down' in currentUsage ? currentUsage.down : 0) / (1024 * 1024);
            usedTokens = ((this.props.activeVpn.price_per_GB * downloadData) / 1024).toFixed(3);
            let availableData = parseInt(localStorage.getItem('availableData')) / (1024 * 1024);
            // remainingData = ((parseFloat(localStorage.getItem('lockedAmount')) - usedTokens) / this.props.activeVpn.price_per_GB).toFixed(4);
            remainingData = ((availableData - downloadData) / 1024).toFixed(4);
            }
        return (
            <div>
            {isConnectionEstablishing ?
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '25%', fontSize: '25px',  color: '#c3c3c3' }}>
                    {lang[language].EstablishingConnection} <img src={'../src/Images/load.svg'} alt="loading..." style={{ width: 25,marginTop: 10 }} />
                </div>
                :
                <div>
                    <div style={receiveStyles.getTokenButtonStyle}>
                        <Button
                            disabled={this.state.isFreeLoading || this.props.vpnStatus}
                            onClick={this.getFree.bind(this)}
                            style={this.state.isFreeLoading ? receiveStyles.tmFlatButtonStyleOffTest : receiveStyles.tmFlatButtonStyleOnTest}
                            style={this.props.vpnStatus ? receiveStyles.vpnFlatButtonStyleOffTest : receiveStyles.vpnFlatButtonStyleOnTest}
                        >{this.state.isFreeLoading ? lang[language].Loading : lang[language].GetTokens}</Button>
                    </div>
                    <div style={this.props.vpnStatus ? accountStyles.formVpnStyle : accountStyles.formStyle}>
                        <div style={accountStyles.cardStyle} bordered={false}>

                            <CardContent>
                                <QRCode
                                    bgColor="#FFFFFF"
                                    level="Q"
                                    style={accountStyles.qrCodeStyle}
                                    value={account_key ? account_key.address : lang[language].Loading}
                                    fgColor="#000000"
                                />
                                <label style={accountStyles.addressStyle}>
                                    {account_key ? account_key.address : lang[language].Loading}</label>
                                <Tooltip title={lang[language].Copy}>
                                    <CopyToClipboard text={account_key ? account_key.address : lang[language].Loading}
                                        onCopy={() => this.setState({
                                            snackMessage: lang[language].Copied,
                                            openSnack: true
                                        })}>

                                        <CopyIcon style={receiveStyles.clipBoard} />
                                    </CopyToClipboard>
                                </Tooltip>

                                {balance === "" ?
                                    <p style={accountStyles.notInNetStyle}>
                                        {lang[language].Note}
                                    </p>
                                    :

                                    null
                                }
                                {
                                    vpnStatus ?

                                        <div style={accountStyles.lastDiv}>
                                            <Row style={accountStyles.tsentRow}>
                                                <Col xs={4} style={accountStyles.notInNetStyle1}>{lang[language].TSentLocked}</Col>

                                                <Col xs={4} style={accountStyles.notInNetStyle1}>{lang[language].TSentConsumed}</Col>

                                                <Col xs={4} style={accountStyles.notInNetStyle}>{lang[language].AvailableData}</Col>

                                            </Row>
                                            <Row style={accountStyles.tsentRow}>
                                                <Col xs={4} style={accountStyles.tsentValue1}>  {localStorage.getItem('lockedAmount')}</Col>

                                                <Col xs={4} style={accountStyles.tsentValue1}>{usedTokens}</Col>

                                                <Col xs={4} style={accountStyles.tsentValue}>{ remainingData > 0 ? remainingData : "0.0000"} GB</Col>                                            </Row>

                                        </div>
                                        :
                                        null
                                }
                            </CardContent>
                        </div>
                        <Snackbar
                            open={this.state.openSnack}
                            autoHideDuration={4000}
                            onClose={this.handleClose}
                            message={this.state.snackMessage}
                        />
                    </div >
                    {!vpnStatus ?
                        <div style={receiveStyles.refundRequestDiv}>

                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={this.handleClickOpen}
                                className={classes.enableButton}
                                style={createAccountStyle.buttonStyle}
                            >

                                {lang[language].ManualRefundReq}
                            </Button>
                            <Dialog
                                open={this.state.open}
                                onClose={this.handleDialogClose}
                                aria-labelledby="form-dialog-title"
                            >
                                <DialogTitle id="form-dialog-title">  {lang[language].ManualRefundReq}
                                </DialogTitle>
                                <DialogContent>

                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label={lang[language].SessionId}
                                        type="text"
                                        value={this.state.sessionId}
                                        onChange={(e) => { this.setState({ sessionId: e.target.value }) }}
                                        fullWidth
                                    />
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        label={lang[language].AccountPwd}
                                        value={this.state.password}
                                        onChange={(e) => { this.setState({ password: e.target.value }) }}
                                        type="password"
                                        fullWidth
                                    />

                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.handleDialogClose} color="primary">
                                        {lang[language].Cancel}
                                    </Button>
                                    <Button
                                        disabled={!this.state.sessionId || !this.state.password}
                                        onClick={this.getRefund}
                                        className={classes.submitButton}
                                        color="primary">
                                        {lang[language].Submit}
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                        : null}
                </div>
            }
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
        activeVpn: state.getActiveVpn,
        isConnectionEstablishing: state.isConnectionEstablishing

    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        getTMBalance,
        getFreeTokens,
        getManualRefund
    }, dispatch)
}

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(TMAccountView);