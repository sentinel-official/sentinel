import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Toolbar, ToolbarGroup, TextField, RaisedButton, Chip, Dialog, FlatButton, Checkbox, Paper } from 'material-ui';
import Dashboard from './Dashboard';
import { createAccount, uploadKeystore } from '../Actions/AccountActions';

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
            checked: false
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

    _createAccount = () => {
        var password = this.state.password;
        var that = this;
        createAccount(password, function (err, account) {
            if (err) console.log(err, "Error");
            else {
                that.setState({
                    account_addr: account.account_addr,
                    private_key: account.private_key,
                    keystore_addr: account.keystore_addr,
                    openDialog: true
                })
            }
        });
    }

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
                            <img src={'../src/Images/2.png'} style={{ height: 50, width: 50 }} />
                            <p style={styles.toolbarTitle}>SENTINEL-ANON PLATFORM</p>
                        </ToolbarGroup>
                    </Toolbar>
                    <div style={{ marginLeft: '7%', marginRight: '7%' }}>
                        <h3 style={{ color: 'rgb(83, 45, 145)', fontSize: 14, marginBottom: 0, marginTop: '7%' }}>Create your AUID</h3>
                        <hr width="50%" align="left" size="3" noshade style={{ backgroundColor: 'rgb(83, 45, 145)' }} />
                        <Paper zDepth={2} style={{ height: 35, width: '100%', backgroundColor: 'rgba(229, 229, 229, 0.66)', marginTop: '5%' }}>
                            <TextField
                                hintText="Enter Password to create AUID"
                                hintStyle={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.66)' }}
                                type="password"
                                onChange={(password) => { this.setState({ password }) }}
                                style={{ width: '85%', paddingLeft: '5%', height: 40 }}
                            />
                        </Paper>
                        <RaisedButton label="Create"
                            labelStyle={{ color: 'white', textTransform: 'none' }}
                            disabled={this.state.password === '' ? true : false}
                            onClick={this._createAccount}
                            buttonStyle={{ backgroundColor: 'rgba(83, 45, 145, 0.71)', height: '30px', lineHeight: '30px' }}
                            style={{ marginTop: '5%', marginBottom: '3%' }} />
                        <p style={{ fontSize: 12, marginLeft: '3%' }}>(Or)</p>
                        <Paper zDepth={2} style={{ backgroundColor: 'rgba(181, 216, 232, 0.32)', marginTop: '7%' }}>
                            <div style={{ padding: '7%' }}>
                                <RaisedButton
                                    label="Select keystore file"
                                    labelStyle={{ color: 'white', textTransform: 'none' }}
                                    onClick={() => { document.getElementById('filepicker').click() }}
                                    buttonStyle={{ backgroundColor: 'rgba(128, 128, 128, 0.66)', height: '30px', lineHeight: '30px' }}
                                    disabled={this.state.file === '' ? false : true} />
                                {this.state.file == '' ?
                                    <div></div>
                                    :
                                    <Chip onRequestDelete={() => { this.setState({ file: '' }) }} style={{ margin: '5%' }} >
                                        {this.state.file}
                                    </Chip>
                                }
                                <Paper zDepth={2} style={{ height: 35, width: '100%', marginTop: '3%' }}>
                                    <TextField
                                        hintText="Enter keystore password"
                                        hintStyle={{ fontSize: 12, color: 'rgba(0, 0, 0, 0.45)' }}
                                        type="password"
                                        style={{ width: '85%', paddingLeft: '5%', height: 40 }}
                                    />
                                </Paper>
                                <RaisedButton
                                    label="Restore"
                                    labelStyle={{ color: 'white', textTransform: 'none' }}
                                    disabled={this.state.file === '' ? true : false}
                                    onClick={this._store.bind(this)}
                                    buttonStyle={{ backgroundColor: 'rgba(83, 45, 145, 0.71)', height: '30px', lineHeight: '30px' }}
                                    style={{ marginTop: '5%' }} />
                                <input type="file" style={{ display: 'none' }} id="filepicker"
                                    onChange={this.onChange.bind(this)} />
                            </div>
                        </Paper>
                    </div>
                    <Toolbar style={{ backgroundColor: 'rgb(83, 45, 145)', bottom: 0 }}>
                        <ToolbarGroup>
                            <Row>
                                <Col xsOffset={4} xs={4}>
                                    <p>Sentinel@2018</p>
                                </Col>
                            </Row>
                        </ToolbarGroup>
                    </Toolbar>
                    <Dialog
                        actions={actions}
                        modal={true}
                        open={this.state.openDialog}
                    >
                        <b>Account Address:</b><p style={{ fontSize: '12px' }}>{this.state.account_addr}</p>
                        <b>Private Key:</b><p style={{ fontSize: '12px' }}>{this.state.private_key}</p>
                        <b>Keystore stored at:</b><p style={{ fontSize: '12px' }}>{this.state.keystore_addr}</p>
                        <Checkbox
                            label="I have saved my Private Key securely"
                            checked={this.state.checked}
                            onCheck={() => {
                                this.setState((oldState) => {
                                    return {
                                        checked: !oldState.checked,
                                    };
                                });
                            }}
                        />
                    </Dialog>
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
}

export default Create;
