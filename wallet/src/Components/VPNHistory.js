import React, { Component } from 'react';
import { MuiThemeProvider, FlatButton } from 'material-ui';
import { getVpnHistory } from '../Actions/AccountActions';
import { RaisedButton, Card, CardHeader, CardText, CardActions, IconButton } from 'material-ui';
import Refresh from 'material-ui/svg-icons/navigation/refresh';

class VPNHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isInitial: true,
            vpnUsage: null
        }
    }

    getVpnHistory() {
        let that = this;
        getVpnHistory(this.props.local_address, (err, history) => {
            if (err) {
                console.log('Error')
            }
            else {
                that.setState({ vpnUsage: history })
            }
        })
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
        if (vpnUsage && vpnUsage.sessions.length !== 0) {
            sessionOutput = vpnUsage.sessions.map((sessionData) => {
                return (
                    <Card>
                        <CardText>
                            <span style={{ fontWeight: 600 }}>Session ID: </span>{sessionData.id}
                            <span style={{ fontWeight: 600, marginLeft: 10 }}>VPN address: </span>{sessionData.account_addr}
                            <span style={{ fontWeight: 600, marginLeft: 10 }}>Amount: </span>{sessionData.amount} SENTS<br />
                            <span style={{ fontWeight: 600 }}>Duration: </span>{sessionData.duration} secs
                            <span style={{ fontWeight: 600, marginLeft: 10 }}>Received Bytes: </span>{sessionData.received_bytes}
                            <span style={{ fontWeight: 600, marginLeft: 10 }}>Time: </span>{new Date(sessionData.timestamp * 1000).toGMTString()}<br />
                        </CardText>
                        {
                            sessionData.is_payed ?
                                <span></span> :
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
        return (
            <MuiThemeProvider>
                <div style={{ margin: '2%', padding: '2%' }}>
                    {vpnUsage ?
                        <div>
                            <div>
                                <IconButton style={{ position: 'absolute', right: 0, marginRight: '5%', marginTop: -25 }}>
                                    <Refresh onClick={this.getVpnHistory.bind(this)} />
                                </IconButton>
                            </div>
                            <span style={{ fontWeight: 600 }}>Total Due : </span>{vpnUsage.due} SENTS<br />
                            <span style={{ fontWeight: 600 }} >Total Duration : </span>{vpnUsage.stats['duration']} secs<br />
                            <span style={{ fontWeight: 600 }}>Total received Bytes : </span>{vpnUsage.stats['received_bytes']}
                            <hr />
                            <h4 style={{ fontWeight: 600 }}>Sessions</h4>
                            <div style={{ overflow: 'auto' }}>{sessionOutput}</div>
                        </div>

                        :
                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20%' }}>No VPN Used</div>
                    }
                </div>
            </MuiThemeProvider>
        )
    }
}

export default VPNHistory;