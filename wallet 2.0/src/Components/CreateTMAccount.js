import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { setTMAccount, setTMAccountslist, getKeys } from '../Actions/tendermint.action';
import { createTMAccount } from '../Actions/createTM.action';
import { setTMConfig } from '../Utils/UserConfig';
import CustomTextField from './customTextfield';
import { Button, Snackbar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import IconButton from "@material-ui/core/IconButton";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { createAccountStyle } from '../Assets/createtm.styles';
import '../Assets/createtm.css';


let lang = require('./../Constants/language');

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
class CreateTMAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyName: '',
            keyPassword: '',
            openSnack: false,
            snackMessage: '',
            showPassword: false
        }
    }

    componentWillMount = () => {
        localStorage.setItem('tmAccount', null);
    }

    createAccount = () => {
        this.props.createTMAccount(this.state.keyName, this.state.keyPassword, null).then(res => {
            if (res.error) {
                let regError = (res.error.data).replace(/\s/g, "");
                this.setState({
                    openSnack: true,
                    snackMessage: lang[this.props.lang][regError] ?
                        lang[this.props.lang][regError] : res.error.data
                })
            }
            else {
                setTMConfig(this.state.keyName, true);
                let tmAccounts = this.props.accountsList;
                tmAccounts.push(this.state.keyName);
                this.props.setTMAccountslist(tmAccounts);
                let data = {
                    name: res.payload.name,
                    type: res.payload.type,
                    address: res.payload.address,
                    pub_key: res.payload.pub_key
                };
                this.props.getKeys();
                this.props.setTMAccount(data);
                if (this.props.isPopup) {
                    this.props.accountCreated(true);
                }
            }
        });
    }

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };
    handleShow = () => {
        this.setState({ showPassword: !this.state.showPassword })
    }

    render() {
        const { classes, isPopup } = this.props;
        let language = this.props.lang;
        let isDisabled = (this.state.keyName === '' || this.state.keyPassword === '') ? true : false
        return (
            <div style={isPopup ? {} : createAccountStyle.formStyle}>
                <div> <h2 style={createAccountStyle.createStyle}><center>  {lang[language].CreateWalletSST}</center></h2></div>
                <div style={isPopup ? {} : createAccountStyle.secondDivStyle}>
                    <p style={createAccountStyle.headingStyle}>{lang[language].AccountName}</p>
                    <CustomTextField type={'text'} placeholder={''} disabled={false}
                        multi={false}
                        value={this.state.keyName}
                        onChange={(e) => { this.setState({ keyName: e.target.value }) }}
                    />
                    <p style={createAccountStyle.headingStyle}>{lang[language].AccountPwd}</p>
                    <CustomTextField type={this.state.showPassword ? 'text' : 'password'} placeholder={''} disabled={false} value={this.state.keyPassword}
                        multi={false}
                        onChange={(e) => { this.setState({ keyPassword: e.target.value }) }}
                    />

                    <IconButton
                        aria-label="Toggle password visibility"
                        className="showPassword"
                        onMouseDown={() => this.handleShow()}
                    >
                        {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>

                    <Button
                        variant="outlined"
                        color="primary"
                        disabled={isDisabled}
                        onClick={() => { this.createAccount() }}
                        className={!isDisabled ? classes.enableButton : classes.disableButton}
                        style={createAccountStyle.buttonStyle}>

                        {lang[language].CreateAccount}
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

CreateTMAccount.propTypes = {
    classes: PropTypes.object.isRequired,
    accountCreated: PropTypes.func
};


function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        isTest: state.setTestNet,
        accountsList: state.getTMAccountsList
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        createTMAccount,
        setTMAccount,
        setTMAccountslist,
        getKeys
    }, dispatch)
}

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(CreateTMAccount);