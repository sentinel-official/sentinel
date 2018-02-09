import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {
    Toolbar, ToolbarGroup, TextField, RaisedButton,
    Chip, Dialog, FlatButton, Checkbox, Paper, Snackbar, RefreshIndicator
} from 'material-ui';
import Dashboard from './Dashboard';
import { createAccount, uploadKeystore } from '../Actions/AccountActions';
import CopyToClipboard from 'react-copy-to-clipboard';
import Footer from './Footer';
import ReactTooltip from 'react-tooltip';

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            keystore: '',
            file: '',
            openDialog: false,
            account_addr: '',
            private_key: '',
            keystore_addr: '',
            checked: false,
            openSnack: false,
            snackMessage: '',
            isLoading: null
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
        this.setState({ file: input.files[0].name })
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
        createAccount(password, function (err, account) {
            if (err) console.log(err, "Error");
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

    snackRequestClose = () => {
        this.setState({
            openSnack: false,
        });
    };

    _store = () => {
        var keystore = this.state.keystore;
        var that = this;
        uploadKeystore(keystore, function (err) {
            if (err) console.log(err);
            else {
                that.set('dashboard');
            }
        })
    }
    render() {
        const actions = [
            <RaisedButton
                label="Go to Dashboard"
                primary={true}
                disabled={!this.state.checked}
                onClick={() => { this.set('dashboard') }}
                labelStyle={{ textTransform: 'capitalize' }}

            />,
        ];
        return (
            <MuiThemeProvider>
                <div>
                    <Toolbar style={{ backgroundColor: 'rgb(83, 45, 145)' }}>
                        <ToolbarGroup>
                            <img src={'../src/Images/5.png'} style={{ height: 56, width: 56 }} />
                            <p style={styles.toolbarTitle}>SENTINEL-ANON PLATFORM</p>
                        </ToolbarGroup>
                    </Toolbar>
                    {this.state.private_key == '' ?
                        <div style={styles.createDiv}>
                            <h3 style={styles.headingCreate} data-tip data-for="createID">Create your Anonymous User ID</h3>
                            <ReactTooltip id="createID" place="bottom">
                                <span>
                                    Enter a password and create your own Sentinel Anonymous User ID (AUID)
                                </span>
                            </ReactTooltip>
                            <hr width="50%" align="left" size="3" noshade style={{ backgroundColor: 'rgb(83, 45, 145)' }} />
                            <Paper zDepth={2} style={styles.textBoxPaper}>
                                <TextField
                                    hintText="Enter Password to create AUID"
                                    hintStyle={styles.textFieldCreateHint}
                                    type="password"
                                    underlineShow={false}
                                    onChange={(event, password) => { this.setState({ password: password }) }}
                                    style={styles.textFieldCreate}
                                />
                            </Paper>
                            <RaisedButton label="Create"
                                labelStyle={styles.buttonLabel}
                                disabled={this.state.password === '' ? true : false}
                                onClick={this._createAccount}
                                buttonStyle={styles.buttonCreate}
                                style={styles.createStyle} />
                            {this.state.isLoading === true ? this.renderProgress() : ''}
                            <p style={{ fontSize: 12, marginLeft: '3%' }}>(Or)</p>
                            <Paper zDepth={2} style={styles.bluePaper}>
                                <div style={{ padding: '7%' }}>
                                    <RaisedButton
                                        label="Select keystore file"
                                        labelStyle={styles.buttonLabel}
                                        onClick={() => { document.getElementById('filepicker').click() }}
                                        buttonStyle={styles.buttonRaisedKeystore}
                                        disabled={this.state.file === '' ? false : true} />
                                    {this.state.file == '' ?
                                        <div></div>
                                        :
                                        <Chip onRequestDelete={() => { this.setState({ file: '' }) }} style={{ margin: '5%' }} >
                                            {this.state.file}
                                        </Chip>
                                    }
                                    <RaisedButton
                                        label="Restore Keystore File"
                                        labelStyle={{ color: 'white', textTransform: 'none' }}
                                        disabled={this.state.file === '' ? true : false}
                                        onClick={this._store.bind(this)}
                                        buttonStyle={styles.buttonCreate}
                                        style={{ marginTop: '5%' }} />
                                    <input type="file" style={{ display: 'none' }} id="filepicker"
                                        onChange={this.onChange.bind(this)} />
                                </div>
                            </Paper>
                        </div>
                        :
                        <div style={{ marginLeft: '5%', marginRight: '5%' }}>
                            <h3 style={styles.headingCreate}>Be Careful</h3>
                            <hr width="50%" align="left" size="3" noshade style={{ backgroundColor: 'rgb(83, 45, 145)' }} />
                            <p style={styles.copyHeading}>
                                Copy your keys to some secured place. Remember we don't store any of your keys in ours databases.
                            We don't maintain a database.</p>
                            <div style={styles.detailsDiv}>
                                <p style={styles.detailHeadBold}>Your Address:</p>
                                <p style={styles.detailVal}>{this.state.account_addr}</p>
                                <p style={styles.detailHeadBold}>Private Key:</p><p
                                    style={styles.detailVal}>{this.state.private_key}
                                    <CopyToClipboard text={this.state.private_key}
                                        onCopy={() => this.setState({
                                            snackMessage: 'Copied to Clipboard Successfully',
                                            openSnack: true
                                        })}>
                                        <img src={'../src/Images/download.jpeg'}
                                            style={styles.clipBoard} />
                                    </CopyToClipboard></p>
                                <p style={styles.detailHeadBold}>Your keystore file is stored at:</p>
                                <p style={styles.detailVal}>{this.state.keystore_addr}</p>
                            </div>
                            <br /><br />
                            <Checkbox
                                label="Yes, I understood, I copied my keys in secured place"
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
                                label="Go to Dashboard"
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
        backgroundColor: 'rgb(240, 94, 9)',
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
        color: 'rgb(83, 45, 145)',
        fontSize: 14,
        marginBottom: 0,
        marginTop: '2%'
    },
    textBoxPaper: {
        height: 35,
        width: '100%',
        backgroundColor: 'rgba(229, 229, 229, 0.66)',
        marginTop: '5%'
    },
    textFieldCreateHint: {
        fontSize: 12,
        color: 'rgba(0, 0, 0, 0.66)'
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
        lineHeight: '30px'
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
        marginTop: '7%'
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
        cursor: 'pointer'
    },
    checkboxLabel: {
        color: 'rgb(240, 94, 9)',
        fontSize: 12,
        fontWeight: 800
    },
    refresh: {
        display: 'inline-block',
        position: 'relative',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
}

export default Create;
