import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Switch, Snackbar, Tooltip } from '@material-ui/core';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import { headerStyles } from '../Assets/header.styles';
import { setComponent } from '../Actions/authentication.action';
import { getAccount } from '../Actions/dashboard.action';
import { setTestNet, getETHBalance } from '../Actions/header.action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: '',
            isGetBalanceCalled: false
        }
    }

    handleClose = (event, reason) => {
        this.setState({ openSnack: false });
    };

    render() {
        let self = this;
        console.log("Props..",this.props);
        if (!this.state.isGetBalanceCalled) {
            setInterval(function () {
                self.props.getETHBalance(self.props.walletAddress, self.props.isTest);
            }, 5000);

            this.setState({ isGetBalanceCalled: true });
        }
        return (
            <div style={headerStyles.mainDivStyle}>
                <Grid>
                    <Row style={headerStyles.firstRowStyle}>
                        <Col xs={1}>
                            <img src={'../src/Images/logo.svg'} alt="logo" style={headerStyles.logoStyle} />
                        </Col>
                        <Col xs={4} style={headerStyles.sentinelColumn}>
                            <div>
                                <span style={headerStyles.basicWallet}>SENTINEL</span>
                            </div>
                            <Row>
                                <Col xs={8}><span
                                    style={headerStyles.walletAddress}>
                                    {this.props.walletAddress}</span>
                                </Col>
                                <Col xs={4}>
                                    <Tooltip title="Copy">
                                        <CopyToClipboard text={this.props.walletAddress}
                                            onCopy={() => this.setState({
                                                snackMessage: 'Copied Successfully',
                                                openSnack: true
                                            })} >
                                            <CopyIcon
                                                style={headerStyles.clipBoard}
                                            />
                                        </CopyToClipboard>
                                    </Tooltip>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={3}>
                            <div style={headerStyles.sentBalance}>
                                <span>{this.props.isTest ? 'TEST SENT: ' : 'SENT: '}</span>
                                <span style={headerStyles.balanceText}>123</span>
                            </div>
                            <div style={headerStyles.ethBalance}>
                                <span>{this.props.isTest ? 'TEST ETH: ' : 'ETH: '}</span>
                                <span style={headerStyles.balanceText}>{this.props.ethBalance === 'Loading'
                                    ? this.props.ethBalance :
                                    parseFloat(this.props.ethBalance).toFixed(8)
                                }</span>
                            </div>
                        </Col>
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
        walletAddress: state.getAccount,
        ethBalance: state.getETHBalance
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setTestNet,
        getETHBalance
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(Header);