import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Dialog, FlatButton, TextField, Snackbar } from 'material-ui';
import { sendError, setComponent, getPrivateKey } from '../Actions/authentication.action';
import { authenticateStyles } from './../Assets/authenticate.styles'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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


    submitPassword = () => {
        this.setState({ 
            isDisabled: 'true', 
            statusSnack: true, 
            statusMessage: 
            lang[this.props.language].CheckCre 
        })
        let self = this;
        setTimeout(function () {
            getPrivateKey(self.state.password, self.props.language, function (err, privateKey) {
                sendError(err);
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
                    self.setState({ statusSnack: false, password: '' })
                    self.props.setComponent('dashboard');
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
        const actions = [
            <FlatButton
                label={lang[language].Close}
                primary={true}
                onClick={this.closeWindow}
                style={authenticateStyles.closeButton}
            />,
            <FlatButton
                label={lang[language].Submit}
                disabled={this.state.isDisabled}
                primary={true}
                onClick={this.submitPassword}
                style={authenticateStyles.submitButton}
            />
        ]
        return (
            <MuiThemeProvider>
                <div>
                    <Dialog
                        title={lang[language].KeystoreLogin}
                        titleStyle={authenticateStyles.f_s_16}
                        actions={actions}
                        modal={true}
                        open={this.state.showPopUp}
                    >
                        <TextField
                            autoFocus={true}
                            hintText={lang[language].KeyPass}
                            hintStyle={authenticateStyles.f_s_14}
                            type="password"
                            onChange={(event, password) => { this.setState({ password: password }) }}
                            onKeyPress={(ev) => { if (ev.key === 'Enter') this.submitPassword() }}
                            value={this.state.password}
                            style={authenticateStyles.textFieldCreate}
                        />
                    </Dialog>
                    <Snackbar
                        open={this.state.openSnack}
                        message={this.state.snackMessage}
                        autoHideDuration={2000}
                        onRequestClose={this.snackRequestClose}
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
        language: state.setLanguage
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setComponent: setComponent
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToActions)(Authenticate);