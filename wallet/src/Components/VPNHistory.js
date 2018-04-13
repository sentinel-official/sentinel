import React, { Component } from 'react';
import { MuiThemeProvider } from 'material-ui';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getVpnHistory, isOnline, getSentTransactionHistory, reportPayment } from '../Actions/AccountActions';
import { RaisedButton, Card, CardText, CardActions, IconButton, Snackbar, TextField } from 'material-ui';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import Done from 'material-ui/svg-icons/action/done';
import Send from 'material-ui/svg-icons/content/send';
import ReactTooltip from 'react-tooltip';
import _ from 'lodash';
import { sendError } from '../helpers/ErrorLog';
let zfill = require('zfill');
var lang = require('./language');

class VPNHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isInitial: true,
            vpnUsage: null,
            openSnack: false,
            snackMessage: '',
            isReport: false,
            txHash: ''
        }
    }

    snackRequestClose = () => {
        this.setState({
            openSnack: false,
        });
    };

    showText = (divID) => {
        console.log("Display...", document.getElementById(divID).style.display);
        if (document.getElementById(divID).style.display === 'none') {
            document.getElementById(divID).style.display = 'inline';
        }
        else {
            document.getElementById(divID).style.display = 'none';
        }
    }

    getVpnHistory() {
        let that = this;
        if (isOnline()) {
            getVpnHistory(this.props.local_address, (err, history) => {
                if (err) {
                    sendError(err)
                }
                else {
                    console.log('Session Data..', history)
                    that.setState({ vpnUsage: history })
                }
            })
        }
        else {
            this.setState({ openSnack: true, snackMessage: lang[this.props.lang].CheckInternet })
        }
    }

    getPaymentBytes(bytes) {
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
    }

    payDue(sessionDetails) {
        this.props.payVPN(sessionDetails);
    }

    compareTransaction(sessionData) {
        var txId = this.state.txHash;
        let that = this;
        getSentTransactionHistory('0x' + zfill(this.props.local_address.substring(2), 64), (err, history) => {
            if (err) {
                that.setState({ openSnack: true, snackMessage: 'Problem faced in reporting. Try again later' })
            }
            else {
                var data = _.sortBy(history, o => o.timeStamp).reverse()
                var transactionDetails = data.find(o => o.transactionHash === txId)
                if (transactionDetails === undefined) {
                    that.setState({ openSnack: true, snackMessage: 'No transaction found with that transaction Id' })
                } else {
                    console.log("Details..", transactionDetails);
                    var transacToAddr = '0x' + transactionDetails.topics[2].substring(26);
                    var transacFrom = '0x' + transactionDetails.topics[1].substring(26);
                    console.log("Trans..", transacFrom, transacToAddr);
                    if (transacFrom.toLowerCase() === that.props.local_address.toLowerCase() &&
                        transacToAddr.toLowerCase() === sessionData.account_addr.toLowerCase() &&
                        (parseInt(transactionDetails.data) === parseInt(sessionData.amount) ||
                            (parseInt(transactionDetails.data) + 1) === parseInt(sessionData.amount)) &&
                        parseInt(transactionDetails.timeStamp) >= sessionData.timestamp
                    ) {
                        let body = {
                            from_addr: that.props.local_address,
                            amount: sessionData.amount,
                            session_id: sessionData.id
                        }
                        reportPayment(body, function (err, tx_addr) {
                            if (err) {
                                that.setState({ openSnack: true, snackMessage: 'Problem faced in reporting. Try again later' })
                            }
                            else {
                                that.setState({ openSnack: true, snackMessage: 'Reported Successfully' })
                            }
                        })
                    } else {
                        that.setState({ openSnack: true, snackMessage: 'Not a valid transaction hash' })
                    }
                }
            }
        })
    }

    render() {
        let sessionOutput;
        if (this.state.isInitial && this.props.local_address !== "") {
            this.getVpnHistory();
            this.setState({ isInitial: false });
        }
        let vpnUsage = this.state.vpnUsage;
        let that = this;
        let language = this.props.lang;
        if (vpnUsage) {
            if (vpnUsage.sessions.length !== 0) {
                var sessions = _.sortBy(vpnUsage.sessions, o => o.timeStamp).reverse()
                sessionOutput = sessions.map((sessionData) => {
                    return (
                        <Card>
                            <CardText>
                                <span style={{ fontWeight: 600 }}>{lang[language].SessionId}: </span>{sessionData.id}
                                <span style={{ fontWeight: 600, marginLeft: 10 }}>{lang[language].VpnAddress}: </span>{sessionData.account_addr}
                                <CopyToClipboard text={sessionData.account_addr}
                                    onCopy={() => that.setState({
                                        snackMessage: 'Copied to Clipboard Successfully',
                                        openSnack: true
                                    })} >
                                    <img src={'../src/Images/download.jpeg'}
                                        alt="copy"
                                        data-tip data-for="copyImage"
                                        style={styles.clipBoard} />
                                </CopyToClipboard>
                                <ReactTooltip id="copyImage" place="bottom">
                                    <span>Copy</span>
                                </ReactTooltip>
                                <br />
                                <span style={{ fontWeight: 600 }}>{lang[language].Amount}: </span>{parseInt(sessionData.amount) / (10 ** 8)} SENTS
                                <span style={{ fontWeight: 600, marginLeft: 10 }}>{lang[language].Duration}: </span>{sessionData.session_duration} secs
                            <span style={{ fontWeight: 600, marginLeft: 10 }}>{lang[language].ReceivedData}: </span>{this.getPaymentBytes(sessionData.received_bytes)}<br />
                                <span style={{ fontWeight: 600 }}>{lang[language].Time}: </span>{new Date(sessionData.timestamp * 1000).toGMTString()}
                            </CardText>
                            {
                                sessionData.is_paid ?
                                    <span>
                                        <Done style={{ float: 'right', marginTop: '-7%', marginRight: '1%' }}
                                            data-tip data-for="payed" color="green" />
                                        <ReactTooltip id="payed" place="bottom">
                                            <span>Paid</span>
                                        </ReactTooltip>
                                    </span> :
                                    <span>
                                        <CardActions>
                                            <RaisedButton
                                                label={lang[language].PayNow}
                                                labelStyle={{ textTransform: 'none' }}
                                                onClick={() => { this.payDue(sessionData) }}
                                                primary={true}
                                            />
                                            <RaisedButton
                                                label={lang[language].AlreadyReport}
                                                labelStyle={{ textTransform: 'none' }}
                                                onClick={() => { this.showText(sessionData.id) }}
                                            />
                                        </CardActions>
                                        <div style={{ display: 'none' }} id={sessionData.id}>
                                            <TextField
                                                hintText="Enter txhash of transaction"
                                                hintStyle={{ bottom: 5, paddingLeft: '2%' }}
                                                style={{ backgroundColor: '#FAFAFA', height: 36, width: '80%', margin: 10 }}
                                                onChange={(event, txHash) => this.setState({ txHash })}
                                                value={this.state.txHash}
                                                underlineShow={false}
                                                inputStyle={{ padding: '2%' }}
                                            />
                                            <span>
                                                <IconButton
                                                    style={{ padding: 0, backgroundColor: '#00bcd4', height: 36, width: 36 }}
                                                    iconStyle={{ height: 20, color: 'white' }}
                                                    onClick={() => { this.compareTransaction(sessionData) }}
                                                >
                                                    <Send />
                                                </IconButton>

                                            </span>
                                        </div>
                                    </span>
                            }
                        </Card >
                    )
                })
            }
            else {
                sessionOutput = <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20%' }}>No Previous Sessions</div>
            }
        }
        else {
            sessionOutput = <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20%' }}>No Previous Sessions</div>
        }
        return (
            <MuiThemeProvider>
                <div style={{ margin: '2%', padding: '2%' }}>
                    <div>
                        <IconButton style={{ position: 'absolute', right: 0, marginRight: '5%', marginTop: -25 }}>
                            <Refresh onClick={this.getVpnHistory.bind(this)} />
                        </IconButton>
                    </div>
                    {vpnUsage ?
                        <div>
                            <span style={{ fontWeight: 600 }}>{lang[language].TotalDue} : </span>{parseInt(vpnUsage.due) / (10 ** 8)} SENTS<br />
                            <span style={{ fontWeight: 600 }} >{lang[language].TotalDuration} : </span>{vpnUsage.stats['duration']} secs<br />
                            <span style={{ fontWeight: 600 }}>{lang[language].TotalData} : </span>{this.getPaymentBytes(vpnUsage.stats['received_bytes'])}
                            <hr />
                            <h4 style={{ fontWeight: 600 }}>{lang[language].Sessions}</h4>
                            <div style={{ overflow: 'auto', height: 300 }}>{sessionOutput}</div>
                        </div>

                        :
                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20%' }}>No VPN Used</div>
                    }
                    <Snackbar
                        open={this.state.openSnack}
                        message={this.state.snackMessage}
                        autoHideDuration={2000}
                        onRequestClose={this.snackRequestClose}
                        style={{ marginBottom: '2%' }}
                    />
                </div>
            </MuiThemeProvider>
        )
    }
}

const styles = {
    clipBoard: {
        height: 20,
        width: 20,
        cursor: 'pointer'
    }
}

export default VPNHistory;