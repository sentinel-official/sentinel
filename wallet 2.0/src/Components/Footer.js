import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Tooltip, Snackbar } from '@material-ui/core';
import DisconnectIcon from '@material-ui/icons/HighlightOff';
import { setVpnStatus, clearUsage } from '../Actions/vpnlist.action';
import { getSignHash, addSignature, deleteTmAccount } from '../Actions/tmvpn.action';
import { disconnectVPN } from '../Utils/DisconnectVpn';
import { footerStyles } from '../Assets/footer.styles';
import { Grid, Row, Col } from 'react-flexbox-grid';
import lang from '../Constants/language';
import RatingDialog from './RatingDialog';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { disconnectSocks } from '../Utils/DisconnectSocks';
import { isOnline } from "../Actions/convertErc.action";

import '../Assets/footerStyle.css';

const electron = window.require('electron');
const { exec } = window.require('child_process');
const remote = electron.remote;

const styles = theme => ({
    paper: {
        width: '80%',
        maxHeight: 335,
    },
});

let downloadData = 0;

class Footer extends Component {

    componentWillMount = () => {
        console.log("in online ", isOnline());
    }
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: '',
            rateDialog: false,
            status: false,
            counter: 1,
            showAlert: false,
            isDisabled: false
        }
    }

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };

    handleDialogClose = () => {
        this.setState({ rateDialog: false });
    };

    snackOpenDialog = (message) => {
        this.setState({ openSnack: true, snackMessage: message })
    }

    componentWillReceiveProps = (next) => {
        if (this.state.status !== next.vpnStatus) {
            this.setState({ status: next.vpnStatus, counter: 1 })
        }
    }

    sendSignature = (downData, isFinal, counter) => {
        let amount = (this.props.activeVpn.price_per_GB * downData) / 1024;
        if (amount >= parseInt(localStorage.getItem('lockedAmount')) && !this.state.showAlert)
            this.setState({
                openSnack: true, showAlert: true,
                snackMessage: 'You have used all of your locked TSENTs. Please reconnect and pay.'
            })
        this.props.getSignHash(Math.round(amount * (10 ** 8)), counter, isFinal).then(res => {
            if (res.error) {
                console.log("SignError...", res.error);
            }
            else {
                let data = {
                    token: localStorage.getItem('TOKEN'),
                    signature: {
                        hash: res.payload,
                        index: counter,
                        amount: (Math.round(amount * (10 ** 8))).toString() + 'sut',
                        final: isFinal
                    }
                }
                this.props.addSignature(data, this.props.account.address).then(response => {
                    if (response.error) {
                        console.log("Send SignError...", response.error);
                    }
                    else {
                        if (response.payload.success) {
                            this.setState({ counter: counter + 1 })
                        }
                        else {
                            console.log("False...", response.payload);
                        }
                    }
                })
            }
        })
    }

    disconnect = () => {
        this.setState({ isDisabled: true })
        if (this.props.isTm) {
            this.sendSignature(downloadData, true, this.state.counter);
            disconnectVPN((res) => {
                if (res) {
                    this.setState({ openSnack: true, snackMessage: res, isDisabled: false });
                }
                else {
                    this.setState({
                        openSnack: true, snackMessage: lang[this.props.language].DisconnectVPN,
                        counter: 1, showAlert: false, isDisabled: false
                    });
                    this.props.clearUsage();
                    this.props.setVpnStatus(false);
                    deleteTmAccount();
                }
            })
        }
        else {
            if (this.props.vpnType === 'openvpn') {
                disconnectVPN((res) => {
                    if (res) {
                        this.setState({ openSnack: true, snackMessage: res, isDisabled: false });
                    }
                    else {
                        this.setState({
                            openSnack: true, snackMessage: lang[this.props.language].DisconnectVPN,
                            rateDialog: true, isDisabled: false
                        });
                        this.props.clearUsage();
                        this.props.setVpnStatus(false);
                    }
                })
            } else {
                disconnectSocks(this.props.walletAddr, (res) => {
                    if (res) {
                        this.setState({ openSnack: true, snackMessage: res, isDisabled: false });
                    }
                    else {
                        if (remote.process.platform === 'win32') {
                            exec('start iexplore "https://www.bing.com/search?q=my+ip&form=EDGHPT&qs=HS&cvid=f47c42614ae947668454bf39d279d717&cc=IN&setlang=en-GB"', function (stderr, stdout, error) {
                                console.log('browser opened');
                            });
                        }
                        this.setState({
                            openSnack: true, snackMessage: lang[this.props.language].DisconnectVPN,
                            rateDialog: true, isDisabled: false
                        });
                        this.props.clearUsage();
                        this.props.setVpnStatus(false);
                    }
                })
            }
        }
    }

    render() {
        let language = this.props.language;
        let { vpnStatus, currentUsage, isTm, classes } = this.props;
        let counter = this.state.counter;
        downloadData = parseInt(currentUsage && 'down' in currentUsage ? currentUsage.down : 0) / (1024 * 1024);
        if (vpnStatus && isTm && downloadData >= counter * 10) {
            this.sendSignature(downloadData, false, counter);
        }
        if (!vpnStatus) {
            downloadData = 0;

        }
        return (
            <div style={footerStyles.mainDivStyle} className="footerStyle">
                <Grid>
                    <Row>
                        <Col xs={3} style={footerStyles.firstColumn}>
                            <p style={footerStyles.testLabelStyle}>
                                {
                                    isOnline() ?
                                        this.props.isTm ?
                                            <span><span style={footerStyles.greenDot}></span><span style={footerStyles.name}>{lang[language].TMTestNet}</span><span style={footerStyles.activated}>{lang[language].Activated}</span> </span> :
                                            this.props.isTest ?


                                                <span><span style={footerStyles.greenDot}></span><span style={footerStyles.name}>{lang[language].ETHTestNet}</span><span style={footerStyles.activated}>{lang[language].Activated}</span> </span>

                                                :

                                                <span><span style={footerStyles.greenDot}></span><span style={footerStyles.name}>{lang[language].ETHMainNet}</span><span style={footerStyles.activated}>{lang[language].Activated}</span> </span>
                                        :
                                        <span><span style={footerStyles.redDot}></span>{lang[language].OfflineInFooter}</span>
                                }
                            </p>
                        </Col>
                        {
                            vpnStatus ?
                                <Col xs={9} style={footerStyles.vpnConnected}>
                                    <Row style={footerStyles.textCenter}>
                                        <Col xs={2} style={footerStyles.vpnConnected} >
                                            <label style={footerStyles.headingStyle}>{lang[language].IPAddress}</label>
                                            <p style={footerStyles.valueStyle}>
                                                {localStorage.getItem('IPGENERATED')}
                                            </p>
                                        </Col>
                                        <Col xs={2} style={footerStyles.vpnConnected}>
                                            <label style={footerStyles.headingStyle}>{lang[language].Speed}</label>
                                            <p style={footerStyles.valueStyle}>
                                                {localStorage.getItem('SPEED')}
                                            </p>
                                        </Col>
                                        <Col xs={2} style={footerStyles.vpnConnected}>
                                            <label style={footerStyles.headingStyle}>{lang[language].Location}</label>
                                            <p style={footerStyles.valueStyle}>
                                                {localStorage.getItem('LOCATION')}
                                            </p>
                                        </Col>

                                        <Col xs={3} style={footerStyles.vpnConnected}>
                                            <Row>
                                                <Col xs={2}></Col>
                                                <Col xs={5}>
                                                    <label style={footerStyles.headingStyle}>{lang[language].Upload}</label>
                                                    <p style={footerStyles.valueStyle}>
                                                        {currentUsage ? (parseInt('up' in currentUsage ? currentUsage.up : 0) / (1024 * 1024)).toFixed(2) : 0.00} {lang[language].MB}
                                                    </p>
                                                </Col>
                                                <Col xs={5}>
                                                    <label style={footerStyles.headingStyle}>{lang[language].Download}</label>
                                                    <p style={footerStyles.valueStyle}>
                                                        {currentUsage ? (parseInt('down' in currentUsage ? currentUsage.down : 0) / (1024 * 1024)).toFixed(2) : 0.00} {lang[language].MB}
                                                    </p>
                                                </Col>
                                            </Row>
                                        </Col>

                                        {/* <Col xs={2} style={footerStyles.vpnConnected}>
                                           
                                        </Col> */}


                                        {
                                            vpnStatus ?
                                                <Col xs={3} style={footerStyles.vpnConnected}>
                                                    <Tooltip title={lang[language].Disconnect}>
                                                        <Button style={footerStyles.disconnectStyle}
                                                            disabled={this.state.isDisabled}
                                                            onClick={() => { this.disconnect() }}>
                                                            <span style={footerStyles.disconnectText}>  {lang[language].Disconnect} </span>
                                                            <DisconnectIcon style={footerStyles.crossMark} />
                                                        </Button>
                                                    </Tooltip>
                                                </Col>
                                                : null
                                        }
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
                <RatingDialog
                    classes={{
                        paper: classes.paper,
                    }}
                    open={this.state.rateDialog}
                    onClose={this.handleDialogClose}
                    snackOpenDialog={this.snackOpenDialog}
                />
            </div>
        )
    }
}

Footer.propTypes = {
    classes: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
    return {
        language: state.setLanguage,
        isTest: state.setTestNet,
        currentUsage: state.VPNUsage,
        vpnStatus: state.setVpnStatus,
        isTm: state.setTendermint,
        activeVpn: state.getActiveVpn,
        account: state.setTMAccount,
        vpnType: state.vpnType,
        walletAddr: state.getAccount
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setVpnStatus,
        getSignHash,
        addSignature,
        clearUsage
    }, dispatch)
}

export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToActions))(Footer);