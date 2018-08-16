import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { createPagestyles } from './../Assets/authenticate.styles';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { bindActionCreators } from 'redux';
import { sendError, setComponent } from '../Actions/authentication.action';
import Button from '@material-ui/core/Button';
let lang = require('./../Constants/language');

class TermsAndConditions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            account_addr: '',
            private_key: '',
            keystore_addr: '',
            isLoading: null
        }
    }

    componentDidCatch(error, info) {
        sendError(error);
    }

    componentDidMount() {
        var account = this.props.createAccountResponse
        this.setState({
            account_addr: account.account_addr,
            private_key: account.private_key,
            keystore_addr: account.keystore_addr,
            isLoading: false
        })
    }

    render() {
        let language = this.props.lang;
        return <div style={createPagestyles.MLR5}>
            <h3 style={createPagestyles.headingCreate}>{lang[language].BeCareful}</h3>
            <hr width="50%" align="left" size="3" noshade style={createPagestyles.hr_color} />
            <p style={createPagestyles.copyHeading}>{lang[language].CopyKeys}</p>
            <div style={createPagestyles.detailsDiv}>
                <p style={createPagestyles.detailHeadBold}>{lang[language].YourAddress}:</p>
                <p style={createPagestyles.detailVal}>{this.state.account_addr}</p>
                <p style={createPagestyles.detailHeadBold}>{lang[language].PrivateKey}:</p><p
                    style={createPagestyles.detailVal}>{this.state.private_key}
                    <CopyToClipboard text={this.state.private_key}
                        onCopy={() => this.setState({
                            snackMessage: lang[language].Copied,
                            openSnack: true
                        })}>
                        <img src={'../src/Images/download.jpeg'}
                            alt="Copy"
                            data-tip data-for="copyImage"
                            style={createPagestyles.clipBoard} />
                    </CopyToClipboard></p>
                <ReactTooltip id="copyImage" place="bottom">
                    <span>{lang[language].Copy}</span>
                </ReactTooltip>
                <p style={createPagestyles.detailHeadBold}>{lang[language].KeyLocation}:</p>
                <p style={createPagestyles.detailVal}>{this.state.keystore_addr}</p>
            </div>
            <br /><br />
            <FormControlLabel
                control={
                    <Checkbox
                        labelStyle={createPagestyles.checkboxLabel}
                        checked={this.state.checked}
                        value={this.state.checked}
                        onChange={() => {
                            this.setState((oldState) => {
                                return {
                                    checked: !oldState.checked,
                                };
                            });
                        }}
                    />
                }
                label={lang[language].YesUnderstand} />
            <br /><br />
            <Button variant="contained"
                labelStyle={createPagestyles.yesButtonLabel}
                buttonStyle={this.state.checked ? createPagestyles.yesButton : createPagestyles.disabledButton}
                disabled={this.state.checked ? false : true}
                onClick={() => { this.props.setComponent('dashboard') }}
            >{lang[language].GoToDash}</Button>
        </div>
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
        setComponent: setComponent
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToActions)(TermsAndConditions);