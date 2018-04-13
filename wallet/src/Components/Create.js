import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
    Toolbar, ToolbarGroup, TextField, RaisedButton,
    Chip, Checkbox, Paper, Snackbar, RefreshIndicator
} from 'material-ui';
import { createAccount, uploadKeystore, isOnline } from '../Actions/AccountActions';
import CopyToClipboard from 'react-copy-to-clipboard';
import ReactTooltip from 'react-tooltip';
import { setTimeout } from 'timers';
import { sendError } from '../helpers/ErrorLog';
let keythereum = require('keythereum');
let lang = require('./language');

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirmPwd: '',
            keystorePassword: '',
            keystore: '',
            file: '',
            openDialog: false,
            account_addr: '',
            private_key: '',
            keystore_addr: '',
            checked: false,
            openSnack: false,
            snackMessage: '',
            isLoading: null,
            isRestoredisabled: true,
            snackOpen: false,
            openSnackMessage: ''
        }
        this.set = this.props.set;
    }

    onChange = (event) => {
        var input = event.target;
        var reader = new FileReader();
        reader.onload = () => {
            var text = reader.result;
            this.setState({ keystore: text })
        };
        reader.readAsText(input.files[0]);
        this.setState({ file: input.files[0].name, isRestoredisabled: false });
        document.getElementById('filepicker').value = ""
    }

    renderProgress() {
        const { refresh } = styles;
        return (
            <RefreshIndicator
                size={50}
                left={30}
                top={15}
                loadingColor="#532d91"
                status="loading"
                style={refresh}
            />
        )
    }

    _createAccount = () => {
        this.setState({ isLoading: true })
        var password = this.state.password;
        var that = this;
        if (this.state.password === this.state.confirmPwd) {
            if (isOnline()) {
                createAccount(password, function (err, account) {
                    if (err) sendError(err);
                    else {
                        that.setState({
                            account_addr: account.account_addr,
                            private_key: account.private_key,
                            keystore_addr: account.keystore_addr,
                            isLoading: false
                        })
                    }
                });
            }
            else {
                this.setState({ openSnack: true, isLoading: false, snackMessage: lang[this.props.lang].CheckInternet })
            }
        }
        else {
            this.setState({ openSnack: true, isLoading: false, snackMessage: lang[this.props.lang].DidNotMatch })
        }
    }

    snackRequestClose = () => {
        this.setState({
            openSnack: false,
        });
    };

    getPrivateKey = (keystore, password, cb) => {
        keystore = JSON.parse(keystore)
        try {
            var privateKey = keythereum.recover(password, keystore);
            cb(null, privateKey);
        }
        catch (err) {
            sendError(err);
            cb({ message: lang[this.props.lang].KeyPassMatch }, null);
        }
    }

    _store = () => {
        this.setState({ isRestoredisabled: true, snackOpen: true, openSnackMessage: lang[this.props.lang].CheckCre })
        var keystore = this.state.keystore;
        var password = this.state.keystorePassword;
        var that = this;
        setTimeout(function () {
            that.getPrivateKey(keystore, password, function (err, private_key) {
                if (err) {
                    that.setState({ snackOpen: false, openSnack: true, snackMessage: err.message })
                }
                else {
                    uploadKeystore(keystore, function (err) {
                        if (err) sendError(err);
                        else {
                            that.set('dashboard');
                        }
                    })
                }
            })
        }, 500)
    }
    render() {
        let language = this.props.lang;
        return (
            <MuiThemeProvider>
                <div>
                    <Toolbar style={{ backgroundColor: '#2f3245', height: 70 }}>
                        <ToolbarGroup>
                            <img src={'../src/Images/logo.svg'} alt="Logo" style={{ height: 50, width: 50 }} />
                            <p style={styles.toolbarTitle}></p>
                        </ToolbarGroup>
                    </Toolbar>
                    {this.state.private_key === '' ?
                        <div style={styles.createDiv}>
                            <div style={{ marginTop: '2%' }}>
                                <span style={styles.headingCreate}>{lang[language].CreateAUID}</span>
                                <span data-tip data-for="createID" style={styles.questionMark}>?</span>
                                <ReactTooltip id="createID" place="bottom">
                                    <span>
                                        {lang[language].CreateTooltip}
                                    </span>
                                </ReactTooltip>
                            </div>
                            <hr width="50%" align="left" size="3" noshade style={{ backgroundColor: 'rgb(83, 45, 145)' }} />
                            <Paper zDepth={2} style={styles.textBoxPaper}>
                                <TextField
                                    hintText={lang[language].PasswordAUID}
                                    hintStyle={styles.textFieldCreateHint}
                                    type="password"
                                    underlineShow={false}
                                    onChange={(event, password) => { this.setState({ password: password }) }}
                                    style={styles.textFieldCreate}
                                />
                            </Paper>
                            <Paper zDepth={2} style={styles.textBoxPaper}>
                                <TextField
                                    hintText={lang[language].ConfirmPwd}
                                    hintStyle={styles.textFieldCreateHint}
                                    type="password"
                                    underlineShow={false}
                                    onChange={(event, password) => { this.setState({ confirmPwd: password }) }}
                                    style={styles.textFieldCreate}
                                />
                            </Paper>
                            <RaisedButton label={lang[language].Create}
                                labelStyle={styles.buttonLabel}
                                disabled={this.state.password === '' ? true : false}
                                onClick={this._createAccount}
                                buttonStyle={styles.buttonCreate}
                                style={styles.createStyle} />
                            {this.state.isLoading === true ? this.renderProgress() : ''}
                            <p style={{ fontSize: 12, marginLeft: '3%' }}>(Or)</p>
                            <Paper zDepth={2} style={styles.bluePaper}>
                                <div style={{ padding: '3%' }}>
                                    <RaisedButton
                                        label={lang[language].SelectKeystore}
                                        labelStyle={styles.buttonLabel}
                                        onClick={() => { document.getElementById('filepicker').click() }}
                                        buttonStyle={this.state.file === '' ? styles.buttonCreate : styles.buttonRaisedKeystore}
                                        disabled={this.state.file === '' ? false : true} />
                                    {this.state.file === '' ?
                                        <div></div>
                                        :
                                        <Chip onRequestDelete={() => {
                                            this.setState({ file: '', keystore: '', keystorePassword: '' })
                                        }} style={{ margin: '2%' }} >
                                            {this.state.file}
                                        </Chip>
                                    }
                                    <Paper zDepth={2} style={styles.keyTextBoxPaper}>
                                        <TextField
                                            hintText={lang[language].KeyPass}
                                            hintStyle={{ fontSize: 12 }}
                                            type="password"
                                            underlineShow={false}
                                            onChange={(event, password) => { this.setState({ keystorePassword: password, isRestoredisabled: false }) }}
                                            style={styles.textFieldCreate}
                                        />
                                    </Paper>
                                    <RaisedButton
                                        label={lang[language].RestoreKeystore}
                                        labelStyle={{ color: 'white', textTransform: 'none' }}
                                        disabled={this.state.file === '' || this.state.keystorePassword === '' ||
                                            this.state.isRestoredisabled ? true : false}
                                        onClick={this._store.bind(this)}
                                        buttonStyle={this.state.file === '' || this.state.keystorePassword === '' ||
                                            this.state.isRestoredisabled ?
                                            styles.buttonRaisedKeystore : styles.buttonCreate}
                                        style={{ marginTop: '3%' }} />
                                    <input type="file" style={{ display: 'none' }} id="filepicker"
                                        onChange={this.onChange.bind(this)} />
                                </div>
                            </Paper>
                        </div>
                        :
                        <div style={{ marginLeft: '5%', marginRight: '5%' }}>
                            <h3 style={styles.headingCreate}>{lang[language].BeCareful}</h3>
                            <hr width="50%" align="left" size="3" noshade style={{ backgroundColor: 'rgb(83, 45, 145)' }} />
                            <p style={styles.copyHeading}>{lang[language].CopyKeys}</p>
                            <div style={styles.detailsDiv}>
                                <p style={styles.detailHeadBold}>{lang[language].YourAddress}:</p>
                                <p style={styles.detailVal}>{this.state.account_addr}</p>
                                <p style={styles.detailHeadBold}>{lang[language].PrivateKey}:</p><p
                                    style={styles.detailVal}>{this.state.private_key}
                                    <CopyToClipboard text={this.state.private_key}
                                        onCopy={() => this.setState({
                                            snackMessage: lang[language].Copied,
                                            openSnack: true
                                        })}>
                                        <img src={'../src/Images/download.jpeg'}
                                            alt="Copy"
                                            data-tip data-for="copyImage"
                                            style={styles.clipBoard} />
                                    </CopyToClipboard></p>
                                <ReactTooltip id="copyImage" place="bottom">
                                    <span>{lang[language].Copy}</span>
                                </ReactTooltip>
                                <p style={styles.detailHeadBold}>{lang[language].KeyLocation}:</p>
                                <p style={styles.detailVal}>{this.state.keystore_addr}</p>
                            </div>
                            <br /><br />
                            <Checkbox
                                label={lang[language].YesUnderstand}
                                labelStyle={styles.checkboxLabel}
                                checked={this.state.checked}
                                onCheck={() => {
                                    this.setState((oldState) => {
                                        return {
                                            checked: !oldState.checked,
                                        };
                                    });
                                }}
                            />
                            <br /><br />
                            <RaisedButton
                                label={lang[language].GoToDash}
                                labelStyle={styles.yesButtonLabel}
                                buttonStyle={this.state.checked ? styles.yesButton : styles.disabledButton}
                                disabled={this.state.checked ? false : true}
                                onClick={() => { this.set('dashboard') }}
                            />
                        </div>
                    }
                    <Snackbar
                        open={this.state.openSnack}
                        message={this.state.snackMessage}
                        autoHideDuration={2000}
                        onRequestClose={this.snackRequestClose}
                        style={{ marginBottom: '2%' }}
                    />
                    <Snackbar
                        open={this.state.snackOpen}
                        message={this.state.openSnackMessage}
                        style={{ marginBottom: '2%' }}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}

const styles = {
    toolbarTitle: {
        color: 'white',
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '600'
    },
    yesButtonLabel: {
        textTransform: 'none',
        color: 'white',
        paddingRight: 25,
        paddingLeft: 25,
        fontWeight: '600'
    },
    yesButton: {
        backgroundColor: '#2f3245',
        height: '30px',
        lineHeight: '30px'
    },
    disabledButton: {
        backgroundColor: '#bdbdbd',
        height: '30px',
        lineHeight: '30px'
    },
    createDiv: {
        marginLeft: '7%',
        marginRight: '7%'
    },
    headingCreate: {
        color: '#2f3245',
        fontSize: 14,
        marginBottom: 0,
        marginTop: '2%'
    },
    textBoxPaper: {
        height: 35,
        width: '100%',
        backgroundColor: 'rgba(229, 229, 229, 0.66)',
        marginTop: '3%'
    },
    keyTextBoxPaper: {
        height: 35,
        width: '80%',
        marginTop: '3%'
    },
    textFieldCreateHint: {
        fontSize: 12,
        color: '#2f3245'
    },
    textFieldCreate: {
        width: '85%',
        paddingLeft: '5%',
        height: 40,
        lineHeight: '18px'
    },
    buttonLabel: {
        color: 'white',
        textTransform: 'none'
    },
    buttonRaisedKeystore: {
        backgroundColor: 'rgba(128, 128, 128, 0.66)',
        height: '30px',
        lineHeight: '30px',
        cursor: 'not-allowed'
    },
    buttonCreate: {
        backgroundColor: 'rgba(83, 45, 145, 0.71)',
        height: '30px',
        lineHeight: '30px'
    },
    createStyle: {
        marginTop: '5%',
        marginBottom: '3%'
    },
    bluePaper: {
        backgroundColor: 'rgba(181, 216, 232, 0.32)',
        marginTop: '2%'
    },
    copyHeading: {
        color: 'rgb(240, 94, 9)',
        fontSize: 12,
        fontWeight: 800
    },
    detailsDiv: {
        color: 'rgba(0, 0, 0, 0.66)',
        fontSize: 12,
        marginBottom: '2%',
        marginTop: '2%'
    },
    detailHeadBold: {
        marginTop: '2%',
        fontWeight: 'bold'
    },
    detailVal: {
        fontSize: '12px',
        wordBreak: 'break-all',
        marginTop: 0
    },
    clipBoard: {
        height: 20,
        width: 20,
        cursor: 'pointer',
        marginLeft: 2
    },
    checkboxLabel: {
        color: 'rgb(240, 94, 9)',
        fontSize: 13,
        fontWeight: 800
    },
    refresh: {
        display: 'inline-block',
        position: 'relative',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    questionMark: {
        marginLeft: 3,
        fontSize: 12,
        borderRadius: '50%',
        backgroundColor: '#4d9bb9',
        paddingLeft: 5,
        paddingRight: 5,
        color: 'white'
    }
}

export default Create;
