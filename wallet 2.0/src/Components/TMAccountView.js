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
import { getTMBalance, getKeys } from '../Actions/tendermint.action';
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
        this.props.getKeys().then(res => {
            if (res.payload.length !== 0)
                this.props.getTMBalance(res.payload[0].address);
        });
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
        let token = coins.length !== 0 ? coins.find(o => o.denom === 'sentinelToken') : {};
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
                            value={account_key ? account_key.address : 'Loading...'}
                            fgColor="#000000"
                        />
                        <label style={accountStyles.addressStyle}>
                            {account_key ? account_key.address : 'Loading...'}</label>
                        <Tooltip title="Copy">
                            <CopyToClipboard text={account_key ? account_key.address : 'Loading...'}
                                onCopy={() => this.setState({
                                    snackMessage: lang[language].Copied,
                                    openSnack: true
                                })}>
                                <img src={'../src/Images/download.jpeg'}
                                    alt="Copy"
                                    style={accountStyles.clipBoard} />
                            </CopyToClipboard>
                        </Tooltip>

                        {balance === "" ?
                            <p style={accountStyles.notInNetStyle}>
                                This account address does not exist in network
                            </p>
                            :
                            <p style={accountStyles.balanceStyle}>
                                {token && 'denom' in token ? token.amount : 'Loading...'}
                                {token && 'denom' in token ? ' SUTs' : ''}
                            </p>
                        }
                        <p>
                            {balance === "" ? '*Use faucet to get tokens and join the network' : null}
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
        getTMBalance,
        getKeys
    }, dispatch)
}

export default compose(withStyles(customStyles), connect(mapStateToProps, mapDispatchToActions))(TMAccountView);