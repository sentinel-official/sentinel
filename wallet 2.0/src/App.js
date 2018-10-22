import React, { Component } from 'react';
import Home from './Components/Home';
import Create from './Components/Create';
import Authenticate from './Components/Authenticate';
import { defaultPageStyle } from './Assets/authenticate.styles';
import { Dialog, DialogActions, DialogContent, Button, DialogTitle, DialogContentText } from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Receive from './Components/Receive';
import { setLanguage, setComponent } from './Actions/authentication.action';
import TermsAndConditions from './Components/TermsAndConditions';
import { readFile } from './Utils/Keystore';
import { KEYSTORE_FILE } from './Utils/Keystore';
import Dashboard from './Components/Dashboard';
import { runGaiacli } from './Utils/Gaiacli';
import { B_URL } from './Constants/constants';
const { ipcRenderer } = window.require('electron');

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lang: 'en',
            component: null,
            openDialog: false
        }
    }
    componentWillMount = () => {
        let that = this;
        let isErr = false;
        localStorage.setItem('isTM', false);
        localStorage.setItem('B_URL', B_URL);
        document.getElementById('home').style.display = 'none';
        runGaiacli((err) => {
            if (err) {
                isErr = true;
                this.setState({ openDialog: true })
                this.props.setComponent('error')
            }
        });
        // Read keystore file
        if (!isErr) {
            readFile(KEYSTORE_FILE, function (err) {
                setTimeout(function () {
                    if (err) that.props.setComponent('home');
                    else that.props.setComponent('authenticate');
                }, 3000);
            })
        }
    };

    componentDidMount = () => {
        ipcRenderer.on('lang', (event, arg) => {
            this.setState({ lang: arg }, () => {
                this.props.setLanguage(this.state.lang)
            });
        });
    };

    handleClose = () => {
        window.close()
    };


    render() {
        let component = this.props.setComponentResponse;

        switch (component) {
            case 'create':
                {
                    return <Create />
                }
            case 'authenticate':
                {
                    return <Authenticate />
                    // return <Dashboard />
                }
            case 'dashboard':
                {
                    return <Dashboard />
                }
            case 'home':
                {
                    return <Home />
                }
            case 'terms':
                {
                    return <TermsAndConditions />
                }
            case 'error': {
                return (
                    <div>
                        <Dialog
                            disableBackdropClick
                            disableEscapeKeyDown
                            open={this.state.openDialog}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Problem Occured"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Unable to run tendermint server. Please restart app again.
                          </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose} color="primary" autoFocus>
                                    Close
                          </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                );
            }
            default:
                {
                    return <div style={defaultPageStyle.division}>
                        <img src='../src/Images/logo.jpeg' style={defaultPageStyle.image} />
                        <p style={defaultPageStyle.p}>Sentinel</p>
                        <img src='../src/Images/loading_home.gif' style={{}} />
                    </div>
                }
        }
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setLanguage: setLanguage,
        setComponent: setComponent
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        createAccountResponse: state.createAccount,
        setComponentResponse: state.setComponent
    }
}

export default connect(mapStateToProps, mapDispatchToActions)(App);