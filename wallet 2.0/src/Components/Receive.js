import React, { Component } from 'react';
import { QRCode } from 'react-qr-svg';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import { sendError, setLanguage } from '../Actions/authentication.action';
import { getAccount, getFreeAmount } from '../Actions/receive.action';
import { Snackbar } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { receiveStyles } from './../Assets/receive.styles';
var lang = require('./../Constants/language');

class Receive extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: '', 
            local_address: ''
        }
    }
    componentWillMount() {
        let that = this;
    
        getAccount((err, account_addr) => {
          if (err) { }
          else {
            that.setState({
              local_address: account_addr
            })
          }
        });
    }
    getFree() {
        let self = this;
        self.props.getFreeAmount(self.state.local_address)
        .then(()=> {
            self.setState({ openSnack: true, snackMessage: self.props.getFreeAmountRes.message })
        })
    }

    componentDidCatch(error, info) {
        sendError(error);
    }

    snackRequestClose = () => {
        this.setState({
            openSnack: false,
        });
    };

    render() {
        let language = this.props.language;
        return (<MuiThemeProvider>
            <div>
                <Button
                    onClick={this.getFree.bind(this)}
                    disabled={this.props.isTest}
                    style={
                        this.props.isTest ? 
                        receiveStyles.flatButtonStyleOnTest: 
                        receiveStyles.flatButtonStyleOffTest
                    }
                >{lang[language].GetTokens}</Button>
                <Grid style={receiveStyles.w_100}>
                    <Row>
                        <Col>
                            <div style={receiveStyles.QRCodeDiv}>
                                <QRCode
                                    bgColor="#FFFFFF"
                                    level="Q"
                                    style={receiveStyles.w_256}
                                    value={this.state.local_address}
                                    fgColor="#000000"
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div style={receiveStyles.m_l_265}>
                                <label style={receiveStyles.c_f_w}>
                                {this.state.local_address} <CopyToClipboard text={this.state.local_address}
                                    onCopy={() => this.setState({
                                        snackMessage: 'Copied to Clipboard Successfully',
                                        openSnack: true
                                    })} >
                                        <img
                                            src={'../src/Images/download.jpeg'}
                                            data-tip data-for="copyImage"
                                            style={receiveStyles.copyIcon}
                                        />
                                    </CopyToClipboard></label>
                                <ReactTooltip id="copyImage" place="bottom">
                                    <span>Copy</span>
                                </ReactTooltip>
                            </div>
                        </Col>
                    </Row>
                </Grid>
                <Snackbar
                    open={this.state.openSnack}
                    message={this.state.snackMessage}
                    autoHideDuration={2000}
                    onClose={this.snackRequestClose}
                    style={receiveStyles.m_b_2}
                />
            </div>
        </MuiThemeProvider>
        )
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setLanguage: setLanguage,
        getFreeAmount:getFreeAmount
    }, dispatch)
}
function mapStateToProps(state) {
    return {
        language: state.setLanguage,
        isTest: state.isTest,
        getFreeAmountRes: state.getFreeAmount
    }
}
export default connect(mapStateToProps, mapDispatchToActions)(Receive);