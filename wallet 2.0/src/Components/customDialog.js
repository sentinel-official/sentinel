import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DialogContent, DialogContentText, DialogActions, Snackbar } from '@material-ui/core';
import OpenvpnAlert from './OpenvpnAlert';
import { Row, Col } from 'react-flexbox-grid';
import {
    withStyles, Button, List, ListItem, ListItemText,
    DialogTitle, Dialog,
} from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import CheckIcon from '@material-ui/icons/Check';
import ConnectIcon from '@material-ui/icons/SwapVerticalCircle';
import blue from '@material-ui/core/colors/blue';
import { connectVPN } from '../Actions/connectOVPN'
import { connectSocks } from '../Actions/connectSOCKS';
import { setVpnStatus, payVPNTM, setActiveVpn } from '../Actions/vpnlist.action';
import { setCurrentTab } from '../Actions/sidebar.action';
import { initPaymentAction } from '../Actions/initPayment';
import { getVPNUsageData } from "../Utils/utils";
import lang from '../Constants/language';
import { calculateUsage, socksVpnUsage } from '../Actions/calculateUsage';

const electron = window.require('electron');
const remote = electron.remote;
let UsageInterval = null;
let type = '';
let session = null;
const styles = theme => ({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    container: {
        width: 400,
        padding: '25px 35px',
        overflowX: 'hidden',

    },
    container2: {
        width: 400,
        padding: '0px 35px 25px 35px',
        overflowX: 'hidden',

    },
    dialogLabel: {
        fontSize: 14,
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        textAlign: 'right',

    },
    dialogValue: {
        fontSize: 13,
        fontFamily: 'Montserrat',
    },
    fabProgress: {
        margin: theme.spacing.unit * 2,
        height: '1em',
        width: '1em'
    },
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    listRoot: {
        display: 'flex',
        backgroundColor: theme.palette.background.paper,
        justifyContent: 'center',
    },
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative',
    },
    button: {
        margin: theme.spacing.unit,
        outline: 'none',
        marginBottom: 0
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },

});

// function Transition (props) {
//     return <Slide direction="up" {...props} />;
// }

class SimpleDialog extends React.Component {

    state = {
        pendingInitPayment: null,
    };

    handleClose = () => {
        this.props.onClose();

    };

    render() {
        const { classes, language, ...other } = this.props;

        return (
            <Dialog onClose={this.handleClose}
                aria-labelledby="simple-dialog-title"
                {...other} className={{ classes: { paper: classes.container } }}
            >
                <DialogTitle className={classes.container} id="simple-dialog-title">Connect to dVPN</DialogTitle>
                <div className={classes.container2} >


                    <Row>

                        {/* <label style={styles.dialogLabel}>{`${lang[language].City} :`}&nbsp;</label>
                         <span style={styles.dialogValue}>{this.props.data.city}</span> */}

                        <Col xs={5}>  <label style={styles.dialogLabel}>{lang[language].City}</label> </Col>
                        <Col xs={1}>   <label style={styles.dialogLabel}>:</label> </Col>
                        <Col xs={6}>  <label
                            // style={styles.dialogValue}
                            style={{ fontWeight: 'bold' }}
                        >{this.props.data.city}</label> </Col>

                    </Row>
                    <Row>

                        {/* <label style={styles.dialogLabel}>{`${lang[language].City} :`}&nbsp;</label>
                  <xs style={styles.dialogValue}>{this.props.data.city}</xs> */}

                        <Col xs={5}>  <label style={styles.dialogLabel}>{lang[language].Country}</label> </Col>
                        <Col xs={1}>   <label style={styles.dialogLabel}>:</label> </Col>
                        <Col xs={6}>  <label style={{ fontWeight: 'bold' }}>{this.props.data.country}</label> </Col>

                    </Row>

                    <Row>
                        <Col xs={5}>  <label style={styles.dialogLabel}>{lang[language].Bandwidth}</label> </Col>
                        <Col xs={1}>   <label style={styles.dialogLabel}>:</label> </Col>
                        <Col xs={6}>  <label style={{ fontWeight: 'bold' }}>{(this.props.data.speed / (1024 * 1024)).toFixed(2) + ' Mbps'}</label> </Col>
                    </Row>

                    <Row>
                        <Col xs={5}>  <label style={styles.dialogLabel}>{lang[language].Cost}</label> </Col>
                        <Col xs={1}>   <label style={styles.dialogLabel}>:</label> </Col>
                        <Col xs={6}>  <label style={{ fontWeight: 'bold' }}>{this.props.data.price_per_GB + ' SENT/GB'}</label> </Col>
                    </Row>
                    <Row>
                        <Col xs={5}>  <label style={styles.dialogLabel}>{lang[language].Latency}</label> </Col>
                        <Col xs={1}>   <label style={styles.dialogLabel}>:</label> </Col>
                        <Col xs={6}>  <label style={{ fontWeight: 'bold' }}>{this.props.data.latency ? this.props.data.latency + ' ms' : 'None'}</label> </Col>
                    </Row>


                    <List style={{ paddingBottom: 5 }}>


                        <div className={classes.listRoot}>
                            <Button disabled={this.props.isLoading || this.props.vpnStatus} variant="contained" aria-label={this.props.isLoading || this.props.vpnStatus ? "Connecting..." : "Connect"}
                                onClick={() => this.props.onClicked(this.props.data.vpn_addr)}
                                className={classes.button}>
                                {!this.props.isLoading && this.props.success ? <CheckIcon
                                    className={classes.extendedIcon} /> : <ConnectIcon className={classes.extendedIcon} />}
                                {this.props.isLoading ? 'Connecting' : (this.props.success ? 'Connected' : lang[language].Connect)}
                            </Button>
                        </div>
                    </List>
                    {/*: ''*/}
                    {/*}*/}
                </div>
            </Dialog>
        );
    }
}

SimpleDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};

const SimpleDialogWrapped = withStyles(styles)(SimpleDialog);


class AlertDialog extends React.Component {

    componentWillReceiveProps(nextProps) {
        this.setState({ open: nextProps.open, op: nextProps.op });
    }

    state = {
        open: false,
        op: false
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false, isLoading: false, op: false });
    };

    makeInitPayment = () => {
        let data = {
            account_addr: this.props.paymentAddr,
            amount: 100,
            id: -1
        };
        this.props.initPaymentAction(data);
        this.props.setCurrentTab('send')
    };

    render() {
        return (
            <Dialog
                // open={this.state.open}
                // keepMounted
                open={this.props.open}
                onClose={this.props.onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Initial Payment Alert"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`${this.props.message} Please click on pay button to make the initial payment`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                        </Button>
                    <Button onClick={this.makeInitPayment} color="primary" autoFocus>
                        Pay
                        </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

// export default AlertDialog;


class SimpleDialogDemo extends React.Component {

    componentWillReceiveProps(nextProps) {
        this.setState({ open: nextProps.open })
    }

    state = {
        open: false,
        pendingInitPayment: null,
        isPending: false,
        paymentAddr: '',
        isLoading: false,
        session: false,
        snackOpen: false,
        snackMessage: '',
        openvpnAlert: false
    };

    handleClickOpen = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = () => {
        this.setState({ open: false });
        this.props.onUpdate(false);
    };
    handleAlertClose = () => {
        this.setState({ isPending: false })
    };

    handleDialogClose = () => {
        this.setState({ openvpnAlert: false });
    }

    handleListItemClick = (vpn_addr) => {
        if (this.props.isTm) {
            this.props.payVPNTM({ 'isPayment': true, 'data': this.props.data });
            this.props.setCurrentTab('send');
        }
        else {
            this.setState({ isLoading: true });
            if (this.props.vpnType === 'openvpn') {
                connectVPN(this.props.getAccount, vpn_addr, remote.process.platform, null, (err, platformErr, res) => {
                    console.log("VPn..res..", err, platformErr, res);
                    if (platformErr) {
                        this.setState({ open: false, isLoading: false, openvpnAlert: true })
                    }
                    else if (err) {
                        if ('account_addr' in err)
                            this.setState({
                                pendingInitPayment: err.message, open: false, isPending: true,
                                paymentAddr: err.account_addr, isLoading: false
                            })
                        else
                            this.setState({ open: false, isLoading: false, snackMessage: err.message, snackOpen: true })
                    } else if (res) {
                        this.setState({
                            isLoading: false, isPending: false, open: false,
                            snackMessage: res, snackOpen: true
                        });
                        this.props.setActiveVpn(this.props.data);
                        this.props.setVpnStatus(true)
                    } else {
                        this.setState({ open: false, isLoading: false })
                    }

                })
            } else {
                connectSocks(this.props.getAccount, vpn_addr, remote.process.platform, (err, res) => {
                    console.log("Socks..res..", err, res);
                    if (err) {
                        if ('account_addr' in err)
                            this.setState({
                                pendingInitPayment: err.message, open: false, isPending: true,
                                paymentAddr: err.account_addr, isLoading: false
                            })
                        else
                            this.setState({ open: false, isLoading: false, snackMessage: err.message, snackOpen: true })
                    } else if (res) {
                        console.log("Socks...", res);
                        this.setState({
                            isLoading: false, isPending: false, open: false,
                            snackMessage: 'Connected Socks', snackOpen: 'true'
                        });
                        this.props.setActiveVpn(this.props.data);
                        this.props.setVpnStatus(true);
                        calculateUsage(this.props.getAccount, true, (usage) => {
                            this.props.socksVpnUsage(usage);
                        });
                    } else {
                        this.setState({ open: false, isLoading: false })
                    }
                });
            }
        }
    };

    handleSnackClose = (event, reason) => {
        this.setState({ snackOpen: false });
    };

    execIT = () => {
        calculateUsage(this.props.getAccount, this.props.data.vpn_addr, false)
    };

    render() {
        // console.log("Status...", this.props.vpnStatus);
        // if (this.props.vpnStatus && !UsageInterval) {
        //     UsageInterval = setInterval(() => {
        //         if (this.state.session && type === 'SOCKS5') {
        //             calculateUsage(this.props.getAccount, this.props.data.vpn_addr, false)
        //         } else {
        //             this.props.getVPNUsageData(this.props.isTm ? this.props.account.address : this.props.getAccount);
        //         }
        //     }, 3000);
        // }

        // if (!this.props.vpnStatus) {
        //     if (UsageInterval) {
        //         clearInterval(UsageInterval);
        //         UsageInterval = null;
        //     }
        // }

        // if (!UsageInterval && this.props.status) {
        //     UsageInterval = setInterval(function () {
        //         session = localStorage.getItem('SESSION_NAME');
        //         type = localStorage.getItem('VPN_TYPE');
        //         if (this.state.isSock)
        //             that.calculateUsage(false);
        //         else
        //
        //     }, 5000);
        // }
        return (
            <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }} >
                {!this.state.isPending ?
                    <SimpleDialogWrapped
                        // selectedValue={this.state.selectedValue}
                        open={this.state.open}
                        data={this.props.data}
                        onClose={this.handleClose}
                        onClicked={this.handleListItemClick}
                        isLoading={this.state.isLoading}
                        success={this.props.vpnStatus}
                        execIT={this.execIT}
                        language={this.props.language}
                        vpnStatus={this.props.vpnStatus}
                    />
                    :
                    <AlertDialog
                        open={this.state.isPending}
                        // open={this.state.isPending}
                        onClose={this.handleAlertClose}
                        message={this.state.pendingInitPayment}
                        paymentAddr={this.state.paymentAddr}
                        initPaymentAction={this.props.initPaymentAction}
                        setCurrentTab={this.props.setCurrentTab}
                    />
                }
                <Snackbar
                    open={this.state.snackOpen}
                    autoHideDuration={4000}
                    onClose={this.handleSnackClose}
                    message={this.state.snackMessage}
                />
                <OpenvpnAlert
                    open={this.state.openvpnAlert}
                    onClose={this.handleDialogClose}
                />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {

    return bindActionCreators({
        setCurrentTab, initPaymentAction, getVPNUsageData,
        setVpnStatus, connectVPN, connectSocks, payVPNTM, setActiveVpn, socksVpnUsage
    }, dispatch)
}

function mapStateToProps({ connecVPNReducer, getAccount, vpnType, setLanguage, setVpnStatus, getCurrentVpn, setTendermint, setTMAccount }) {
    return {
        connecVPNReducer, getAccount, vpnType, data: getCurrentVpn, language: setLanguage,
        vpnStatus: setVpnStatus, isTm: setTendermint, account: setTMAccount
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SimpleDialogDemo);
