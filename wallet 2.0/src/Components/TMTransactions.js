import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { getKeys, sendAmount } from '../Actions/tendermint.action';
import CustomTextField from './customTextfield';
import { Button, Snackbar } from '@material-ui/core';
import { createAccountStyle } from '../Assets/createtm.styles';
import { accountStyles } from '../Assets/tmaccount.styles';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';

const Customstyles = theme => ({
    button: {
        margin: theme.spacing.unit,
    }
});

class TMTransactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toAddress: '',
            keyPassword: '',
            amount: '',
            openSnack: false,
            snackMessage: ''
        }
    }

    componentWillMount = () => {
        this.props.getKeys();
    }

    sendTransaction = () => {
        console.log("To..",this.state.toAddress);
        let data = {
            "amount": [{ "denom": "sentToken", "amount": this.state.amount.toString() }],
            "name": this.props.keys[0].name,
            "password": this.state.keyPassword,
            "chain_id": "sentinel-testnet",
            "gas": "200000",
            "address": this.state.toAddress
        }
        this.props.sendAmount(data).then(response => {
            console.log("Result...", response);
        });
    }

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };

    render() {
        const { classes } = this.props;
        return (
            <div style={accountStyles.formStyle}>
                <div style={createAccountStyle.secondDivStyle}>
                    <p style={createAccountStyle.headingStyle}>To Address</p>
                    <CustomTextField type={'text'} placeholder={''}
                        onChange={(e) => { this.setState({ toAddress: e.target.value }) }}
                    />
                    <p style={createAccountStyle.headingStyle}>Amount</p>
                    <CustomTextField type={'number'} placeholder={''}
                        onChange={(e) => { this.setState({ amount: e.target.value }) }}
                    />
                    <p style={createAccountStyle.headingStyle}>Account Password</p>
                    <CustomTextField type={'password'} placeholder={''}
                        onChange={(e) => { this.setState({ keyPassword: e.target.value }) }}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => { this.sendTransaction() }}
                        className={classes.button} style={{ margin: 20, outline: 'none' }}>
                        Send
                    </Button>
                </div>
                <Snackbar
                    open={this.state.openSnack}
                    autoHideDuration={4000}
                    onClose={this.handleClose}
                    message={this.state.snackMessage}
                />
            </div>
        )
    }
}

TMTransactions.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        isTest: state.setTestNet,
        keys: state.getKeys
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        getKeys,
        sendAmount
    }, dispatch)
}

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(TMTransactions);