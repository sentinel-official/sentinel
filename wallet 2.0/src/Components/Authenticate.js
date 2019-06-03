import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { sendError, setComponent, getPrivateKey } from '../Actions/authentication.action';
import { setTestNet, setWalletType, setTendermint, setEthLogged } from '../Actions/header.action';
import { setCurrentTab } from './../Actions/sidebar.action';
import { authenticateStyles } from './../Assets/authenticate.styles'
import { disabledItemsMain } from '../Constants/constants';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import { Snackbar } from '@material-ui/core';
import { TextField } from 'material-ui';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './../Assets/authenticateStyle.css'
let lang = require('./../Constants/language');

class Authenticate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            showPopUp: true,
            openSnack: false,
            snackMessage: '',
            statusSnack: false,
            statusMessage: '',
            isDisabled: false
        }
    }

    closeWindow = () => {
        window.close()
    }

    componentDidCatch(error, info) {
        sendError(error);
    }

    goBack = () => {
        this.props.setComponent('home');
    }

    submitPassword = () => {
        this.setState({
            isDisabled: true,
            statusSnack: true,
            statusMessage:
                lang[this.props.language].CheckCre
        })
        let self = this;
        setTimeout(function () {
            getPrivateKey(self.state.password, self.props.language, function (err, privateKey) {
                // sendError(err);
                if (err) {
                    self.setState({
                        isDisabled: false,
                        password: '',
                        statusSnack: false,
                        openSnack: true,
                        snackMessage: err.message
                    })
                }
                else {
                    self.setState({ statusSnack: false, password: '' });
                    self.props.setComponent('dashboard');
                    self.props.setEthLogged(true);
                }
            })
        }, 500);
    }

    snackRequestClose = () => {
        this.setState({
            openSnack: false,
        });
    };

    render() {
        let language = this.props.language;
        return (
            <MuiThemeProvider>
                <div style={authenticateStyles.backgroundStyle}>
                    <img src={'../src/Images/Sent-logo.png'} alt="sentinel_logo" style={{ opacity: 0.2 }} />
                    <Dialog
                        open={this.state.showPopUp}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        modal={true}
                        className='dialogueStyle'
                    >
                        <div style={authenticateStyles.w_600} className="keystore">
                            <DialogTitle style={authenticateStyles.f_s_16} id="alert-dialog-title">{lang[language].KeystoreLogin}</DialogTitle>
                            <DialogContent style={authenticateStyles.w_600} className="dialogContentStyle">
                                <DialogContentText id="alert-dialog-description">
                                    <TextField
                                        autoFocus={true}
                                        hintText={lang[language].KeyPass}
                                        hintStyle={authenticateStyles.f_s_14}
                                        type="password"
                                        onChange={(event, password) => { this.setState({ password: password }) }}
                                        onKeyPress={(ev) => { if (ev.key === 'Enter' && this.state.password !== '') this.submitPassword() }}
                                        value={this.state.password}
                                        style={authenticateStyles.textFieldCreate}
                                    />
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions style={authenticateStyles.buttonsGroup}>
                                {this.props.vpnStatus ?
                                    <Button
                                        onClick={this.closeWindow}
                                        style={authenticateStyles.closeButton}
                                        variant="contained"
                                    >
                                        {lang[language].Close}
                                    </Button>
                                    :
                                    <Button
                                        onClick={this.goBack}
                                        style={authenticateStyles.closeButton}
                                        variant="contained"
                                    >
                                        {lang[language].Back}
                                    </Button>
                                }
                                <Button
                                    onClick={this.submitPassword}
                                    disabled={this.state.isDisabled || this.state.password === ''}
                                    style={authenticateStyles.submitButton}
                                    variant="contained"
                                >
                                    {lang[language].Submit}

                                </Button>
                            </DialogActions>
                        </div>
                    </Dialog>
                    <Snackbar
                        open={this.state.openSnack}
                        message={this.state.snackMessage}
                        autoHideDuration={2000}
                        onClose={this.snackRequestClose}
                        style={authenticateStyles.snackBarStyle}
                    />
                    <Snackbar
                        open={this.state.statusSnack}
                        message={this.state.statusMessage}
                        style={authenticateStyles.snackBarStyle}
                    />
                </div>
            </MuiThemeProvider>
        )
    }
}

function mapStateToProps(state) {
    return {
        language: state.setLanguage,
        vpnStatus: state.setVpnStatus,
        currentTab: state.setCurrentTab,
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setComponent: setComponent,
        setTestNet,
        setTendermint,
        setWalletType,
        setCurrentTab,
        setEthLogged
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToActions)(Authenticate);