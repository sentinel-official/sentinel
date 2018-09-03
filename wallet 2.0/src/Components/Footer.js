import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IconButton, Tooltip, Snackbar } from '@material-ui/core';
import DisconnectIcon from '@material-ui/icons/HighlightOff';
import { getVPNUsageData } from '../Utils/utils';
import { setVpnStatus } from '../Actions/vpnlist.action';
import { disconnectVPN } from '../Utils/DisconnectVpn';
import { footerStyles } from '../Assets/footer.styles';
import { Grid, Row, Col } from 'react-flexbox-grid';
import lang from '../Constants/language';

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: ''
        }
    }

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };

    disconnect = () => {
        disconnectVPN((res) => {
            if (res) {
                this.setState({ openSnack: true, snackMessage: res });
            }
            else {
                this.setState({ openSnack: true, snackMessage: 'Disconnected VPN' });
                this.props.setVpnStatus(false);
            }
        })
    }

    render() {
        let language = this.props.lang;
        let { vpnStatus, currentUsage } = this.props;
        console.log("Usage..", this.props.currentUsage);
        return (
            <div style={footerStyles.mainDivStyle}>
                <Grid>
                    <Row>
                        <Col xs={3} style={footerStyles.firstColumn}>
                            <p style={footerStyles.testLabelStyle}>
                                {this.props.isTest ? 'Test Net Activated' : 'Test Net NOT Activated'}
                            </p>
                        </Col>
                        {
                            vpnStatus ?
                                <Col xs={1}>
                                    <Tooltip title="Disconnect">
                                        <IconButton onClick={() => { this.disconnect() }}>
                                            <DisconnectIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Col>
                                : null
                        }
                        {
                            vpnStatus ?
                                <Col xs={8}>
                                    <Row style={footerStyles.textCenter}>
                                        <Col xs={3}>
                                            <label style={footerStyles.headingStyle}>IP Address</label>
                                            <p style={footerStyles.valueStyle}>
                                                {localStorage.getItem('IPGENERATED')}
                                            </p>
                                        </Col>
                                        <Col xs={2}>
                                            <label style={footerStyles.headingStyle}>{lang[language].Speed}</label>
                                            <p style={footerStyles.valueStyle}>
                                                {localStorage.getItem('SPEED')}
                                            </p>
                                        </Col>
                                        <Col xs={3}>
                                            <label style={footerStyles.headingStyle}>{lang[language].Location}</label>
                                            <p style={footerStyles.valueStyle}>
                                                {localStorage.getItem('LOCATION')}
                                            </p>
                                        </Col>
                                        <Col xs={2}>
                                            <label style={footerStyles.headingStyle}>Download</label>
                                            <p style={footerStyles.valueStyle}>
                                                {currentUsage ? (parseInt('down' in currentUsage ? currentUsage.down : 0) / (1024 * 1024)).toFixed(2) : 0.00} MB
                                            </p>
                                        </Col>
                                        <Col xs={2}>
                                            <label style={footerStyles.headingStyle}>Upload</label>
                                            <p style={footerStyles.valueStyle}>
                                                {currentUsage ? (parseInt('up' in currentUsage ? currentUsage.up : 0) / (1024 * 1024)).toFixed(2) : 0.00} MB
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                                : null}
                    </Row>
                </Grid>
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

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        isTest: state.setTestNet,
        currentUsage: state.VPNUsage,
        vpnStatus: state.setVpnStatus
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setVpnStatus
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(Footer);