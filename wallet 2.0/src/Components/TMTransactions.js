import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { sendAmount, getTMBalance } from '../Actions/tendermint.action';
import { payVPNSession, getSessionInfo } from './../Actions/tmvpn.action';
import { payVPNTM, setVpnStatus, setActiveVpn } from '../Actions/vpnlist.action';
import { connectVPN } from './../Actions/connectOVPN';
import CustomTextField from './customTextfield';
import { Button, Snackbar } from '@material-ui/core';
import { createAccountStyle } from '../Assets/createtm.styles';
import { accountStyles } from '../Assets/tmaccount.styles';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';

const electron = window.require('electron');
const remote = electron.remote;


const Customstyles = theme => ({
    button: {
        margin: theme.spacing.unit,
    }
});

class TMTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toAddress: '',
            keyPassword: '',
            amount: '',
            openSnack: false,
            snackMessage: '',
            isTextDisabled: false,
            sending: false
        }
    }

    componentWillMount = () => {
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.vpnPayment.isPayment) {
            this.setState({ toAddress: nextProps.vpnPayment.data.vpn_addr, amount: 100, isTextDisabled: true })
        }
        else {
            this.setState({ isTextDisabled: false })
        }
    }

    sendTransaction = () => {
        this.setState({ sending: true })
        if (this.props.vpnPayment.isPayment) {
            let data = {
                "amount": (parseInt(this.state.amount) * (10 ** 8)).toString() + 'sut',
                "name": this.props.account.name,
                "password": this.state.keyPassword,
                "gas": 200000,
                "vaddress": this.state.toAddress,
                "sig_name": Math.random().toString(36).substring(4),
                "sig_password": Math.random().toString(36).substring(2)
            }
            this.props.payVPNSession(data).then(response => {
                console.log("Pay VPN...", response);
                if (response.error) {
                    console.log("VPN Error...", response);
                    this.setState({ sending: false, openSnack: true, snackMessage: 'Transaction Failed' });
                }
                else {
                    localStorage.setItem('SIGNAME', data.sig_name)
                    localStorage.setItem('SIGPWD', data.sig_password)
                    // this.props.getSessionInfo('783B5A64D3CA4C02EAB2DF433B940C8C7349A8A4').then(sesRes => {
                    this.props.getSessionInfo(response.payload.hash).then(sesRes => {
                        console.log("Ses..=", sesRes);
                        if (sesRes.error) {
                            console.log("Ses..Error", sesRes.error);
                            this.setState({ sending: false, openSnack: true, snackMessage: 'Something went wrong' });
                        }
                        else {
                            let data = sesRes.payload;
                            let vpn_data = this.props.vpnPayment.data;
                            let session_data = sesRes.payload
                            connectVPN(this.props.account.address, vpn_data, remote.process.platform, session_data, (err, platformErr, res) => {
                                console.log("Response...", err, platformErr, res);
                                if (err) {
                                    this.setState({ sending: false, openSnack: true, snackMessage: err.message });
                                }
                                else {
                                    this.props.setActiveVpn(vpn_data);
                                    this.props.setVpnStatus(true);
                                    this.setState({ sending: false, toAddress: '', keyPassword: '', amount: '', openSnack: true, snackMessage: 'Connected VPN' });
                                }
                            })
                        }
                    })
                }
            })
        }
        else {
            let data = {
                "amount": (parseInt(this.state.amount) * (10 ** 8)).toString() + 'sut',
                "name": this.props.account.name,
                "password": this.state.keyPassword,
                "gas": 200000,
                "to": this.state.toAddress
            }
            this.props.sendAmount(data, this.state.toAddress).then(response => {
                if (response.error) {
                    this.setState({ sending: false, openSnack: true, snackMessage: 'Transaction Failed' });
                }
                else {
                    this.setState({ sending: false, openSnack: true, snackMessage: 'Transaction done successfully' });
                }
            });
        }
    }

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };

    render() {
        const { classes } = this.props;
        return (
            <div style={accountStyles.formStyle}>
                <div style={createAccountStyle.secondDivStyle}>
                    <p style={createAccountStyle.headingStyle}>To Address</p>
                    <CustomTextField type={'text'} placeholder={''} disabled={this.state.isTextDisabled}
                        value={this.state.toAddress} onChange={(e) => { this.setState({ toAddress: e.target.value }) }}
                    />
                    <p style={createAccountStyle.headingStyle}>Amount</p>
                    <CustomTextField type={'number'} placeholder={''} disabled={this.state.isTextDisabled}
                        value={this.state.amount} onChange={(e) => { this.setState({ amount: e.target.value }) }}
                    />
                    <p style={createAccountStyle.headingStyle}>Account Password</p>
                    <CustomTextField type={'password'} placeholder={''} disabled={false}
                        value={this.state.keyPassword} onChange={(e) => { this.setState({ keyPassword: e.target.value }) }}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        disabled={this.state.sending}
                        onClick={() => { this.sendTransaction() }}
                        className={classes.button} style={createAccountStyle.buttonStyle}>
                        {this.state.sending ? 'Sending' : 'Send'}
                    </Button>
                </div>
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

TMTransactions.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        isTest: state.setTestNet,
        account: state.setTMAccount,
        vpnPayment: state.payVPNTM
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        sendAmount,
        getTMBalance,
        payVPNTM,
        payVPNSession,
        getSessionInfo,
        setVpnStatus,
        setActiveVpn
    }, dispatch)
}

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(TMTransactions);