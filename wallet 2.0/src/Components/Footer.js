import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Tooltip, Snackbar } from '@material-ui/core';
import DisconnectIcon from '@material-ui/icons/HighlightOff';
import { setVpnStatus, clearUsage } from '../Actions/vpnlist.action';
import { setCurrentTab } from '../Actions/sidebar.action';
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
var notifier = window.require('node-notifier');

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
            isDisabled: false,
            disconnectCalled: false
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
            this.setState({ status: next.vpnStatus, counter: 0 })
        }
    }

    checkGB = (downData) => {
        if (downData >= 900 && !this.state.showAlert) {
            this.setState({
                openSnack: true, showAlert: true,
                snackMessage: lang[this.props.language].UsedFullQuota
            })
        }
    }

    sendSignature = (downData, isFinal, counter) => {
        let amount = (this.props.activeVpn.price_per_GB * downData) / 1024;
        if (amount >= parseInt(localStorage.getItem('lockedAmount')) && !this.state.showAlert)
            this.setState({
                openSnack: true, showAlert: true,
                snackMessage: lang[this.props.language].UsedAllLocked
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

    disconnectTMVpn = () => {
        this.setState({ disconnectCalled: true });
        disconnectVPN((res) => {
            if (res) {
                let regError = res.replace(/\s/g, "");
                this.setState({
                    openSnack: true,
                    snackMessage: lang[this.props.language][regError] ?
                        lang[this.props.language][regError] : res,
                    isDisabled: false, disconnectCalled: false
                });
            }
            else {
                this.setState({
                    openSnack: true, snackMessage: lang[this.props.language].DisconnectVPN,
                    counter: 1, rateDialog: true, showAlert: false, isDisabled: false
                });
                this.props.clearUsage();
                this.props.setVpnStatus(false);
                deleteTmAccount();
            }
        })
    }

    disconnect = () => {
        this.setState({ isDisabled: true })
        if (this.props.isTm) {
            this.sendSignature(downloadData, true, this.state.counter);
            this.disconnectTMVpn();
        }
        else {
            if (this.props.vpnType === 'openvpn') {
                disconnectVPN((res) => {
                    if (res) {
                        let regError = res.replace(/\s/g, "");
                        this.setState({
                            openSnack: true,
                            snackMessage: lang[this.props.language][regError] ?
                                lang[this.props.language][regError] : res,
                            isDisabled: false
                        });
                    }
                    else {
                        this.setState({
                            openSnack: true, snackMessage: lang[this.props.language].DisconnectVPN,
                            rateDialog: true, isDisabled: false, showAlert: false
                        });
                        this.props.clearUsage();
                        this.props.setVpnStatus(false);
                    }
                })
            } else {
                disconnectSocks(this.props.walletAddr, (res) => {
                    if (res) {
                        let regError = res.replace(/\s/g, "");
                        this.setState({
                            openSnack: true,
                            snackMessage: lang[this.props.language][regError] ?
                                lang[this.props.language][regError] : res,
                            isDisabled: false
                        });
                    }
                    else {
                        if (remote.process.platform === 'win32') {
                            exec('start iexplore "https://www.bing.com/search?q=my+ip&form=EDGHPT&qs=HS&cvid=f47c42614ae947668454bf39d279d717&cc=IN&setlang=en-GB"', function (stderr, stdout, error) {
                                console.log('browser opened');
                            });
                        }
                        this.setState({
                            openSnack: true, snackMessage: lang[this.props.language].DisconnectVPN,
                            rateDialog: true, isDisabled: false, showAlert: false
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
        downloadData = parseInt(currentUsage && 'down' in currentUsage ? currentUsage.down / (1024 * 1024) : downloadData);

        // Sending signature for every 10mb of usage
        if (vpnStatus && isTm && downloadData >= counter * 10) {
            this.sendSignature(counter === 0 ? 0 : downloadData, false, counter);
        }

        // Check vpn connection in ethereum net whether 900 mb used
        if (vpnStatus && !isTm) {
            this.checkGB(downloadData);
        }

        // Automatically disconnecting vpn in TM when full data is used
        if (vpnStatus && isTm && currentUsage && 'message' in currentUsage && downloadData !== 0) {
            if (currentUsage.message === 'Wrong details.' && !this.state.disconnectCalled) {
                notifier.notify({
                    title: 'Vpn Disconnected',
                    message: 'Used full quota',
                    sound: true,
                    wait: false
                });
                this.disconnectTMVpn();
            }
        }

        // Changing to default values after vpn disconnection
        if (!vpnStatus) {
            downloadData = 0;
            if (this.state.showAlert)
                this.setState({ showAlert: false });
            if (this.state.disconnectCalled)
                this.setState({ disconnectCalled: false });
        }

        return (
            <div style={footerStyles.mainDivStyle} className="footerStyle">
                <Grid>
                    <Row>

                        {
                            this.props.isTest ?
                                <Col xs={3} style={footerStyles.firstColumn}>
                                    <p style={footerStyles.testLabelStyle}>
                                        {
                                            isOnline() ?
                                                this.props.isTm ?
                                                    <span><span style={footerStyles.greenDot}></span><span style={footerStyles.name}>{lang[language].TMTestNet}</span><span style={footerStyles.activated}>{lang[language].Activated}</span> </span>
                                                    :
                                                    <span><span style={footerStyles.greenDot}></span><span style={footerStyles.name}>{lang[language].ETHTestNet}</span><span style={footerStyles.activated}>{lang[language].Activated}</span> </span>
                                                :

                                                <span><span style={footerStyles.redDot}></span>{lang[language].OfflineInFooter}</span>
                                        }
                                    </p>
                                </Col>

                                :

                                <Col xs={12} style={footerStyles.firstColumn}>
                                    <p style={footerStyles.testLabelStyle}>
                                        {
                                            isOnline() ?
                                                <span><span style={footerStyles.greenDot}></span><span style={footerStyles.name}>{lang[language].ETHMainNet}</span><span style={footerStyles.activated}>{lang[language].Activated}<span style={footerStyles.activateTestNet}>{lang[language].ActivateTestNet}</span></span></span>
                                                :
                                                <span><span style={footerStyles.redDot}></span>{lang[language].OfflineInFooter}</span>
                                        }
                                    </p>
                                </Col>
                        }

                        {
                            vpnStatus ?
                                <Col xs={9} style={footerStyles.vpnConnected}>
                                    <Row style={footerStyles.textCenter}>
                                        <Tooltip title={`${lang[language].IPAddress} : ${localStorage.getItem('IPGENERATED')} `}>
                                            <Col xs={2} style={footerStyles.vpnConnected} >
                                                {/* <label style={footerStyles.headingStyle}>{lang[language].IPAddress}</label> */}
                                                <span><img src={'../src/Images/IP.svg'} alt="location" width="16px" /></span>
                                                <p style={footerStyles.valueStyle}>
                                                    {localStorage.getItem('IPGENERATED')}
                                                </p>
                                            </Col>
                                        </Tooltip>

                                        <Tooltip title={`${lang[language].Speed} : ${localStorage.getItem('SPEED')} `}>

                                            <Col xs={2} style={footerStyles.vpnConnected}>
                                                {/* <label style={footerStyles.headingStyle}>{lang[language].Speed}</label> */}
                                                <span><img src={'../src/Images/Speed.svg'} alt="location" width="20px" /></span>
                                                <p style={footerStyles.valueStyle}>
                                                    {localStorage.getItem('SPEED')}
                                                </p>
                                            </Col>
                                        </Tooltip>
                                        <Tooltip title={`${lang[language].Location} : ${localStorage.getItem('LOCATION')} `}>
                                            <Col xs={2} style={footerStyles.vpnConnected}>
                                                {/* <label style={footerStyles.headingStyle}>{lang[language].Location}</label> */}

                                                <span><img src={'../src/Images/Location.svg'} alt="location" width="10px" /></span>

                                                <p className="location-style">{localStorage.getItem('LOCATION')} </p>

                                            </Col>
                                        </Tooltip>

                                        <Col xs={3} style={footerStyles.vpnConnected}>
                                            <Row>
                                                <Col xs={2}></Col>

                                                <Tooltip title={`${lang[language].Upload} : ${currentUsage ? (parseInt('up' in currentUsage ? currentUsage.up : 0) / (1024 * 1024)).toFixed(2) : 0.00} ${lang[language].MB} `}>
                                                    <Col xs={5} style={{ padding: 0, }}>
                                                        {/* <label style={footerStyles.headingStyle}>{lang[language].Upload}</label> */}
                                                        <span><img src={'../src/Images/Upload.svg'} alt="location" width="17px" /></span>

                                                        <p style={footerStyles.valueStyle}>
                                                            {currentUsage ? (parseInt('up' in currentUsage ? currentUsage.up : 0) / (1024 * 1024)).toFixed(2) : 0.00} {lang[language].MB}
                                                        </p>
                                                    </Col>
                                                </Tooltip>

                                                <Tooltip title={`${lang[language].Download} : ${currentUsage ? (parseInt('down' in currentUsage ? currentUsage.down : 0) / (1024 * 1024)).toFixed(2) : 0.00} ${lang[language].MB} `}>

                                                    <Col xs={5} style={{ padding: 0, }}>
                                                        {/* <label style={footerStyles.headingStyle}>{lang[language].Download}</label> */}
                                                        <span><img src={'../src/Images/Download.svg'} alt="location" width="17px" /></span>
                                                        <p style={footerStyles.valueStyle}>
                                                            {currentUsage ? (parseInt('down' in currentUsage ? currentUsage.down : 0) / (1024 * 1024)).toFixed(2) : 0.00} {lang[language].MB}
                                                        </p>
                                                    </Col>
                                                </Tooltip>
                                            </Row>
                                        </Col>

                                        {
                                            vpnStatus ?
                                                <Col xs={3} style={footerStyles.vpnConnected}>
                                                    <Tooltip title={lang[language].Disconnect}>
                                                        <Button
                                                            className='disconnectStyle'
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
        clearUsage,
        setCurrentTab
    }, dispatch)
}

export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToActions))(Footer);