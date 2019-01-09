import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import { setTMComponent } from '../Actions/tendermint.action';
import { Button } from '@material-ui/core';
import { createAccountStyle } from '../Assets/createtm.styles';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import lang from '../Constants/language';

const Customstyles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    enableButton: {
        "&:hover": {
          backgroundColor: '#2f3245'
        },
        backgroundColor: '#2f3245',
        // height: '45px',
      },
      disableButton: {
        backgroundColor: '#BDBDBD',
        // height: '45px',
        cursor: 'not-allowed',
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
        const { classes, account, language } = this.props;
        return (
            <div style={{ padding: '5%' }}>
                <p style={createAccountStyle.detailsHeading}>{lang[language].Address}&nbsp;:</p>
                <p style={createAccountStyle.detailsText}>{account.address}</p>
                <p style={createAccountStyle.detailsHeading}>{lang[language].PubKey}&nbsp;:</p>
                <p style={createAccountStyle.detailsText}>{account.pub_key}</p>
                <p style={createAccountStyle.detailsHeading}>{lang[language].Seed}&nbsp;:</p>
                <p style={createAccountStyle.detailsText}>{account.seed}</p>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => { this.gotoDashboard() }}
                    className={ classes.enableButton }
                    style={createAccountStyle.gotoTMWalletbuttonStyle}>
                    
                    {lang[language].GoToSTWallet}
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
        language: state.setLanguage,
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