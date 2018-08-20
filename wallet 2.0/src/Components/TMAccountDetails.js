import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { setTMComponent } from '../Actions/tendermint.action';
import { Button } from '@material-ui/core';
import { createAccountStyle } from '../Assets/createtm.styles';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';

const Customstyles = theme => ({
    button: {
        margin: theme.spacing.unit,
    }
});

class TMAccountDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    gotoDashboard = () => {
        this.props.setTMComponent('dashboard');
    }

    render() {
        const { classes, account } = this.props;
        return (
            <div>
                <p>Account Name: {account.name}</p>
                <p>Address: {account.address}</p>
                <p>Public Key: {account.pub_key}</p>
                <p>Seed: {account.seed}</p>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => { this.gotoDashboard() }}
                    className={classes.button} style={{ outline: 'none' }}>
                    Go To Dashboard
                </Button>
            </div>
        )
    }
}

TMAccountDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        isTest: state.setTestNet,
        account: state.createTMAccount
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setTMComponent
    }, dispatch)
}

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(TMAccountDetails);