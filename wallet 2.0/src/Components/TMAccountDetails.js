import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import { createPagestyles } from './../Assets/authenticate.styles';
import { createAccountStyle } from '../Assets/createtm.styles';
import { setTMComponent } from '../Actions/tendermint.action';
import { Button, Tooltip, Snackbar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import lang from '../Constants/language';
import Checkbox from '@material-ui/core/Checkbox';
import CopyToClipboard from 'react-copy-to-clipboard';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import { receiveStyles } from './../Assets/receive.styles';


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
            checked: false,
            openSnack: false,
            snackMessage: ''
        }
    }

    gotoDashboard = () => {
        this.props.setTMComponent('dashboard');
    }
    handleChange = () => {
        this.setState({ checked: !this.state.checked })
    }

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };

    render() {
        const { classes, account, language } = this.props;
        return (
            <div style={{ padding: '3% 8%' }}>
                <h3 style={createPagestyles.headingCreate}>{lang[language].TMBeCareful}</h3>
                <hr width="50%" align="left" size="3" noshade style={createPagestyles.hr_color} />
                <p style={createPagestyles.copyHeading}>{lang[language].TMCopyKeys}</p>
                <p style={createAccountStyle.detailsHeading}>{lang[language].Address}&nbsp;:</p>

                <div style={createAccountStyle.copyDiv}>

                    <p style={createAccountStyle.detailsText}>{account.address}</p>
                    <Tooltip title={lang[language].Copy}>
                        <CopyToClipboard text={account.address ? account.address : lang[language].Loading}
                            onCopy={() => this.setState({
                                snackMessage: lang[language].Copied,
                                openSnack: true
                            })}>

                            <CopyIcon style={receiveStyles.clipBoard} />
                        </CopyToClipboard>
                    </Tooltip>
                </div>


                <p style={createAccountStyle.detailsHeading}>{lang[language].PubKey}&nbsp;:</p>

                <div style={createAccountStyle.copyDiv}>
                    <p style={createAccountStyle.detailsText}>{account.pub_key}</p>
                    <Tooltip title={lang[language].Copy}>
                        <CopyToClipboard text={account.pub_key ? account.pub_key : lang[language].Loading}
                            onCopy={() => this.setState({
                                snackMessage: lang[language].Copied,
                                openSnack: true
                            })}>

                            <CopyIcon style={receiveStyles.clipBoard} />
                        </CopyToClipboard>
                    </Tooltip>
                </div>
                <p style={createAccountStyle.detailsHeading}>{lang[language].Seed}&nbsp;:</p>

                <div style={createAccountStyle.seedDiv}>
                    <span style={createAccountStyle.detailsText}>{account.seed}</span>
                    <Tooltip title={lang[language].Copy}>
                        <CopyToClipboard text={account.seed ? account.seed : lang[language].Loading}
                            onCopy={() => this.setState({
                                snackMessage: lang[language].Copied,
                                openSnack: true
                            })}>

                            <CopyIcon style={receiveStyles.clipBoard} />
                        </CopyToClipboard>
                    </Tooltip>
                </div>

                <div style={createAccountStyle.checkboxDiv} >
                    <Checkbox
                        checked={this.state.checked}
                        color="primary"
                        onChange={() => this.handleChange()}
                    />
                    <h3 style={createPagestyles.headingCreate}>{lang[language].TMYesUnderstood}</h3>
                </div>
                <Button
                    variant="outlined"
                    color="primary"
                    disabled={this.state.checked ? false : true}
                    onClick={() => { this.gotoDashboard() }}
                    className={classes.enableButton}
                    className={this.state.checked ? classes.enableButton : classes.disableButton}
                    style={createAccountStyle.gotoTMWalletbuttonStyle}>

                    {lang[language].GoToSTWallet}
                </Button>
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