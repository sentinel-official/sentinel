import React, { Component } from 'react';
import { TextField } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import { isOnline } from './../Actions/convertErc.action';
import { getPrivateKey } from './../Actions/authentication.action';
import { sendError } from './../Actions/authentication.action';
import { swapTransaction, swapRawTransaction } from './../Actions/convertErc.action';
import RightArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { convertToErcStyles } from './../Assets/convertToErc.styles.js';
import { swixRate } from './../Actions/swix.details';
let lang = require('./../Constants/language');

Number.prototype.noExponents = function () {
    var data = String(this).split(/[eE]/);
    if (data.length == 1) return data[0];

    var z = '', sign = this < 0 ? '-' : '',
        str = data[0].replace('.', ''),
        mag = Number(data[1]) + 1;

    if (mag < 0) {
        z = sign + '0.';
        while (mag++) z += '0';
        return z + str.replace(/^\-/, '');
    }
    mag -= str.length;
    while (mag--) z += '0';
    return str + z;
}

class ConvertToErc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            swapAmount: 0,
            tokens: [],
            tokenBalances: {},
            convertPass: '',
            converting: false

        }
    }

    valueChange = (event, value) => {
        let { token } = this.props;
        this.setState({ swapAmount: value });
        this.getCompareValue(token);
        let myValue = Math.pow(value, token.decimals)
        this.props.swixRate(token.symbol, 'SENT', myValue.noExponents())
    }
    componentDidMount() {
        console.log(this.props.token)
    }
    getCompareValue = (symbol) => {
        let token = this.state.tokens.find(obj => obj.symbol === symbol);
        if (token) {
            let self = this;
            let value = 10 ** token.decimals;
            self.props.getSentValue(token.symbol, 'SENT', value, 8)
                .then(() => {
                    console.log(self.props.getSentValueRes)
                    self.setState({ expectedValue: self.props.getSentValueRes });
                })
        }
    }


    onClickConvert = () => {
        let self = this;
        if (this.state.convertPass === '') {
            this.setState({ sending: false, snackOpen: true, snackMessage: lang[this.props.lang].PasswordEmpty })
        }
        else if (parseFloat(this.props.expectedValue / Math.pow(10, this.props.token.decimals)) > 10000) {
            this.setState({ sending: false, snackOpen: true, snackMessage: `Swap Limit for once is 10000 SENTS only` })
        }
        else {
            if (isOnline()) {
                this.setState({
                    converting: true
                });
                setTimeout(function () {
                    getPrivateKey(self.state.convertPass, self.props.lang, function (err, privateKey) {
                        if (err) {
                            sendError(err)
                            self.setState({
                                snackOpen: true,
                                snackMessage: err.message,
                                converting: false
                            })
                        }
                        else {
                            let token = self.state.tokens.find(o => o.symbol === self.props.token);
                            let ether_address = (self.state.tokens.find(o => o.symbol === 'ETH'))['address'];
                            swapTransaction(self.props.local_address, ether_address, token.address,
                                self.state.swapAmount * (10 ** (token.decimals)), privateKey,
                                self.props.token, function (err, data) {
                                    if (err) {
                                        self.setState({
                                            snackOpen: true,
                                            snackMessage: err.message,
                                            converting: false
                                        })
                                    }
                                    else if (data) {
                                        swapRawTransaction(data, self.props.local_address, token.symbol, 'SENT', function (err, txHash) {
                                            if (err) {
                                                self.setState({
                                                    snackOpen: true,
                                                    snackMessage: err.message,
                                                    converting: false
                                                })
                                            }
                                            else {
                                                self.props.getCurrentSwapHash(txHash);
                                                self.setState({
                                                    convertPass: '',
                                                    converting: false,
                                                    openSnack: true,
                                                    tx_addr: txHash
                                                })
                                            }
                                        })
                                    }
                                    else {
                                        self.setState({
                                            snackOpen: true,
                                            snackMessage: 'Error in swapping tokens',
                                            converting: false
                                        })
                                    }
                                })
                        }
                    })
                }, 500);
            }
            else {
                this.setState({ snackOpen: true, snackMessage: lang[this.props.lang].CheckInternet })
            }
        }
    }


    render() {
        var language = this.props.lang;
        console.log('in render', this.props.expectedValue.value)
        return (
            <div>
                <div style={convertToErcStyles.b_f_f}>
                    <p style={convertToErcStyles.heading}>{lang[language].ExchangeERC}</p>
                </div>
                <div style={convertToErcStyles.b_m_t}>
                    <p style={convertToErcStyles.t_a_p_30}>
                        <Row>
                            <Col xsOffset={3} xs={1}>
                                <img src={this.props.token.logo_url} alt="logo" style={convertToErcStyles.h_w_70} />
                            </Col>
                            <Col xsOffset={1} xs={1}>
                                <RightArrow style={convertToErcStyles.h_w_f_70} />
                            </Col>
                            <Col xs={4}>
                                <img src={'../src/Images/logo.svg'} alt="logo" style={convertToErcStyles.h_w_70} />
                            </Col>
                        </Row>
                    </p>
                </div>
                <div style={convertToErcStyles.compareDiv}>
                    <p style={convertToErcStyles.compareP}>{this.state.swapAmount} {this.props.token.symbol} = {this.props.expectedValue.value === 0 ?this.props.expectedValue.value : Number(this.props.expectedValue.value / Math.pow(10,this.props.token.decimals)).toFixed(8)} SENT's</p>
                </div>
                <div style={convertToErcStyles.f_f_p}>
                    <p style={convertToErcStyles.convertHead}>{lang[language].Convert}</p>
                    <Row style={convertToErcStyles.w_m_t}>
                        <Col xsOffset={2} xs={4}>
                            <TextField
                                type="number"
                                underlineShow={false} fullWidth={true}
                                inputStyle={convertToErcStyles.textInputStyle}
                                style={convertToErcStyles.textField}
                                underlineShow={false} fullWidth={true}
                                onChange={this.valueChange.bind(this)}
                                value={this.state.swapAmount}
                            />
                        </Col>
                        <Col xs={4}>
                            <div align={'center'} style={convertToErcStyles.tokenSym}
                            >{this.props.token.symbol}
                            </div>
                        </Col>
                    </Row>
                    <p style={convertToErcStyles.smallBal1}>
                        Balance: {this.state.tokenBalances[this.props.token.symbol]} {this.props.token.symbol}</p>
                    <p style={convertToErcStyles.to}>TO</p>
                    <Row style={convertToErcStyles.w_m_t}>
                        <Col xsOffset={2} xs={8}>
                            <div style={convertToErcStyles.b_p}>
                                <p style={convertToErcStyles.bal}>
                                    <span style={convertToErcStyles.f_w}>
                                        {Number(this.props.expectedValue.value / Math.pow(10,this.props.token.decimals)).toFixed(8)}
                                    </span>
                                    <span style={convertToErcStyles.sentTokens}> SENT TOKENS</span>
                                </p>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div style={convertToErcStyles.b_c_p}>
                    <Row>
                        <Col xsOffset={1} xs={5}>
                            <TextField
                                type="password"
                                hintText="PASSWORD"
                                hintStyle={convertToErcStyles.pwdHint}
                                onChange={(event, password) => this.setState({ convertPass: password })}
                                value={this.state.convertPass}
                                underlineShow={false} fullWidth={true}
                                inputStyle={convertToErcStyles.textInputStyle}
                                style={convertToErcStyles.pwd}
                            />
                        </Col>
                        <Col xs={5}>
                            <Button
                                disabled={this.state.converting}
                                onClick={this.onClickConvert.bind(this)}
                                fullWidth={true}
                                style={this.state.converting ?
                                    convertToErcStyles.b1 :
                                    convertToErcStyles.b2}
                            >
                                <span style={convertToErcStyles.labelStyle}
                                >{this.state.converting ? 'CONVERTING' : lang[language].Convert}</span>
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        getSentValueRes: state.getSentValue,
        expectedValue: state.swixRateInState
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        swixRate
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToActions)(ConvertToErc);