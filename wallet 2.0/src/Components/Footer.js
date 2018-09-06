import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IconButton, Tooltip, Snackbar } from '@material-ui/core';
import DisconnectIcon from '@material-ui/icons/HighlightOff';
import { setVpnStatus } from '../Actions/vpnlist.action';
import { getSignHash, addSignature } from '../Actions/tmvpn.action';
import { disconnectVPN } from '../Utils/DisconnectVpn';
import { footerStyles } from '../Assets/footer.styles';
import { Grid, Row, Col } from 'react-flexbox-grid';
import lang from '../Constants/language';

let downloadData = 0;

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: '',
            status: false,
            counter: 1
        }
    }

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };

    componentWillReceiveProps = (next) => {
        if (this.state.status !== next.vpnStatus) {
            this.setState({ status: next.vpnStatus, counter: 1 })
        }
    }

    sendSignature = (downData, isFinal) => {
        console.log("Price..", this.props.activeVpn.price_per_GB, downData);
        let amount = (this.props.activeVpn.price_per_GB * downData) / 1024;
        console.log("Amount...", amount);
        this.props.getSignHash(Math.round(amount), this.state.counter, isFinal).then(res => {
            console.log("Sign...", res);
            if (res.error) {
                console.log("SignError...", res.error);
            }
            else {
                console.log("True...", res);
                let data = {
                    account_addr: this.props.account.address,
                    session_id: localStorage.getItem('SESSION_NAME'),
                    token: localStorage.getItem('TOKEN'),
                    signature: {
                        hash: res.payload,
                        index: this.state.counter,
                        amount: Math.round(amount).toString() + 'sut',
                        final: isFinal
                    }
                }
                this.props.addSignature(data).then(response => {
                    if (response.error) {
                        console.log("Send SignError...", response.error);
                    }
                    else {
                        if (response.payload.success) {
                            this.setState({ counter: this.state.counter + 1 })
                        }
                        else {
                            console.log("False...", response.payload);
                        }
                    }
                })
            }
        })
    }

    disconnect = async () => {
        if (this.props.isTm) {
            console.log("Hello..")
            await this.sendSignature(downloadData, true);
            disconnectVPN((res) => {
                if (res) {
                    this.setState({ openSnack: true, snackMessage: res });
                }
                else {
                    this.setState({ openSnack: true, snackMessage: 'Disconnected VPN' });
                    this.props.setVpnStatus(false);
                }
            })
        }
        else {
            disconnectVPN((res) => {
                if (res) {
                    this.setState({ openSnack: true, snackMessage: res });
                }
                else {
                    this.setState({ openSnack: true, snackMessage: 'Disconnected VPN' });
                    this.props.setVpnStatus(false);
                }
            })
        }
    }

    render() {
        let language = this.props.lang;
        let { vpnStatus, currentUsage, isTm } = this.props;
        let counter = this.state.counter;
        console.log("Usage..", currentUsage);
        downloadData = parseInt(currentUsage && 'down' in currentUsage ? currentUsage.down : 0) / (1024 * 1024);
        if (vpnStatus && isTm && downloadData >= counter * 10) {
            this.sendSignature(downloadData, false);
        }
        return (
            <div style={footerStyles.mainDivStyle}>
                <Grid>
                    <Row>
                        <Col xs={3} style={footerStyles.firstColumn}>
                            <p style={footerStyles.testLabelStyle}>
                                {this.props.isTest ? 'Test Net Activated' : 'Test Net NOT Activated'}
                            </p>
                        </Col>
                        {
                            vpnStatus ?
                                <Col xs={1}>
                                    <Tooltip title="Disconnect">
                                        <IconButton onClick={() => { this.disconnect() }}>
                                            <DisconnectIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Col>
                                : null
                        }
                        {
                            vpnStatus ?
                                <Col xs={8}>
                                    <Row style={footerStyles.textCenter}>
                                        <Col xs={3}>
                                            <label style={footerStyles.headingStyle}>IP Address</label>
                                            <p style={footerStyles.valueStyle}>
                                                {localStorage.getItem('IPGENERATED')}
                                            </p>
                                        </Col>
                                        <Col xs={2}>
                                            <label style={footerStyles.headingStyle}>{lang[language].Speed}</label>
                                            <p style={footerStyles.valueStyle}>
                                                {localStorage.getItem('SPEED')}
                                            </p>
                                        </Col>
                                        <Col xs={3}>
                                            <label style={footerStyles.headingStyle}>{lang[language].Location}</label>
                                            <p style={footerStyles.valueStyle}>
                                                {localStorage.getItem('LOCATION')}
                                            </p>
                                        </Col>
                                        <Col xs={2}>
                                            <label style={footerStyles.headingStyle}>Download</label>
                                            <p style={footerStyles.valueStyle}>
                                                {currentUsage ? (parseInt('down' in currentUsage ? currentUsage.down : 0) / (1024 * 1024)).toFixed(2) : 0.00} MB
                                            </p>
                                        </Col>
                                        <Col xs={2}>
                                            <label style={footerStyles.headingStyle}>Upload</label>
                                            <p style={footerStyles.valueStyle}>
                                                {currentUsage ? (parseInt('up' in currentUsage ? currentUsage.up : 0) / (1024 * 1024)).toFixed(2) : 0.00} MB
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                                : null}
                    </Row>
                </Grid>
                <Snackbar
                    open={this.state.openSnack}
                    autoHideDuration={4000}
                    onClose={this.handleClose}
                    message={this.state.snackMessage}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        isTest: state.setTestNet,
        currentUsage: state.VPNUsage,
        vpnStatus: state.setVpnStatus,
        isTm: state.setTendermint,
        activeVpn: state.getActiveVpn,
        account: state.setTMAccount
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setVpnStatus,
        getSignHash,
        addSignature
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(Footer);