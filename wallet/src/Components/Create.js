import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Toolbar, ToolbarGroup, TextField, RaisedButton, Chip, Dialog, FlatButton, Checkbox } from 'material-ui';
import Dashboard from './Dashboard';
import { createAccount,uploadKeystore } from '../Actions/AccountActions';

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
            checked:false
        }
        this.set = this.props.set;
    }

    onChange = (event) => {
        event.persist();
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
        var that=this;
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

    _store=()=>{
        var keystore=this.state.keystore;
        var that=this;
        uploadKeystore(keystore,function(err){
            if (err) console.log(err);
            else{
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
                labelStyle={{textTransform:'capitalize'}}
                
            />,
        ];
        return (
            <MuiThemeProvider>
                <div>
                    <Toolbar style={{ backgroundColor: '#223366' }}>
                        <ToolbarGroup>
                            <center><p style={{ color: 'white' }}>Sign Up</p></center>
                        </ToolbarGroup>
                    </Toolbar>
                    <Grid>
                        <Row>
                            <Col xs={3}></Col>
                            <Col xs={8}>
                                <TextField
                                    floatingLabelText="Password"
                                    type="password"
                                    onChange={(password) => { this.setState({ password }) }}
                                />
                                <RaisedButton label="Create Wallet" primary={true}
                                    disabled={this.state.password === '' ? true : false}
                                    onClick={this._createAccount} />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={5} />
                            <Col md={2}>
                                <p>(OR)</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={3}>
                                <div>
                                    <input type="file" style={{ display: 'none' }} id="filepicker"
                                        onChange={this.onChange.bind(this)} />
                                </div>
                            </Col>
                            <Col md={4}>
                                <RaisedButton label="Upload Keystore" primary={true} style={{ width: '80%' }}
                                    onClick={() => { document.getElementById('filepicker').click() }}
                                    disabled={this.state.file === '' ? false : true} />
                            </Col>
                            <Col md={4}>
                                <RaisedButton label="Send" disabled={this.state.file === '' ? true : false}
                                    onClick={this._store.bind(this)} />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={3} />
                            <Col md={3}>
                                {this.state.file == '' ?
                                    <div></div>
                                    :
                                    <Chip onRequestDelete={() => { this.setState({ file: '' }) }} style={{ margin: '5%' }} >
                                        {this.state.file}
                                    </Chip>
                                }
                            </Col>
                            <Dialog
                                actions={actions}
                                modal={true}
                                open={this.state.openDialog}
                            >
                                <b>Account Address:</b><p style={{fontSize:'12px'}}>{this.state.account_addr}</p>
                                <b>Private Key:</b><p style={{fontSize:'12px'}}>{this.state.private_key}</p>
                                <b>Keystore stored at:</b><p style={{fontSize:'12px'}}>{this.state.keystore_addr}</p>
                                <Checkbox
                                label="I have saved my Private Key securely"
                                checked={this.state.checked}
                                onCheck={()=>{this.setState((oldState) => {
                                    return {
                                      checked: !oldState.checked,
                                    };
                                  });
                              }}
                                />
                            </Dialog>
                        </Row>
                    </Grid>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Create;
