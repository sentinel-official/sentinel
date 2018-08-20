import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { getKeys } from '../Actions/tendermint.action';
import { createTMAccount } from '../Actions/createTM.action';
import CustomTextField from './customTextfield';
import { Button, Snackbar } from '@material-ui/core';
import { createAccountStyle } from '../Assets/createtm.styles';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';

const Customstyles = theme => ({
    button: {
        margin: theme.spacing.unit,
    }
});

class CreateTMAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyName: '',
            keyPassword: '',
            openSnack: false,
            snackMessage: ''
        }
    }

    componentWillMount = () => {
    }

    createAccount = () => {
        this.props.createTMAccount(this.state.keyName, this.state.keyPassword).then(res => {
            if (res.error) {
                this.setState({ openSnack: true, snackMessage: res.error.data })
            }
        });
    }

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };

    render() {
        const { classes } = this.props;
        return (
            <div style={createAccountStyle.formStyle}>
                <div style={createAccountStyle.secondDivStyle}>
                    <p style={createAccountStyle.headingStyle}>Account Name</p>
                    <CustomTextField type={'text'} placeholder={''}
                        onChange={(e) => { this.setState({ keyName: e.target.value }) }}
                    />
                    <p style={createAccountStyle.headingStyle}>Account Password</p>
                    <CustomTextField type={'password'} placeholder={''}
                        onChange={(e) => { this.setState({ keyPassword: e.target.value }) }}
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => { this.createAccount() }}
                        className={classes.button} style={{ margin: 20, outline: 'none' }}>
                        Create Account
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

CreateTMAccount.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        isTest: state.setTestNet
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        getKeys,
        createTMAccount
    }, dispatch)
}

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(CreateTMAccount);