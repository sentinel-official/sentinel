import React, { Component } from 'react';
import { MuiThemeProvider, Snackbar, DropDownMenu, MenuItem, RaisedButton, TextField, Slider, FlatButton, Dialog } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import DownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';
import TransIcon from 'material-ui/svg-icons/action/swap-horiz';
import RightArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
    transferAmount, isOnline, payVPNUsage, getFreeAmount, getAvailableTokens, sendError, getTokenBalance,
    getSentValue, getSentTransactionHistory, swapRawTransaction
} from '../Actions/AccountActions';
import { getPrivateKey, ethTransaction, tokenTransaction, getGasCost, swapTransaction } from '../Actions/TransferActions';
import ReactTooltip from 'react-tooltip';
var config = require('../config');
var lang = require('./language');

let statusUrl;
let shell = window
    .require('electron')
    .shell;

const muiTheme = getMuiTheme({
    slider: {
        selectionColor: '#595d8f',
        trackSize: 4,
        handleSize: 20
    },
});

class SendNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keystore: '',
            to_address: '',
            amount: 0,
            gas: 21000,
            data: '',
            priv_key: '',
            file: '',
            unit: 'ETH',
            tx_addr: null,
            password: '',
            sending: false,
            openSnack: false,
            snackOpen: false,
            isGetBalanceCalled: false,
            snackMessage: '',
            isDisabled: true,
            isInitial: true,
            transactionStatus: '',
            session_id: null,
            sliderValue: 20,
            showTransScreen: false,
            tokens: [],
            tokenBalances: {},
            selectedToken: 'ETH',
            currentSentValue: 1,
            swapAmount: 1,
            convertPass: '',
            converting: false
        };
    }

    componentWillMount = () => {
        //this.getGas()
        this.getTokensList();
    }

    componentDidMount = () => {
        this.getCompareValue(this.state.selectedToken);
    }

    handleSlider = (event, value) => {
        this.setState({ sliderValue: value })
    }

    openInExternalBrowser(url) {
        shell.openExternal(url);
        this.setState({ tx_addr: null })
    };

    getStatusUrl() {
        if (localStorage.getItem('config') === 'TEST')
            return config.test.statusUrl
        else return config.main.statusUrl
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isPropReceive === true) {
            this.setState({
                to_address: nextProps.to_addr,
                amount: nextProps.amount,
                unit: nextProps.unit,
                session_id: nextProps.session_id,
                sending: nextProps.sending,
                password: ''
            })
            this.getGasLimit(nextProps.amount, nextProps.to_addr, nextProps.unit);
            this.props.propReceiveChange()
            if (nextProps.to_addr !== '') {
                this.setState({ isDisabled: false })
            }
            else {
                this.setState({ isDisabled: true })
            }
        }
    }

    payVPN = (privateKey) => {
        let self = this;
        let from_addr = this.props.local_address;
        let to_addr = this.state.to_address;
        let gas = this.state.gas;
        let amount = this.state.amount;
        let gas_price = this.state.sliderValue * (10 ** 9);
        if (this.state.session_id === -1 && parseInt(this.state.amount) !== 10000000000) {
            this.setState({ snackOpen: true, snackMessage: 'Please send 100 SENTS', sending: false })
        }
        else {
            tokenTransaction(from_addr, to_addr, amount, gas_price, gas, privateKey, function (data) {
                let network;
                let sessionId;
                let paymentType;
                if (self.props.isTest)
                    network = 'rinkeby'
                else network = 'main'
                if (self.state.session_id === -1) {
                    sessionId = null;
                    paymentType = 'init';
                }
                else {
                    paymentType = 'normal';
                    sessionId = self.state.session_id;
                }
                let body = {
                    from_addr: self.props.local_address,
                    amount: self.state.amount,
                    session_id: sessionId,
                    tx_data: data,
                    net: network,
                    payment_type: paymentType
                }
                payVPNUsage(body, function (err, tx_addr) {
                    if (err) {
                        self.props.clearSend();
                        self.setState({
                            snackOpen: true,
                            snackMessage: err.message,
                            to_address: '',
                            amount: '',
                            session_id: null,
                            unit: 'ETH',
                            password: '',
                            sending: false,
                            isDisabled: true
                        });
                    }
                    else {
                        var data = {
                            date: Date.now(),
                            to: self.state.to_address,
                            gasPrice: self.state.sliderValue,
                            amount: parseFloat((self.state.amount) / (10 ** 8)),
                            txHash: tx_addr
                        }
                        var txData = JSON.stringify(data);
                        self.props.getCurrentTx(tx_addr);
                        localStorage.setItem('currentTransaction', txData);
                        self.props.clearSend();
                        self.clearFields(tx_addr)
                    }
                });
            })
        }
    }

    rawTransaction(privateKey) {
        let self = this;
        let from_addr = this.props.local_address;
        let to_addr = this.state.to_address;
        let gas = this.state.gas;
        let amount = this.state.amount;
        let gas_price = this.state.sliderValue * (10 ** 9)
        if (this.state.unit === 'ETH') {
            ethTransaction(from_addr, to_addr, amount, gas_price, gas, privateKey, function (data) {
                self.mainTransaction(data)
            })
        }
        else {
            tokenTransaction(from_addr, to_addr, amount, gas_price, gas, privateKey, function (data) {
                self.mainTransaction(data)
            })
        }
    }

    mainTransaction(tx_data) {
        console.log("Main")
        let self = this;
        let net;
        if (this.props.isTest)
            net = 'rinkeby'
        else net = 'main'
        transferAmount(net, tx_data, function (err, tx_addr) {
            if (err) self.errorAlert(err);
            else {
                self.props.clearSend();
                self.clearFields(tx_addr)
            }
        });
    }

    errorAlert(err) {
        this.setState(
            {
                snackOpen: true,
                snackMessage: err.message,
                sending: false,
                isDisabled: false
            });
    }

    clearFields(tx_addr) {
        this.setState({
            tx_addr: tx_addr,
            openSnack: true,
            to_address: '',
            amount: '',
            session_id: null,
            unit: 'ETH',
            password: '',
            sending: false,
            isDisabled: true
        })
    }

    getFree() {
        let self = this;
        getFreeAmount(this.props.local_address, function (message) {
            self.setState({ snackOpen: true, snackMessage: message })
        })
    }

    onClickSend = () => {
        var self = this;
        if (this.state.amount === '') {
            this.setState({ sending: false, snackOpen: true, snackMessage: lang[this.props.lang].AmountEmpty })
        }
        else if (this.state.password === '') {
            this.setState({ sending: false, snackOpen: true, snackMessage: lang[this.props.lang].PasswordEmpty })
        }
        else {
            if (isOnline()) {
                this.setState({
                    isDisabled: true,
                    sending: true
                });
                setTimeout(function () {
                    getPrivateKey(self.state.password, self.props.lang, function (err, privateKey) {
                        //console.log("Get..", self.state.isDisabled, err, privateKey)
                        if (err) {
                            sendError(err)
                            self.errorAlert(err)
                        }
                        else {
                            if (self.state.session_id === null) {
                                self.rawTransaction(privateKey)
                            }
                            else {
                                self.payVPN(privateKey)
                            }
                        }
                    })
                }, 500);
            }
            else {
                this.setState({ snackOpen: true, snackMessage: lang[this.props.lang].CheckInternet })
            }
        }
    }

    openSnackBar = () => this.setState({
        snackMessage: 'Your Transaction is Placed Successfully.',
        openSnack: true
    })

    amountChange = (event, amount) => {
        if (this.state.unit === 'ETH') amount = amount * Math.pow(10, 18);
        else amount = amount * Math.pow(10, 8);
        this.setState({ amount: amount })
        let trueAddress = this.state.to_address.match(/^0x[a-zA-Z0-9]{40}$/)
        if (trueAddress !== null) {
            this.getGasLimit(amount, this.state.to_address, this.state.unit)
        }
    }

    addressChange = (event, to_addr) => {
        this.setState({ to_address: to_addr })
        let trueAddress = to_addr.match(/^0x[a-zA-Z0-9]{40}$/)
        if (trueAddress !== null) {
            this.setState({ isDisabled: false })
            if (this.state.amount !== '') {
                this.getGasLimit(this.state.amount, to_addr, this.state.unit)
            }
        }
    }

    getGasLimit = (amount, to, unit) => {
        var from = this.props.local_address;
        // if (unit === 'ETH') amount = amount * Math.pow(10, 18)
        // else amount = amount * Math.pow(10, 8)
        let that = this;
        getGasCost(from, to, amount, unit, function (gasLimit) {
            that.setState({ gas: gasLimit })
        })
    }

    snackRequestClose = () => {
        this.setState({
            openSnack: false,
            snackOpen: false
        });
    };

    handleChange = (event, index, unit) => {
        console.log("Amount..", this.state.amount);
        let amount;
        if (unit === 'ETH') amount = (unit !== this.state.amount) ? this.state.amount * Math.pow(10, 10) : this.state.amount;
        else amount = (unit !== this.state.amount) ? this.state.amount / Math.pow(10, 10) : this.state.amount;
        this.setState({ amount: amount, unit: unit });
        let trueAddress = this.state.to_address.match(/^0x[a-zA-Z0-9]{40}$/)
        if (trueAddress !== null && amount !== '') {
            this.getGasLimit(amount, this.state.to_address, unit)
        }
    };

    handleClose = () => {
        this.setState({ showTransScreen: false });
    };

    getTokensList = () => {
        let self = this;
        getAvailableTokens(function (err, tokens) {
            if (err) { }
            else {
                let tokensList = tokens.filter((token) => token.symbol !== 'SENT');
                self.setState({ tokens: tokensList })
                tokensList.map((token) => {
                    self.getUnitBalance(token);
                })
            }
        })
    }

    getBalancesTokens = () => {
        let self = this;
        self.state.tokens.map((token) => {
            self.getUnitBalance(token);
        })
    }

    getUnitBalance = (token) => {
        if (token.symbol === 'ETH') {
            let obj = this.state.tokenBalances;
            obj[token.symbol] = this.props.balance.eths !== 'Loading' ? this.props.balance.eths.toFixed(8) : 'Loading';;
            this.setState({ tokenBalances: obj });
        }
        else {
            let self = this
            getTokenBalance(token.address, self.props.local_address, token.decimals, function (err, tokenBalance) {
                if (err) { }
                else {
                    let obj = self.state.tokenBalances;
                    obj[token.symbol] = tokenBalance;
                    self.setState({ tokenBalances: obj });
                }
            })
        }
    }

    swapChange = (event, index, unit) => {
        this.setState({ selectedToken: unit });
        this.getCompareValue(unit);
    };

    getCompareValue = (symbol) => {
        let token = this.state.tokens.find(obj => obj.symbol === symbol);
        if (token) {
            let self = this;
            let value = 10 ** token.decimals;
            getSentValue(token.address, value, function (err, swapValue) {
                if (err) { }
                else {
                    self.setState({ currentSentValue: swapValue });
                }
            })
        }
    }

    valueChange = (event, value) => {
        this.setState({ swapAmount: value });
        this.getCompareValue(this.state.selectedToken);
    }

    onClickConvert = () => {
        let self = this;
        if (this.state.convertPass === '') {
            this.setState({ sending: false, snackOpen: true, snackMessage: lang[this.props.lang].PasswordEmpty })
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
                            let token = self.state.tokens.find(o => o.symbol === self.state.selectedToken);
                            let ether_address = (self.state.tokens.find(o => o.symbol === 'ETH'))['address'];
                            swapTransaction(self.props.local_address, ether_address, token.address,
                                self.state.swapAmount * (10 ** (token.decimals)), privateKey,
                                self.state.selectedToken, function (data) {
                                    if (data) {
                                        swapRawTransaction(data, function (err, txHash) {
                                            if (err) {
                                                self.setState({
                                                    snackOpen: true,
                                                    snackMessage: err.message,
                                                    converting: false
                                                })
                                            }
                                            else {
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
        let self = this;
        if (!this.state.isGetBalanceCalled) {
            setInterval(function () {
                self.getBalancesTokens()
            }, 10000);

            this.setState({ isGetBalanceCalled: true });
        }
        let language = this.props.lang;
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <Grid>
                        <Row>
                            <Col xs={4} style={{ padding: '3% 2% 0px' }}>
                                <p style={{ fontSize: 16, fontWeight: 600, color: '#253245', letterSpacing: 2 }}>TOKEN BALANCE</p>
                                <div style={{ padding: '6% 4%', paddingBottom: 0, backgroundColor: '#ececf1' }}>
                                    <Row>
                                        <Col xs={4}>
                                            <img src={'../src/Images/logo.svg'} alt="logo" style={{ width: 50, height: 50, margin: '1% 10%' }} />
                                        </Col>
                                        <Col xs={8}>
                                            <p style={{ fontSize: 18, fontWeight: 'bold', letterSpacing: 3 }}>17245.152</p>
                                            <p style={{ color: 'grey', marginTop: -18, letterSpacing: 2 }}>Sentinel [SENT]</p>
                                        </Col>
                                    </Row>
                                </div>
                                <div style={styles.otherBalanceDiv}>
                                    {this.state.tokens.length !== 0 ?
                                        this.state.tokens.map((token) =>
                                            <Row>
                                                <Col xs={4}>
                                                    <img src={'../src/Images/logo.svg'} alt="logo" style={styles.otherBalanceLogo} />
                                                </Col>
                                                <Col xs={8}>
                                                    <p style={styles.otherBalanceBalc}>{this.state.tokenBalances[token.symbol] ? this.state.tokenBalances[token.symbol] : 0}</p>
                                                    <p style={styles.otherBalanceText}>{token.name} [{token.symbol}]</p>
                                                </Col>
                                            </Row>
                                        )
                                        :
                                        <div>No Tokens Found</div>
                                    }
                                </div>
                            </Col>
                            <Col xs={8} style={{ padding: '3% 5% 0px' }}>
                                <div>
                                    <span style={styles.formHeading}>SEND TO ADDRESS</span>
                                    <span data-tip data-for="toField" style={styles.questionMark}>?</span>
                                    <FlatButton
                                        label={lang[language].GetTokens}
                                        labelStyle={{ paddingLeft: 10, paddingRight: 10, fontWeight: '600', fontSize: 12, color: '#FAFAFA' }}
                                        onClick={this.getFree.bind(this)}
                                        disabled={!this.props.isTest}
                                        style={{
                                            backgroundColor: this.props.isTest ? '#2f3245' : 'rgba(47, 50, 69, 0.34)',
                                            position: 'absolute', right: 0, marginTop: -5, marginRight: 50
                                        }}
                                    />
                                    <TextField
                                        hintText="Example: 0x6b6df9e25f7bf23343mfkr45"
                                        hintStyle={{ bottom: 8, paddingLeft: 10, letterSpacing: 2 }}
                                        style={{ backgroundColor: '#d4dae2', height: 42, marginTop: 15 }}
                                        underlineShow={false} fullWidth={true}
                                        onChange={this.addressChange.bind(this)}
                                        value={this.state.to_address}
                                        inputStyle={{ padding: 10, fontWeight: 'bold', color: '#2f3245' }}
                                    />
                                </div>
                                <div style={{ marginTop: '5%' }}>
                                    <span style={styles.formHeading}>AMOUNT TO SEND</span>
                                    <span data-tip data-for="amountField" style={styles.questionMark}>?</span>
                                    <Row>
                                        <Col xs={8}>
                                            <TextField
                                                type="number"
                                                underlineShow={false} fullWidth={true}
                                                inputStyle={{ padding: 10, fontWeight: 'bold', color: '#2f3245' }}
                                                style={{ backgroundColor: '#d4dae2', height: 42, marginTop: 12 }}
                                                underlineShow={false} fullWidth={true}
                                                onChange={this.amountChange.bind(this)} value={
                                                    (this.state.amount === null || this.state.amount === 0) ? null :
                                                        (this.state.unit === 'ETH' ? parseFloat(this.state.amount / (10 ** 18)) :
                                                            parseFloat(this.state.amount / (10 ** 8)))
                                                }
                                            />
                                        </Col>
                                        <Col xs={4}>
                                            <DropDownMenu
                                                autoWidth={false}
                                                iconButton={<DownArrow />}
                                                iconStyle={{
                                                    top: -5,
                                                    right: 0,
                                                    fill: 'white'
                                                }}
                                                labelStyle={{
                                                    height: 42,
                                                    lineHeight: '42px',
                                                    fontWeight: '600',
                                                    color: '#2f3245',
                                                    textAlign: 'center',
                                                    paddingLeft: 0,
                                                    paddingRight: 24
                                                }}
                                                style={{
                                                    backgroundColor: '#b6b9cb',
                                                    height: 42,
                                                    width: '110%',
                                                    marginTop: 12,
                                                    marginLeft: -16
                                                }}
                                                value={this.state.unit}
                                                menuItemStyle={{ width: 160 }}
                                                onChange={this.handleChange.bind(this)}
                                            >
                                                <MenuItem
                                                    value="ETH"
                                                    primaryText={this.props.isTest ? "TEST ETH" : "ETH"}
                                                />
                                                <MenuItem
                                                    value="SENT"
                                                    primaryText={this.props.isTest ? "TEST SENT" : "SENT"}
                                                />
                                            </DropDownMenu>
                                        </Col>
                                    </Row>
                                </div>
                                <div style={{ marginTop: '5%' }}>
                                    <Row>
                                        <Col xs={4}>
                                            <span style={styles.formHeading}>GAS LIMIT</span>
                                            <span data-tip data-for="gasField" style={styles.questionMark}>?</span>
                                            <TextField
                                                type="number"
                                                style={{ backgroundColor: '#d4dae2', height: 42, marginTop: 12 }}
                                                underlineShow={false} fullWidth={true}
                                                inputStyle={{ padding: 10, fontWeight: 'bold', color: '#2f3245' }}
                                                onChange={(event, gas) => this.setState({ gas })}
                                                value={this.state.gas}
                                            />
                                        </Col>
                                        <Col xsOffset={1} xs={7}>
                                            <span style={styles.formHeading}>GAS PRICE</span>
                                            <span data-tip data-for="gasPrice" style={styles.questionMark}>?</span>
                                            <span style={{ marginLeft: 20, color: '#595d8f', fontWeight: 'bold' }}>{this.state.sliderValue} </span>
                                            <span style={{ color: 'grey' }}>GWEI</span>
                                            <Slider
                                                min={1}
                                                max={99}
                                                step={1}
                                                value={this.state.sliderValue}
                                                onChange={this.handleSlider}
                                                sliderStyle={{ color: '#595d8f', marginBottom: 0, height: 'auto' }}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4} style={{ padding: '0% 2%' }}>
                                <RaisedButton
                                    label="Convert ERC20 to SENT"
                                    labelStyle={{ textTransform: 'none', color: 'white', fontWeight: 'bold', fontSize: 16 }}
                                    fullWidth={true}
                                    onClick={() => {
                                        this.setState({ showTransScreen: true });
                                        this.getCompareValue(this.state.selectedToken);
                                    }}
                                    icon={<TransIcon style={{ marginLeft: 0, height: 36, width: 36 }} />}
                                    buttonStyle={{ backgroundColor: '#595d8f', height: 48, lineHeight: '48px' }}
                                    style={{ height: 48 }}
                                />
                            </Col>
                            <Col xs={8} style={{ padding: '0% 5%' }}>
                                <Row>
                                    <Col xs={6} style={{ marginTop: -35 }}>
                                        <span style={styles.formHeading}>PASSWORD</span>
                                        <span data-tip data-for="passwordField" style={styles.questionMark}>?</span>
                                        <TextField
                                            type="password"
                                            onChange={(event, password) => this.setState({ password })}
                                            value={this.state.password}
                                            underlineShow={false} fullWidth={true}
                                            inputStyle={{ padding: 10, fontWeight: 'bold', color: '#2f3245' }}
                                            style={{ backgroundColor: '#d4dae2', height: 48, marginTop: 12 }}
                                        />
                                    </Col>
                                    <Col xsOffset={1} xs={5}>
                                        <RaisedButton
                                            disabled={this.state.to_address === '' || this.state.sending || this.state.isDisabled ? true : false}
                                            onClick={this.onClickSend.bind(this)}
                                            label={this.state.sending === null || this.state.sending === false ? lang[language].Send : "Sending..."}
                                            labelStyle={{ textTransform: 'none', color: 'white', fontWeight: 'bold', fontSize: 16 }}
                                            fullWidth={true}
                                            buttonStyle={
                                                this.state.to_address === '' || this.state.sending === true || this.state.isDisabled === true ?
                                                    { backgroundColor: '#bdbdbd', height: 48, lineHeight: '48px' }
                                                    :
                                                    { backgroundColor: '#595d8f', height: 48, lineHeight: '48px' }
                                            }
                                            style={{ height: 48 }}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <ReactTooltip id="toField" place="bottom">
                            <span>{lang[language].ToTooltip}</span>
                        </ReactTooltip>
                        <ReactTooltip id="amountField" place="bottom">
                            <span>{lang[language].AmountTool1}<br />
                                {lang[language].AmountTool2}</span>
                        </ReactTooltip>
                        <ReactTooltip id="gasField" place="bottom">
                            <span>{lang[language].GasFieldTool}</span>
                        </ReactTooltip>
                        <ReactTooltip id="gasPrice" place="bottom">
                            <span>{lang[language].GasPriceTool}</span>
                        </ReactTooltip>
                        <ReactTooltip id="messageField" place="bottom">
                            <span>A message that you might want to add as a transaction note</span>
                        </ReactTooltip>
                        <ReactTooltip id="passwordField" place="bottom">
                            <span>{lang[language].PasswordTool}</span>
                        </ReactTooltip>
                        <Snackbar
                            open={this.state.openSnack}
                            // message={this.state.snackMessage}
                            autoHideDuration={10000}
                            onRequestClose={this.snackRequestClose}
                            style={{ marginBottom: '2%' }}
                            message="Transaction Placed"
                            action="Check Status"
                            onActionClick={() => {
                                statusUrl = this.getStatusUrl()
                                this.openInExternalBrowser(`${statusUrl}/tx/${this.state.tx_addr}`)
                            }}
                        />
                        <Snackbar
                            open={this.state.snackOpen}
                            message={this.state.snackMessage}
                            autoHideDuration={8000}
                            onRequestClose={this.snackRequestClose}
                        />
                        < Dialog
                            contentStyle={{ width: 700 }}
                            bodyStyle={{ padding: 0 }}
                            open={this.state.showTransScreen}
                            onRequestClose={this.handleClose}
                        >
                            <div style={{ backgroundColor: '#efefef', fontFamily: 'Poppins' }}>
                                <p style={{ textAlign: 'center', padding: 10, color: 'black', fontSize: 14, letterSpacing: 1 }}>Exchange ERC20 tokens for Sentinel tokens</p>
                            </div>
                            <div style={{ backgroundColor: '#435e8d', marginTop: -16 }}>
                                <p style={{ textAlign: 'center', padding: 30 }}>
                                    <Row>
                                        <Col xsOffset={3} xs={1}>
                                            <img src={'../src/Images/eth.png'} alt="logo" style={{ height: 70, width: 70 }} />
                                        </Col>
                                        <Col xsOffset={1} xs={1}>
                                            <RightArrow style={{ height: 70, width: 70, fill: '#ccc' }} />
                                        </Col>
                                        <Col xs={4}>
                                            <img src={'../src/Images/logo.svg'} alt="logo" style={{ height: 70, width: 70 }} />
                                        </Col>
                                    </Row>
                                </p>
                            </div>
                            <div style={{ backgroundColor: '#2c3d5b', marginTop: -16, fontFamily: 'Poppins' }}>
                                <p style={{
                                    fontSize: 14, textAlign: 'center', padding: 5, color: 'white', letterSpacing: 1, fontWeight: 'bold'
                                }}>1 {this.state.selectedToken} = {this.state.currentSentValue} SENTS</p>
                            </div>
                            <div style={{ fontFamily: 'Poppins' }}>
                                <p style={{ fontSize: 16, textAlign: 'center', color: '#2c3d5b', fontWeight: 'bold' }}>CONVERT</p>
                                <Row style={{ width: '100%', marginTop: -12 }}>
                                    <Col xsOffset={2} xs={4}>
                                        <TextField
                                            type="number"
                                            underlineShow={false} fullWidth={true}
                                            inputStyle={{ padding: 10, fontWeight: 'bold', color: '#2f3245' }}
                                            style={{ backgroundColor: '#dfe3e6', height: 42, width: '110%' }}
                                            underlineShow={false} fullWidth={true}
                                            onChange={this.valueChange.bind(this)}
                                            value={this.state.swapAmount}
                                        />
                                    </Col>
                                    <Col xs={4}>
                                        <DropDownMenu
                                            autoWidth={false}
                                            iconButton={<DownArrow />}
                                            iconStyle={{
                                                top: -5,
                                                right: 0,
                                                fill: 'white'
                                            }}
                                            labelStyle={{
                                                height: 42,
                                                lineHeight: '42px',
                                                fontWeight: '600',
                                                color: '#2f3245',
                                                textAlign: 'center',
                                                paddingLeft: 0,
                                                paddingRight: 24
                                            }}
                                            style={{
                                                backgroundColor: '#b6c0cc',
                                                height: 42,
                                                width: '100%'
                                            }}
                                            value={this.state.selectedToken}
                                            menuItemStyle={{ width: '100%' }}
                                            onChange={this.swapChange.bind(this)}
                                        >
                                            {this.state.tokens.length !== 0 ?
                                                this.state.tokens.map((token) =>

                                                    <MenuItem
                                                        value={token.symbol}
                                                        primaryText={token.symbol}
                                                    />
                                                ) : null}
                                        </DropDownMenu>
                                    </Col>
                                </Row>
                                <p style={{ textAlign: 'center', color: 'grey', fontSize: 12, fontFamily: 'Poppins' }}>Balance: {this.state.tokenBalances[this.state.selectedToken]} {this.state.selectedToken}</p>
                                <p style={{ fontSize: 16, textAlign: 'center', color: '#2c3d5b', fontWeight: 'bold', fontFamily: 'Poppins' }}>TO</p>
                                <Row style={{ width: '100%', marginTop: -12 }}>
                                    <Col xsOffset={2} xs={8}>
                                        <div style={{ backgroundColor: '#4e5565', fontFamily: 'Poppins' }}>
                                            <p style={{ fontSize: 16, color: 'white', padding: 10, letterSpacing: 1, textAlign: 'center' }}><span style={{ fontWeight: 'bold' }}>{this.state.currentSentValue * this.state.swapAmount}</span>
                                                <span style={{ fontSize: 16, color: 'white', letterSpacing: 1 }}> SENT TOKENS</span>
                                            </p>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div style={{ padding: 20, backgroundColor: '#dbdce0' }}>
                                <Row>
                                    <Col xsOffset={1} xs={5}>
                                        <TextField
                                            type="password"
                                            hintText="PASSWORD"
                                            hintStyle={{ fontSize: 16, bottom: 9, paddingLeft: 10 }}
                                            onChange={(event, password) => this.setState({ convertPass: password })}
                                            value={this.state.convertPass}
                                            underlineShow={false} fullWidth={true}
                                            inputStyle={{ padding: 10, fontWeight: 'bold', color: '#2f3245' }}
                                            style={{ height: 42, backgroundColor: '#f6f7f9' }}
                                        />
                                    </Col>
                                    <Col xs={5}>
                                        <RaisedButton
                                            label={this.state.converting ? 'CONVERTING' : 'CONVERT'}
                                            disabled={this.state.converting}
                                            onClick={this.onClickConvert.bind(this)}
                                            labelStyle={{ color: 'white', fontWeight: 'bold', fontSize: 18, letterSpacing: 2 }}
                                            fullWidth={true}
                                            buttonStyle={this.state.converting ?
                                                { backgroundColor: '#bdbdbd', height: 42, lineHeight: '42px' } :
                                                { backgroundColor: '#2e4770', height: 42, lineHeight: '42px' }}
                                            style={{ height: 42 }}
                                        />
                                    </Col>
                                </Row>
                            </div>
                        </Dialog>
                    </Grid>
                </div>
            </MuiThemeProvider>
        )
    }
}

const styles = {
    otherBalanceLogo: {
        width: 40,
        height: 40,
        margin: '1% 15%'
    },
    otherBalanceBalc: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 3
    },
    otherBalanceText: {
        color: 'grey',
        fontSize: 14,
        marginTop: -15,
        letterSpacing: 2
    },
    otherBalanceDiv: {
        padding: '6% 4%',
        paddingBottom: 0,
        backgroundColor: '#ececf1',
        marginTop: '5%',
        overflow: 'auto',
        height: 265
    },
    questionMark: {
        marginLeft: 10,
        fontSize: 13,
        borderRadius: '50%',
        backgroundColor: '#2f3245',
        paddingLeft: 6,
        paddingRight: 6,
        color: 'white'
    },
    formHeading: {
        fontSize: 16,
        fontWeight: 600,
        color: '#253245',
        letterSpacing: 2
    }
}

export default SendNew;