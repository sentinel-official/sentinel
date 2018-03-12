import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Dialog, FlatButton, TextField, Snackbar } from 'material-ui';
import { getPrivateKey } from '../Actions/TransferActions';

class Authenticate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            showPopUp: true,
            openSnack: false,
            snackMessage: '',
            buttonName: 'Submit',
            statusSnack: false,
            statusMessage: '',
            isDisabled: false
        }
        this.set = this.props.set;
    }

    closeWindow = () => {
        window.close()
    }

    submitPassword = () => {
        this.setState({ isDisabled: 'true', statusSnack: true, statusMessage: 'Checking credentials...' })
        let self = this;
        setTimeout(function () {
            getPrivateKey(self.state.password, function (err, privateKey) {
                if (err) {
                    self.setState({ isDisabled: false, password: '', statusSnack: false, openSnack: true, snackMessage: err.message })
                }
                else {
                    self.setState({ statusSnack: false, password: '' })
                    self.set('dashboard');
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
        const actions = [
            <FlatButton
                label="Close"
                primary={true}
                onClick={this.closeWindow}
                style={{ border: '1px solid #00bcd4', borderRadius: 5 }}
            />,
            <FlatButton
                label={this.state.buttonName}
                disabled={this.state.isDisabled}
                primary={true}
                onClick={this.submitPassword}
                style={{ border: '1px solid #00bcd4', borderRadius: 5, margin: '0px 20px 0px 10px' }}
            />
        ]
        return (
            <MuiThemeProvider>
                <div>
                    <Dialog
                        title="Enter Keystore Password to Login"
                        titleStyle={{ fontSize: 16 }}
                        actions={actions}
                        modal={true}
                        open={this.state.showPopUp}
                    >
                        <TextField
                            autoFocus={true}
                            hintText="Enter Keystore Password"
                            hintStyle={{ fontSize: 14 }}
                            type="password"
                            onChange={(event, password) => { this.setState({ password: password }) }}
                            onKeyPress={(ev) => { if (ev.key === 'Enter') this.submitPassword() }}
                            value={this.state.password}
                            style={styles.textFieldCreate}
                        />
                    </Dialog>
                    <Snackbar
                        open={this.state.openSnack}
                        message={this.state.snackMessage}
                        autoHideDuration={2000}
                        onRequestClose={this.snackRequestClose}
                        style={{ marginBottom: '2%' }}
                    />
                    <Snackbar
                        open={this.state.statusSnack}
                        message={this.state.statusMessage}
                        style={{ marginBottom: '2%' }}
                    />
                </div>
            </MuiThemeProvider>
        )
    }
}

const styles = {
    textFieldCreate: {
        width: '85%',
        paddingLeft: '5%',
        height: 40,
        lineHeight: '18px'
    },
}

export default Authenticate;