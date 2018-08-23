import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, CardContent, CardHeader, Tooltip, Snackbar, IconButton } from '@material-ui/core';
import { accountStyles } from '../Assets/tmaccount.styles';
import { withStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { QRCode } from 'react-qr-svg';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getTMBalance } from '../Actions/tendermint.action';
let lang = require('./../Constants/language');

const customStyles = theme => ({
    title: accountStyles.titleStyle
})

class TMAccountView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: ''
        }
    }

    componentWillMount = () => {
        if (this.props.keys.length !== 0)
            this.props.getTMBalance(this.props.keys[0].address);
    }

    getBalance = () => {
        this.props.getTMBalance(this.props.keys[0].address);
    }

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };

    render() {
        let account_key = this.props.keys.length !== 0 ? this.props.keys[0] : null;
        let { classes, language, balance } = this.props;
        let balValue = (typeof balance === 'object' && balance !== null) ? ('value' in balance ? balance.value : {}) : {};
        let coins = (typeof balValue === 'object' && balValue !== null) ? ('coins' in balValue ? balValue.coins : []) : [];
        let token = coins.length !== 0 ? coins.find(o => o.denom === 'sentToken') : {};
        return (
            <div style={accountStyles.formStyle}>
                <Card style={accountStyles.cardStyle}>
                    <CardHeader
                        action={
                            <IconButton onClick={() => { this.getBalance() }}>
                                <RefreshIcon />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        <QRCode
                            bgColor="#FFFFFF"
                            level="Q"
                            style={accountStyles.qrCodeStyle}
                            value={account_key.address}
                            fgColor="#000000"
                        />
                        <label style={accountStyles.addressStyle}>
                            {account_key.address}</label>
                        <Tooltip title="Copy">
                            <CopyToClipboard text={account_key.address}
                                onCopy={() => this.setState({
                                    snackMessage: lang[language].Copied,
                                    openSnack: true
                                })}>
                                <img src={'../src/Images/download.jpeg'}
                                    alt="Copy"
                                    style={accountStyles.clipBoard} />
                            </CopyToClipboard>
                        </Tooltip>
                        <p style={accountStyles.balanceStyle}>
                            {token && 'denom' in token ? token.amount : 'Loading...'}
                            {token && 'denom' in token ? ' SUTs' : ''}
                        </p>
                    </CardContent>
                </Card>
                <Snackbar
                    open={this.state.openSnack}
                    autoHideDuration={4000}
                    onClose={this.handleClose}
                    message={this.state.snackMessage}
                />
            </div >
        )
    }
}

TMAccountView.propTypes = {
    classes: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        language: state.setLanguage,
        isTest: state.setTestNet,
        keys: state.getKeys,
        balance: state.tmBalance
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        getTMBalance
    }, dispatch)
}

export default compose(withStyles(customStyles), connect(mapStateToProps, mapDispatchToActions))(TMAccountView);