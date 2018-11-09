import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Card, CardContent, IconButton, Snackbar, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getSessionHistory } from '../Actions/tmvpn.action';
import { sessionStyles } from '../Assets/tmsessions.styles';
import { receiveStyles } from './../Assets/receive.styles';

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
                        {/* <CardContent style={sessionStyles.cardtext}>
                            <span style={sessionStyles.headingStyle}>
                                {lang[language].SessionId} :
                                </span> {sessionData.sessionId}
                            <span style={sessionStyles.headingWithMarginStyle}>
                                {lang[language].VpnAddress} :
                                </span> {sessionData.nodeAccountAddress}
                                <Tooltip title={lang[language].Copy}>
                                <CopyToClipboard text={sessionData.nodeAccountAddress}
                                    onCopy={() => this.setState({
                                        snackMessage: lang[language].Copied,
                                        openSnack: true
                                    })}>
                                    
                                   
                                <CopyIcon style={receiveStyles.clipBoard}/>
                               </CopyToClipboard>
                            </Tooltip>
                            
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
                        </CardContent> */}

                        <CardContent style={sessionStyles.cardtext}>
                            <div style={sessionStyles.headingStyle}>
                                {lang[language].SessionId} : <span style={sessionStyles.textStyle}>{sessionData.sessionId}</span>
                            </div>
                            <div style={sessionStyles.headingStyle}>
                                {lang[language].VpnAddress} : <span style={sessionStyles.textStyle}>{sessionData.nodeAccountAddress}</span>

                                <Tooltip title={lang[language].Copy}>
                                    <CopyToClipboard text={sessionData.nodeAccountAddress}
                                        onCopy={() => this.setState({
                                            snackMessage: lang[language].Copied,
                                            openSnack: true
                                        })}>
                                        {/* <img src={'../src/Images/download.jpeg'}
                                        alt="Copy"
                                        style={sessionStyles.clipBoard} /> */}
                                        <CopyIcon style={receiveStyles.clipBoard} />
                                    </CopyToClipboard>
                                </Tooltip>
                            </div>
                            <div style={sessionStyles.headingStyle}>
                                {lang[language].ReceivedData} :  <span style={sessionStyles.textStyle}>
                                    {this.getPaymentBytes(sessionData.usage.download)}</span>
                            </div>
                            {
                                sessionData.amount ?
                                    <div style={sessionStyles.headingStyle}>
                                        {lang[language].Amount} :  <span style={sessionStyles.textStyle}>
                                            {`${parseInt(sessionData.amount.split('s')[0])/(10**8).toFixed(4)} TSENTs`}</span>
                                    </div> : ''
                            }
                            <div style={sessionStyles.headingStyle}>
                                {lang[language].Duration} :  <span style={sessionStyles.textStyle}>{(Date.parse(new Date(sessionData.endedOn)) -
                                    Date.parse(new Date(sessionData.startedOn))) / 1000}{lang[language].Secs}</span>
                            </div>
                            <div style={sessionStyles.headingStyle}>
                                {lang[language].Time} : <span style={sessionStyles.textStyle}> {moment(new Date(sessionData.startedOn)).format("DD/MM/YYYY hh:mm A")}</span>
                            </div>
                        </CardContent>
                    </Card>
                )
            })
        } else {
            sessionOutput = <div style={sessionStyles.noSessionsStyle}>{lang[language].NoPrevSessions}</div>
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