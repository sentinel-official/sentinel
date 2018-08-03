import React, { Component } from 'react';
import { QRCode } from 'react-qr-svg';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import { sendError, setLanguage } from '../Actions/authentication.action';
import { getAccount, getFreeAmount } from '../Actions/receive.action';
import { Snackbar, FlatButton } from 'material-ui';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
        getFreeAmount(this.state.local_address, function (message) {
            self.setState({ openSnack: true, snackMessage: message })
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
                <FlatButton
                    label={lang[language].GetTokens}
                    labelStyle={{ paddingLeft: 10, paddingRight: 10, fontWeight: '600', fontSize: 12, color: '#FAFAFA' }}
                    onClick={this.getFree.bind(this)}
                    disabled={this.props.isTest}
                    style={{
                        backgroundColor: this.props.isTest ? '#2f3245' : 'rgba(47, 50, 69, 0.34)',
                        position: 'absolute', right: 0, marginTop: 10, marginRight: 20
                    }}
                />
                <Grid>
                    <Row>
                        <Col>
                            <div style={{
                                marginLeft: 370,
                                marginTop: 70,
                                marginBottom: 30,
                            }}>
                                <QRCode
                                    bgColor="#FFFFFF"
                                    level="Q"
                                    style={{ width: 256 }}
                                    value={this.state.local_address}
                                    fgColor="#000000"
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div style={{
                                marginLeft: 290
                            }}>
                                <label style={{
                                    color: '#31b0d5',
                                    fontWeight: 'bold'
                                }}>{this.state.local_address} <CopyToClipboard text={this.state.local_address}
                                    onCopy={() => this.setState({
                                        snackMessage: 'Copied to Clipboard Successfully',
                                        openSnack: true
                                    })} >
                                        <img
                                            src={'../src/Images/download.jpeg'}
                                            data-tip data-for="copyImage"
                                            style={{
                                                height: 18,
                                                width: 18,
                                                cursor: 'pointer'
                                            }}
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
                    onRequestClose={this.snackRequestClose}
                    style={{ marginBottom: '2%' }}
                />
            </div>
        </MuiThemeProvider>
        )
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setLanguage: setLanguage
    }, dispatch)
}
function mapStateToProps(state) {
    return {
        language: state.setLanguage,
        isTest: state.isTest
    }
}
export default connect(mapStateToProps, mapDispatchToActions)(Receive);