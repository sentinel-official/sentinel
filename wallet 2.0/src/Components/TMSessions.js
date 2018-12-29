import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
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
import { historyLabel, historyValue, cardStyle, statusLabel, statusValue } from '../Assets/commonStyles';
import { historyStyles } from '../Assets/txhistory.styles';
import { vpnhistoryStyles, styles } from '../Assets/vpnhistory.style';
import '../Assets/commonStyles.css';

import moment from 'moment';
import _ from 'lodash';
let lang = require('./../Constants/language');

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#2196f3'
        }
    }
});

class TMSessions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: '',
            loading: true
        }
    }

    componentWillMount = () => {
        this.getHistory();
    }

    getHistory = () => {
        this.setState({ loading: true });
        this.props.getSessionHistory(this.props.account.address)
            .then(res => {
                this.setState({ loading: false })
            })
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

    getDurationFormat = (seconds) => {
        if (seconds >= 3600) {
            let hours = Math.floor(parseInt(seconds) / 3600);
            let remainingseconds = parseInt(seconds) % 3600;
            if (remainingseconds >= 60) {
                return this.getMinutesFormat(hours, remainingseconds);
            } else {
                return `${hours} hrs 0 mins ${remainingseconds} secs`
            }
        } else {
            return this.getMinutesFormat(0, seconds);
        }
    }

    getMinutesFormat = (hours, totalSeconds) => {
        if (totalSeconds >= 60) {
            let minutes = Math.floor(parseInt(totalSeconds) / 60);
            let seconds = parseInt(totalSeconds) % 60;
            if (hours > 0)
                return `${hours} hrs ${minutes} mins ${seconds} secs`
            else
                return `${minutes} mins ${seconds} secs`
        } else {
            if (hours > 0)
                return `${hours} hrs 0 mins ${totalSeconds} secs`
            else
                return `${totalSeconds} secs`
        }
    }

    render() {
        let { sessions, language } = this.props;
        let sessionOutput;
        let filteredSes = sessions.filter(obj => obj.endedOn)
        let sortedSessions = _.sortBy(filteredSes, o => o.endedOn).reverse();
        const { classes } = this.props;
        let paymentCount = 0;
        let durationCount = 0;
        let dataCount = 0;
        if (sortedSessions.length > 0) {
            sessionOutput = sortedSessions.map((sessionData) => {
                let sessionAmount = sessionData.amount ? parseInt(sessionData.amount.split('s')[0]) / (10 ** 8) : 0;
                let sessionDuration = (Date.parse(new Date(sessionData.endedOn)) -
                    Date.parse(new Date(sessionData.startedOn))) / 1000;
                paymentCount += parseFloat(sessionAmount.toFixed(8));
                dataCount += sessionData.usage.download;
                durationCount += sessionDuration;
                return (
                    <div style={historyStyles.data}>
                        <Card className="cardStyle" >
                            <div>
                                <label style={historyLabel}>{`${lang[language].SessionId}:`}&nbsp;<span style={historyValue}>{sessionData.sessionId}</span></label>
                            </div>
                            <div>
                                <label style={historyLabel}>{`${lang[language].NodeID}:`}&nbsp;<span style={historyValue}>{sessionData.nodeAccountAddress}</span></label>
                                <Tooltip title={lang[language].Copy}>
                                    <CopyToClipboard text={sessionData.nodeAccountAddress}
                                        onCopy={() => this.setState({
                                            snackMessage: lang[language].Copied,
                                            openSnack: true
                                        })}>

                                        <CopyIcon style={receiveStyles.clipBoard} />
                                    </CopyToClipboard>
                                </Tooltip>
                            </div>
                            <div>
                                <label style={historyLabel}>{`${lang[language].ReceivedData}:`}&nbsp;
                                <span style={historyValue}>{this.getPaymentBytes(sessionData.usage.download)}</span></label>
                            </div>

                            {sessionData.amount ?
                                <div>
                                    <label style={historyLabel}>{`${lang[language].Amount}:`}&nbsp;<span style={historyValue}>
                                        {`${sessionAmount.toFixed(8)} TSENT`}
                                    </span></label>
                                </div>
                                : ''
                            }

                            <div>
                                <label style={historyLabel}>{`${lang[language].Duration}:`}&nbsp;
                                <span style={historyValue}>{sessionDuration}{lang[language].Secs}</span></label>

                            </div>
                            <div>
                                <label style={historyLabel}>{`${lang[language].Time}:`}&nbsp;
                                <span style={historyValue}>{new Date(sessionData.startedOn).toLocaleString()}</span></label>
                            </div>
                        </Card>
                    </div>

                )
            })
        } else {
            sessionOutput = <div style={sessionStyles.noSessionsStyle}>{lang[language].NoPrevSessions}</div>
        }
        return (
            <MuiThemeProvider theme={theme}>
                <div style={vpnhistoryStyles.screen}>
                    <div>
                        <IconButton classes={{ root: classes.button_refresh }} >
                            <RefreshIcon className={classes.refresh_icon} onClick={() => { this.getHistory() }} />
                        </IconButton>
                    </div>
                    {sortedSessions && sortedSessions.length > 0 ?
                        <div>
                            <div style={{ paddingTop: '2%', color: '#919191', fontFamily: 'Montserrat, Medium' }}>
                                <span style={vpnhistoryStyles.text1}>
                                    {lang[language].TotalPayment} :
                                </span> {`${paymentCount} TSENT`}<br />
                                <span style={vpnhistoryStyles.text1}>
                                    {lang[language].TotalDuration} :
                                </span> {this.getDurationFormat(durationCount)}<br />
                                <span style={vpnhistoryStyles.text1}>
                                    {lang[language].TotalData} :
                                </span> {this.getPaymentBytes(dataCount)} <br />
                                <hr />
                            </div>
                            <h2 style={vpnhistoryStyles.header}>{lang[language].Sessions}</h2>
                            <div style={vpnhistoryStyles.history}>
                                {sessionOutput}
                            </div>
                        </div>
                        :
                        this.state.loading ?
                            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20%', fontSize: '25px' }}>
                                {lang[language].Loading}
                            </div>
                            :
                            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20%', fontSize: '25px' }}>
                                {lang[language].NoPrevSessions}
                            </div>

                    }
                    <Snackbar
                        open={this.state.openSnack}
                        autoHideDuration={4000}
                        onClose={this.handleClose}
                        message={this.state.snackMessage}
                    />
                </div>
            </MuiThemeProvider>
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToActions)(TMSessions));