import React, { Component } from 'react';
import { MuiThemeProvider, FlatButton } from 'material-ui';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getVpnHistory, isOnline } from '../Actions/AccountActions';
import { RaisedButton, Card, CardHeader, CardText, CardActions, IconButton, Snackbar } from 'material-ui';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import Done from 'material-ui/svg-icons/action/done';
import ReactTooltip from 'react-tooltip';
import _ from 'lodash';

class VPNHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isInitial: true,
            vpnUsage: null,
            openSnack: false,
            snackMessage: ''
        }
    }

    snackRequestClose = () => {
        this.setState({
            openSnack: false,
        });
    };

    getVpnHistory() {
        let that = this;
        if (isOnline()) {
            getVpnHistory(this.props.local_address, (err, history) => {
                if (err) {
                    console.log('Error')
                }
                else {
                    that.setState({ vpnUsage: history })
                }
            })
        }
        else {
            this.setState({ openSnack: true, snackMessage: 'Check your Internet Connection' })
        }
    }

    payDue(sessionDetails) {
        this.props.payVPN(sessionDetails);
    }

    render() {
        let sessionOutput;
        if (this.state.isInitial && this.props.local_address !== "") {
            this.getVpnHistory();
            this.setState({ isInitial: false });
        }
        let vpnUsage = this.state.vpnUsage;
        let that = this;
        if (vpnUsage) {
            if (vpnUsage.sessions.length !== 0) {
                var sessions = _.sortBy(vpnUsage.sessions, o => o.timeStamp).reverse()
                sessionOutput = sessions.map((sessionData) => {
                    return (
                        <Card>
                            <CardText>
                                <span style={{ fontWeight: 600 }}>Session ID: </span>{sessionData.id}
                                <span style={{ fontWeight: 600, marginLeft: 10 }}>VPN address: </span>{sessionData.account_addr}
                                <CopyToClipboard text={sessionData.account_addr}
                                    onCopy={() => that.setState({
                                        snackMessage: 'Copied to Clipboard Successfully',
                                        openSnack: true
                                    })} >
                                    <img src={'../src/Images/download.jpeg'}
                                        data-tip data-for="copyImage"
                                        style={styles.clipBoard} />
                                </CopyToClipboard>
                                <ReactTooltip id="copyImage" place="bottom">
                                    <span>Copy</span>
                                </ReactTooltip>
                                <span style={{ fontWeight: 600, marginLeft: 10 }}>Amount: </span>{sessionData.amount} SENTS<br />
                                <span style={{ fontWeight: 600 }}>Duration: </span>{sessionData.duration} secs
                            <span style={{ fontWeight: 600, marginLeft: 10 }}>Received Bytes: </span>{sessionData.received_bytes}
                                <span style={{ fontWeight: 600, marginLeft: 10 }}>Time: </span>{new Date(sessionData.timestamp * 1000).toGMTString()}
                            </CardText>
                            {
                                sessionData.is_payed ?
                                    <span>
                                        <Done style={{ float: 'right', marginTop: '-7%', marginRight: '1%' }}
                                            data-tip data-for="payed" color="green" />
                                        <ReactTooltip id="payed" place="bottom">
                                            <span>Payed</span>
                                        </ReactTooltip>
                                    </span> :
                                    <CardActions>
                                        <RaisedButton
                                            label="Pay Now"
                                            labelStyle={{ textTransform: 'none' }}
                                            onClick={() => { this.payDue(sessionData) }}
                                            primary={true}
                                        />
                                    </CardActions>
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
                            <span style={{ fontWeight: 600 }}>Total Due : </span>{vpnUsage.due} SENTS<br />
                            <span style={{ fontWeight: 600 }} >Total Duration : </span>{vpnUsage.stats['duration']} secs<br />
                            <span style={{ fontWeight: 600 }}>Total received Bytes : </span>{vpnUsage.stats['received_bytes']}
                            <hr />
                            <h4 style={{ fontWeight: 600 }}>Sessions</h4>
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