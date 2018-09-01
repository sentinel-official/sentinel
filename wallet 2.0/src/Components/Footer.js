import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IconButton, Tooltip, Snackbar } from '@material-ui/core';
import DisconnectIcon from '@material-ui/icons/HighlightOff';
import { setVpnStatus } from '../Actions/vpnlist.action';
import { disconnectVPN } from '../Utils/DisconnectVpn';
import { footerStyles } from '../Assets/footer.styles';
import { Grid, Row, Col } from 'react-flexbox-grid';
import lang from '../Constants/language';
import RatingDialog from './RatingDialog';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';

const styles = theme => ({
    paper: {
        width: '80%',
        maxHeight: 335,
    },
});

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: '',
            rateDialog: false
        }
    }

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };

    handleDialogClose = () => {
        this.setState({ rateDialog: false });
    };

    snackOpenDialog = (message) => {
        this.setState({ openSnack: true, snackMessage: message })
    }

    disconnect = () => {
        disconnectVPN((res) => {
            if (res) {
                this.setState({ openSnack: true, snackMessage: res });
            }
            else {
                this.setState({ openSnack: true, snackMessage: 'Disconnected VPN', rateDialog: true });
                this.props.setVpnStatus(false);
            }
        })
    }

    render() {
        let language = this.props.lang;
        let { vpnStatus, currentUsage, classes } = this.props;
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
                <RatingDialog
                    classes={{
                        paper: classes.paper,
                    }}
                    open={this.state.rateDialog}
                    onClose={this.handleDialogClose}
                    snackOpenDialog={this.snackOpenDialog}
                />
            </div>
        )
    }
}

Footer.propTypes = {
    classes: PropTypes.object.isRequired,
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

export default compose(withStyles(styles), connect(mapStateToProps, mapDispatchToActions))(Footer);