import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Snackbar, Button } from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { screenStyles } from '../Assets/selectScreen.styles';
import { setTestNet, setWalletType, setTendermint } from '../Actions/header.action';
import { readFile, KEYSTORE_FILE } from './../Utils/Keystore';
import { setComponent } from './../Actions/authentication.action';


let lang = require('./../Constants/language');


class SelectScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: ''
        }
    }


    snackRequestClose = () => {
        this.setState({
            openSnack: false,
        });
    };

    clickedEth = () => {
        readFile(KEYSTORE_FILE, (err) => {
            setTimeout(() => {
                if (err) this.props.setComponent('create');
                else this.props.setComponent('authenticate');
            }, 1000);
        })
    }

    clickedTm = () => {
        this.props.setTestNet(true);
        this.props.setWalletType('TM');
        this.props.setTendermint(true);
        this.props.setComponent('dashboard');
    }

    render() {
        let language = this.props.language;
        return (
            <MuiThemeProvider>
                <div style={screenStyles.wholeDiv}>
                    <p style={screenStyles.headingStyle}>Select Network</p>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => { this.clickedEth() }}
                        style={screenStyles.ethButtonStyle}>
                        ETHEREUM NETWORK
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => { this.clickedTm() }}
                        style={screenStyles.tmButtonStyle}>
                        TENDERMINT NETWORK
                    </Button>
                    <Snackbar
                        open={this.state.statusSnack}
                        message={this.state.statusMessage}
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
        setComponent,
        setTestNet,
        setTendermint,
        setWalletType
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToActions)(SelectScreen);