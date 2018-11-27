import React, { Component } from 'react';
import { vpnhistoryStyles, styles } from '../Assets/vpnhistory.style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import lang from '../Constants/language';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Card, CardActions, CardContent, Snackbar, Tooltip, TextField, Button } from '@material-ui/core';
import Done from '@material-ui/icons/Done';
import Send from '@material-ui/icons/Send';
import Refresh from '@material-ui/icons/Refresh';
import ReactTooltip from 'react-tooltip';
import { getVpnHistory, setsnackMessage, compareTransaction, setVPNDuePayment } from '../Actions/vpnhistory.actions';
import { withStyles } from '@material-ui/core/styles';
import { setCurrentTab } from '../Actions/sidebar.action';
import { compose } from 'redux';
import { receiveStyles } from './../Assets/receive.styles';
import { historyLabel, historyValue, ETHcardStyle, statusLabel, statusValue } from '../Assets/commonStyles';
import { historyStyles } from '../Assets/txhistory.styles';


import _ from 'lodash';
import { MaskedInput } from 'react-text-mask'
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#2196f3'
        }
    }
});

class VPNHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txHash: '',
            sendenable: '',
        }
    }
    componentWillMount = () => {
        this.props.getVpnHistory(this.props.account_addr);
    };

    showText = (divID) => {
        if (document.getElementById(divID).style.display === 'none') {
            document.getElementById(divID).style.display = 'inline';
        }
        else {
            document.getElementById(divID).style.display = 'none';
        }
    };

    getPaymentBytes = (bytes) => {
        let data = (parseInt(bytes) / 1024);
        if (data >= 1024) {
            data = data / 1024;
            if (data >= 1024) {
                data = data / 1024;
                data = data.toFixed(3);
                return data + ' GB'
            }
            else {
                data = data.toFixed(3);
                return data + ' MB'
            }
        }
        else {
            data = data.toFixed(3);
            return data + ' KB';
        }
    };

    setHash = (event, hash) => {
        let value = event.target.value;
        var pattern = /^([0]{0,1}|[0][x][0-9A-Fa-f]{0,64})$/;
        if (value.match(pattern))
            this.setState({ txHash: event.target.value })

    };

    snackRequestClose = () => {
        this.props.setsnackMessage('')
    }
    handleclick = (sessiondata) => {
        var txhash = this.state.txHash
        this.setState({ txHash: '' })
        compareTransaction(sessiondata, txhash,
            this.props.account_addr, this.props.isTest, (err, str) => {
                if (!err) {
                    let regError = (str).replace(/\s/g, "");
                    this.props.setsnackMessage(
                        lang[this.props.lang][regError] ?
                            lang[this.props.lang][regError] : str)
                } else {
                    this.props.setsnackMessage('error occured')
                }
            })

    };

    history = () => {
        let sessionOutput;
        let that = this;
        const { classes } = this.props;
        let language = this.props.lang;
        if (this.props.VPNUsage) {
            if (this.props.VPNUsage.sessions.length !== 0) {
                var sessions = _.sortBy(this.props.VPNUsage.sessions, o => o.timeStamp).reverse()
                sessionOutput = sessions.map((sessionData) => {
                    return (

                        <div style={vpnhistoryStyles.historyCont}>
                            <div style={historyStyles.data}>
                                <Card style={ETHcardStyle}>
                                    <CardContent >

                                        {/* <span style={vpnhistoryStyles.headingStyle}>
                                    {lang[language].SessionId} :
                                </span> {sessionData.id} */}

                                        <div>
                                            <label style={historyLabel}>{`${lang[language].SessionId}:`}&nbsp;<span style={historyValue}>{sessionData.id}</span></label>
                                        </div>
                                        {/* <span style={vpnhistoryStyles.headingWithMarginStyle}>
                                    {lang[language].VpnAddress} :
                                </span> {sessionData.account_addr}
                                <Tooltip title={lang[language].Copy}>
                                    <CopyToClipboard text={sessionData.account_addr}
                                        onCopy={() =>
                                            this.props.setsnackMessage(lang[language].Copied)
                                        } >
                                       <CopyIcon style={receiveStyles.clipBoard} />

                                    </CopyToClipboard>
                                </Tooltip>
                                <ReactTooltip id="copyImage" place="bottom">
                                    <span>{lang[language].Copy}</span>
                                </ReactTooltip>
                                <br /> */}

                                        <div>
                                            <label style={historyLabel}>{`${lang[language].VpnAddress}:`}&nbsp;<span style={historyValue}>{sessionData.account_addr}</span></label>
                                            <Tooltip title={lang[language].Copy}>
                                                <CopyToClipboard text={sessionData.account_addr}
                                                    onCopy={() => this.setState({
                                                        snackMessage: lang[language].Copied,
                                                        openSnack: true
                                                    })}>

                                                    <CopyIcon style={receiveStyles.clipBoard} />
                                                </CopyToClipboard>
                                            </Tooltip>
                                        </div>

                                        {/*                        
                                <span style={vpnhistoryStyles.headingStyle}>
                                    {lang[language].Amount} :
                                </span> {parseInt(sessionData.amount) / (10 ** 8)} {lang[language].Sents} */}


                                        <div>

                                            <label style={historyLabel}>{`${lang[language].Amount}:`}&nbsp;<span style={historyValue}>{parseInt(sessionData.amount) / (10 ** 8)} {lang[language].TestSent}</span></label>
                                        </div>


                                        {/* <span style={vpnhistoryStyles.headingWithMarginStyle}>
                                    {lang[language].Duration} :
                                </span> {sessionData.session_duration} {lang[language].Secs} */}
                                        <div>
                                            <label style={historyLabel}>{`${lang[language].Duration}:`}&nbsp;<span style={historyValue}>{sessionData.session_duration} {lang[language].Secs}</span></label>

                                        </div>

                                        {/* <span style={vpnhistoryStyles.headingWithMarginStyle}>
                                    {lang[language].ReceivedData} :
                                 </span> {this.getPaymentBytes(sessionData.received_bytes)}<br /> */}

                                        <div>
                                            <label style={historyLabel}>{`${lang[language].ReceivedData}:`}&nbsp;<span style={historyValue}>{this.getPaymentBytes(sessionData.received_bytes)}</span></label>
                                        </div>
                                        {/* <span style={vpnhistoryStyles.headingStyle}>
                                    {lang[language].Time} : */}
                                        {/* </span> {new Date(sessionData.timestamp * 1000).toGMTString()} */}

                                        {/* </span> {new Date(sessionData.timestamp * 1000).toLocaleString()} */}

                                        <div>
                                            <label style={historyLabel}>{`${lang[language].Time}:`}&nbsp;<span style={historyValue}>{new Date(sessionData.timestamp * 1000).toLocaleString()}</span></label>
                                        </div>
                                    </CardContent>
                                    {
                                        sessionData.is_paid ?
                                            <span>
                                                <Done classes={{ root: classes.done }}
                                                    data-tip data-for="payed" />
                                                <ReactTooltip id="payed" place="bottom">
                                                    <span>Paid</span>
                                                </ReactTooltip>
                                            </span> :
                                            <span>
                                                <CardActions style={{ paddingLeft: '0px !important' }}>
                                                    <Button
                                                        variant="raised" color={{
                                                            primary: {
                                                                main: '#4fc3f7'
                                                            }
                                                        }}
                                                        classes={{
                                                            root: classes.but1_root,
                                                            label: classes.label,
                                                        }}
                                                        onClick={() => {
                                                            this.props.setVPNDuePayment(sessionData),
                                                                this.props.setCurrentTab('send')
                                                        }}
                                                    >{lang[this.props.lang].PayNow}</Button>
                                                    <Button
                                                        variant="raised" color="default"
                                                        classes={{
                                                            root: classes.but2_root,
                                                            label: classes.label,
                                                        }}
                                                        onClick={() => { this.showText(sessionData.id) }}
                                                    >{lang[this.props.lang].AlreadyReport}</Button>
                                                </CardActions>
                                                <div style={{ width: '90%', display: 'none' }} id={sessionData.id}>
                                                    <TextField
                                                        placeholder={lang[language].EnterTxHash}
                                                        className={classes.textField}
                                                        InputProps={{
                                                            disableUnderline: 'true',
                                                        }}
                                                        // inputProps={{pattern:'0x[a-fA-F0-9]{64}$'}}
                                                        onChange={this.setHash}
                                                        value={this.state.txHash}

                                                    />
                                                    <span>
                                                        <IconButton
                                                            classes={{ root: classes.button_send }}
                                                            onClick={() => {
                                                                this.handleclick(sessionData)
                                                            }}
                                                            disabled={!((this.state.txHash.length) === 66)}
                                                        >
                                                            <Send />
                                                        </IconButton>

                                                    </span>
                                                </div>
                                            </span>
                                    }
                                </Card >
                            </div>
                        </div>
                    )
                })
            }
            else {
                sessionOutput = <div style={vpnhistoryStyles.noSessionsStyle}>{lang[language].NoPrevSessions}</div>
            }
        }
        else {
            sessionOutput = <div style={vpnhistoryStyles.noSessionsStyle}>{lang[language].NoPrevSessions}</div>
        }
        return sessionOutput;
    };

    render() {
        // console.log("vpnHistory", this.props.VPNUsage)
        let language = this.props.lang;
        let VpnUsage = this.props.VPNUsage;
        const { classes } = this.props;
        return (

            <MuiThemeProvider theme={theme}>
                <div style={vpnhistoryStyles.screen}>
                    <div>
                        <IconButton classes={{ root: classes.button_refresh }} >
                            <Refresh className={classes.refresh_icon} onClick={() => this.props.getVpnHistory(this.props.account_addr)} />
                        </IconButton>
                    </div>
                    {VpnUsage && VpnUsage !== 'Loading' ?
                        <div>
                            <div style={{ paddingTop: '2%', color: '#919191', fontFamily: 'Montserrat, Medium' }}>
                                <span style={vpnhistoryStyles.text1}>
                                    {lang[language].TotalDue} :
                                </span> {parseInt(VpnUsage.due) / (10 ** 8)} {lang[language].TestSent}<br />
                                <span style={vpnhistoryStyles.text1}>
                                    {lang[language].TotalDuration} :
                                </span> {VpnUsage.stats['duration']} {lang[language].Secs} <br />
                                <span style={vpnhistoryStyles.text1}>
                                    {lang[language].TotalData} :
                                </span> {this.getPaymentBytes(VpnUsage.stats['received_bytes'])}<br />
                                <hr />
                            </div>
                            <h2 style={vpnhistoryStyles.header}>{lang[language].Sessions}</h2>
                            <div style={vpnhistoryStyles.history}>
                                {this.history()}
                            </div>
                        </div>
                        : VpnUsage === null ?
                            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20%', fontSize: '25px' }}>
                                {lang[language].NoVPNUsed}
                            </div>
                            :
                            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20%', fontSize: '25px' }}>
                                {lang[language].Loading}
                            </div>
                    }
                    <Snackbar
                        open={this.props.snack.status}
                        message={this.props.snack.message}
                        autoHideDuration={3000}
                        transitionDuration={{ enter: 200, exit: 200 }}
                        onClose={this.snackRequestClose}
                        classes={{ root: classes.snack }}
                    />
                </div>
            </MuiThemeProvider>
        )
    }
}
function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        VPNUsage: state.getVPNHistory,
        account_addr: state.getAccount,
        snack: state.getSnackMessage,
        isTest: state.setTestNet,
        vpndue: state.getVPNDuePaymentDetails
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        getVpnHistory,
        setsnackMessage,
        setVPNDuePayment,
        setCurrentTab
    }, dispatch)
}
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToActions)(VPNHistory));