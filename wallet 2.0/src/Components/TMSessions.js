import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, CardContent, IconButton, Snackbar, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getSessionHistory } from '../Actions/tmvpn.action';
import { sessionStyles } from '../Assets/tmsessions.styles';
import moment from 'moment';
import _ from 'lodash';
let lang = require('./../Constants/language');

class TMSessions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: ''
        }
    }

    componentWillMount = () => {
        this.props.getSessionHistory(this.props.account.address);
    }

    getHistory = () => {
        this.props.getSessionHistory(this.props.account.address);
    }

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };

    getPaymentBytes = (bytes) => {
        let data = (parseInt(bytes) / 1024);
        if (data >= 1024) {
            data = data / 1024;
            if (data >= 1024) {
                data = data / 1024;
                data = data.toFixed(3);
                return data + ' GB'
            }
            else {
                data = data.toFixed(3);
                return data + ' MB'
            }
        }
        else {
            data = data.toFixed(3);
            return data + ' KB';
        }
    };

    render() {
        let { sessions, language } = this.props;
        let sessionOutput;
        let filteredSes = sessions.filter(obj => obj.endedOn)
        let sortedSessions = _.sortBy(filteredSes, o => o.endedOn).reverse()
        if (sortedSessions.length > 0) {
            sessionOutput = sortedSessions.map((sessionData) => {
                return (
                    <Card>
                        <CardContent style={sessionStyles.cardtext}>
                            <span style={sessionStyles.headingStyle}>
                                {lang[language].SessionId} :
                                </span> {sessionData.sessionId}
                            <span style={sessionStyles.headingWithMarginStyle}>
                                {lang[language].VpnAddress} :
                                </span> {sessionData.nodeAccountAddress}
                            <Tooltip title="Copy">
                                <CopyToClipboard text={sessionData.nodeAccountAddress}
                                    onCopy={() => this.setState({
                                        snackMessage: lang[language].Copied,
                                        openSnack: true
                                    })}>
                                    <img src={'../src/Images/download.jpeg'}
                                        alt="Copy"
                                        style={sessionStyles.clipBoard} />
                                </CopyToClipboard>
                            </Tooltip>
                            <br />
                            <span style={sessionStyles.headingStyle}>
                                {lang[language].Duration} :
                                </span> {(Date.parse(new Date(sessionData.endedOn)) -
                                Date.parse(new Date(sessionData.startedOn))) / 1000} secs
                                <span style={sessionStyles.headingWithMarginStyle}>
                                {lang[language].ReceivedData} :
                                 </span> {this.getPaymentBytes(sessionData.usage.download)}
                            <span style={sessionStyles.headingWithMarginStyle}>
                                {lang[language].Time} :
                                </span> {moment(new Date(sessionData.startedOn)).format("DD/MM/YYYY hh:mm A")}
                        </CardContent>
                    </Card>
                )
            })
        } else {
            sessionOutput = <div style={sessionStyles.noSessionsStyle}>No Previous Sessions</div>
        }
        return (
            <div style={sessionStyles.firstDiv}>
                <h2 style={sessionStyles.header}>{lang[language].Sessions}</h2>
                <IconButton onClick={() => { this.getHistory() }} style={sessionStyles.buttonRefresh}>
                    <RefreshIcon />
                </IconButton>
                <div style={sessionStyles.history}>
                    {sessionOutput}
                </div>
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

function mapStateToProps(state) {
    return {
        language: state.setLanguage,
        account: state.setTMAccount,
        sessions: state.sessionHistory
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        getSessionHistory
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(TMSessions);