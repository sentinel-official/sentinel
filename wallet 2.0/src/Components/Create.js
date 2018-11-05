import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
     ToolbarGroup, TextField, RaisedButton,
    Chip, Paper, Snackbar, RefreshIndicator
} from 'material-ui';
import Toolbar from '@material-ui/core/Toolbar';
import { bindActionCreators } from 'redux';
import { createAccount, sendError, setComponent } from '../Actions/authentication.action';
import { isOnline } from './../Utils/UserConfig';
import { uploadKeystore } from './../Utils/Keystore';
import ReactTooltip from 'react-tooltip';
import { setTimeout } from 'timers';
import { createPagestyles } from './../Assets/authenticate.styles';
import { connect } from 'react-redux';
let keythereum = require('keythereum');
let lang = require('./../Constants/language');

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
            openSnack: false,
            snackMessage: '',
            isLoading: null,
            isRestoredisabled: true,
            snackOpen: false,
            openSnackMessage: ''
        }
    }

    componentDidCatch(error, info) {
        sendError(error);
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
        const { refresh } = createPagestyles;
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
                this.props.createAccount(password)
                    .then(() => {
                        that.props.setComponent('terms')
                    })
            }
            else {
                this.setState({
                    openSnack: true,
                    isLoading: false,
                    snackMessage: lang[this.props.lang].CheckInternet
                })
            }
        }
        else {
            this.setState({
                openSnack: true,
                isLoading: false,
                snackMessage: lang[this.props.lang].DidNotMatch
            })
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
        this.setState({
            isRestoredisabled: true,
            snackOpen: true,
            openSnackMessage: lang[this.props.lang].CheckCre
        })
        var keystore = this.state.keystore;
        var password = this.state.keystorePassword;
        var that = this;
        setTimeout(function () {
            that.getPrivateKey(keystore, password, function (err, private_key) {
                if (err) {
                    that.setState({
                        snackOpen: false,
                        openSnack: true,
                        snackMessage: err.message
                    })
                }
                else {
                    uploadKeystore(keystore, function (err,keystotefile) {
                        if (err) sendError(err);
                        else {
                            that.props.setComponent('dashboard');
                        }
                    })
                }
            })
        }, 500)
    }
    render() {
        let language = this.props.lang;
        return <MuiThemeProvider>
            <div>
                <Toolbar style={createPagestyles.toolbarStyle}>
                    <ToolbarGroup>
                        <img src={'../src/Images/logo.svg'} alt="Logo" style={createPagestyles.toolbarImage} />
                        <p style={createPagestyles.toolbarTitle}></p>
                    </ToolbarGroup>
                </Toolbar>
                {this.state.private_key === '' ?
                    <div style={createPagestyles.createDiv}>
                        <div style={createPagestyles.m_t_5}>
                            <span style={createPagestyles.headingCreate}>{lang[language].CreateAUID}</span>
                            <span data-tip data-for="createID" style={createPagestyles.questionMark}>?</span>
                            <ReactTooltip id="createID" place="bottom">
                                <span>
                                    {lang[language].CreateTooltip}
                                </span>
                            </ReactTooltip>
                        </div>
                        
                        {/* <hr width="50%" align="left" size="3" noshade style={createPagestyles.hr_color} /> */}
                        
                        <Paper 
                        // zDepth={2}
                         style={createPagestyles.textBoxPaper}>
                            <TextField
                                hintText={lang[language].PasswordAUID}
                                hintStyle={createPagestyles.textFieldCreateHint}
                                type="password"
                                underlineShow={false}
                                onChange={(event, password) => { this.setState({ password: password }) }}
                                style={createPagestyles.textFieldCreate}
                            />
                        </Paper>
                        <Paper 
                        // zDepth={2} 
                        style={createPagestyles.textBoxPaper}>
                            <TextField
                                hintText={lang[language].ConfirmPwd}
                                hintStyle={createPagestyles.textFieldCreateHint}
                                type="password"
                                underlineShow={false}
                                onChange={(event, password) => { this.setState({ confirmPwd: password }) }}
                                style={createPagestyles.textFieldCreate}
                            />
                        </Paper>
                        <RaisedButton label={lang[language].Create}
                            labelStyle={createPagestyles.buttonLabel}
                            disabled={this.state.password === '' ? true : false}
                            onClick={this._createAccount}
                            buttonStyle={this.state.password === '' ?createPagestyles.disabledButton : createPagestyles.buttonCreate}
                            style={createPagestyles.createStyle} />
                        {this.state.isLoading === true ? this.renderProgress() : ''}
                        <p style={createPagestyles.f_m_l_3}>(OR)</p>
                        <Paper 
                        // zDepth={2}
                         style={createPagestyles.bluePaper}>
                            <div style={createPagestyles.p_3}>
                                <RaisedButton
                                    label={lang[language].SelectKeystore}
                                    labelStyle={createPagestyles.buttonLabel}
                                    onClick={() => { document.getElementById('filepicker').click() }}
                                    buttonStyle={this.state.file === '' ? createPagestyles.buttonCreate : createPagestyles.buttonRaisedKeystore}
                                    disabled={this.state.file === '' ? false : true} />
                                {this.state.file === '' ?
                                    <div></div>
                                    :
                                    <Chip onRequestDelete={() => {
                                        this.setState({ file: '', keystore: '', keystorePassword: '' })
                                    }} style={createPagestyles.m_2} >
                                        {this.state.file}
                                    </Chip>
                                }
                                <Paper 
                                // zDepth={2}
                                style={createPagestyles.keyTextBoxPaper}>
                                    <TextField
                                        hintText={lang[language].KeyPass}
                                        hintStyle={createPagestyles.f_12}
                                        type="password"
                                        underlineShow={false}
                                        onChange={(event, password) => { this.setState({ keystorePassword: password, isRestoredisabled: false }) }}
                                        style={createPagestyles.textFieldCreate}
                                    />
                                </Paper>
                                <RaisedButton
                                    label={lang[language].RestoreKeystore}
                                    labelStyle={createPagestyles.c_t_t}
                                    disabled={this.state.file === '' || this.state.keystorePassword === '' ||
                                        this.state.isRestoredisabled ? true : false}
                                    onClick={this._store.bind(this)}
                                    buttonStyle={this.state.file === '' || this.state.keystorePassword === '' ||
                                        this.state.isRestoredisabled ?
                                        createPagestyles.buttonRaisedKeystore : createPagestyles.buttonCreate}
                                    style={{ marginTop: '3%' }} />
                                <input type="file" style={{ display: 'none' }} id="filepicker"
                                    onChange={this.onChange.bind(this)} />
                            </div>
                        </Paper>
                    </div>
                    :
                    this.props.setComponent('terms')
                }
                <Snackbar
                    open={this.state.openSnack}
                    message={this.state.snackMessage}
                    autoHideDuration={2000}
                    onRequestClose={this.snackRequestClose}
                    style={createPagestyles.m_b_1}
                />
                <Snackbar
                    open={this.state.snackOpen}
                    message={this.state.openSnackMessage}
                    style={createPagestyles.m_b_1}
                />
            </div>
        </MuiThemeProvider>
    }

}

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        createAccountResponse: state.createAccount
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        createAccount: createAccount,
        setComponent: setComponent
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(Create);