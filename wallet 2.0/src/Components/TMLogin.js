import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { sendAmount, getTMBalance, addTransaction } from '../Actions/tendermint.action';
import { payVPNSession, getSessionInfo } from './../Actions/tmvpn.action';
import { payVPNTM, setVpnStatus, setActiveVpn } from '../Actions/vpnlist.action';
import { connectVPN, checkVPNDependencies } from './../Actions/connectOVPN';
import CustomTextField from './customTextfield';
import { Button, Snackbar } from '@material-ui/core';
import { createAccountStyle } from '../Assets/createtm.styles';
import { accountStyles } from '../Assets/tmaccount.styles';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import OpenvpnAlert from './OpenvpnAlert';
import { setCurrentTab } from '../Actions/sidebar.action';
import lang from '../Constants/language';
import SimpleMenuTM from './SharedComponents/SimpleMenuTM';
import '../Assets/createtm.css';
import IconButton from "@material-ui/core/IconButton";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


const electron = window.require('electron');
const remote = electron.remote;


const Customstyles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    enableButton: {
        "&:hover": {
            backgroundColor: '#2f3245'
        },
        backgroundColor: '#2f3245',
        // height: '45px',
    },
    disableButton: {
        backgroundColor: '#BDBDBD',
        // height: '45px',
        cursor: 'not-allowed',
    }
});

class TMLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            showPassword: false,

        }
    }

    handleShow = () => {
        this.setState({ showPassword: !this.state.showPassword })
    }


    render() {
        let { classes, language } = this.props;
        let isDisabled = (this.state.sending || this.state.username === '' ||
            this.state.password === '') ? true : false
        return (
            <div style={accountStyles.sendFormStyle}>
                <div style={createAccountStyle.secondDivStyle}
                    onKeyPress={(ev) => { if (ev.key === 'Enter') this.sendTransaction() }}>

                    <h1 className="loginHeading">{lang[language].LoginToTM}</h1>
                    <p style={createAccountStyle.headingStyle}>{lang[language].AccountName}</p>
                    <CustomTextField type={'text'} placeholder={''} disabled={false}
                    multi={false}
                        value={this.state.username} onChange={(e) => { this.setState({ username: e.target.value }) }}
                    />
                    <p style={createAccountStyle.headingStyle}>{lang[language].AccountPwd}</p>
                    <CustomTextField
                        type={this.state.showPassword ? 'text' : 'password'}
                        placeholder={''} disabled={false}
                        multi={false}
                        value={this.state.password} onChange={(e) => { this.setState({ password: e.target.value }) }}
                    />
                    <IconButton
                        aria-label="Toggle password visibility"
                        className="showPassword"
                        onClick={() => this.handleShow()}
                    >
                        {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                    <Button
                        variant="outlined"
                        disabled={isDisabled}
                        onClick={() => { this.sendTransaction() }}
                        // className={classes.button} 
                        className={!isDisabled ? classes.enableButton : classes.disableButton}
                        style={createAccountStyle.buttonStyle}>
                        {this.state.sending ? lang[language].Sending : lang[language].Login}
                    </Button>
                   <div>
                       Recover Account
                   </div>
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

TMLogin.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
    return {
        language: state.setLanguage,
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
        setActiveVpn,
        setCurrentTab
    }, dispatch)
}

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(TMLogin);