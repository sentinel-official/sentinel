import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { setTMAccount } from '../Actions/tendermint.action';
import { setCurrentTab } from '../Actions/sidebar.action';
import { createTMAccount, recoverTMAccount } from '../Actions/createTM.action';
import { setTMConfig } from '../Utils/UserConfig';
import CustomTextField from './customTextfield';
import { accountStyles } from '../Assets/tmaccount.styles';
import { Button, Snackbar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import IconButton from "@material-ui/core/IconButton";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { createAccountStyle } from '../Assets/createtm.styles';
import '../Assets/createtm.css';
import lang from '../Constants/language';


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

class TMRecoverWallet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            seedWords: '',
            showPassword: false,
            openSnack: false,
            snackMessage: '',
        }
    }

    componentWillMount = () => {
        localStorage.setItem('tmAccount', null);
    }

    createAccount = () => {
        this.props.createTMAccount(this.state.username, this.state.password, this.state.seedWords).then(res => {
            if (res.error) {
                console.log("Error..",res.error.data);
                let regError = (res.error.data).replace(/\s/g, "");
                this.setState({
                    openSnack: true,
                    snackMessage: lang[this.props.language][regError] ?
                        lang[this.props.language][regError] : res.error.data
                })
            }
            else {
                setTMConfig(this.state.username);
                let data = {
                    name: res.payload.name,
                    type: res.payload.type,
                    address: res.payload.address,
                    pub_key: res.payload.pub_key
                }
                this.props.setTMAccount(data);
                this.props.setCurrentTab('tmint');
            }
        });
    }

    handleShow = () => {
        this.setState({ showPassword: !this.state.showPassword })
    }

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };


    render() {
        let { classes, language } = this.props;
        let isDisabled = (!this.state.username|| !this.state.password || !this.state.seedWords) ? true : false
        return (
            <div style={accountStyles.sendFormStyle}>
                <div style={createAccountStyle.secondDivStyle}
                    onKeyPress={(ev) => { if (ev.key === 'Enter') this.sendTransaction() }}>

                    <h1 className="loginHeading">{lang[language].RecoverTMWalletHeading}</h1>
                    <p style={createAccountStyle.headingStyle}>{lang[language].NewAccountName}</p>
                    <CustomTextField type={'text'} placeholder={''} disabled={false}
                     multi={false}
                        value={this.state.username} onChange={(e) => { this.setState({ username: e.target.value }) }}
                    />
                    <p style={createAccountStyle.headingStyle}>{lang[language].NewAccountPwd}</p>
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
                    <p style={createAccountStyle.headingStyle}>{lang[language].EnterYourTMSeed}</p>
                    <CustomTextField
                        type={'text'}
                        placeholder={''} disabled={false}
                        multi={true}
                        value={this.state.seedWords} onChange={(e) => { this.setState({ seedWords: e.target.value }) }}
                    />

                    <Button
                        variant="outlined"
                        disabled={isDisabled}
                        onClick={() => { this.createAccount() }}
                        // className={classes.button} 
                        className={!isDisabled ? classes.enableButton : classes.disableButton}
                        style={createAccountStyle.buttonStyle}>
                        {lang[language].RecoverTMWallet}
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

TMRecoverWallet.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
    return {
        language: state.setLanguage,
        isTest: state.setTestNet
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        createTMAccount,
        setTMAccount,
        setCurrentTab
    }, dispatch)
}

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(TMRecoverWallet);