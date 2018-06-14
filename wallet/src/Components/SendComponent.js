import React, { Component } from 'react';
import { MuiThemeProvider, Snackbar, DropDownMenu, MenuItem, RaisedButton, TextField, Slider, FlatButton, Dialog } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import DownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';
import TransIcon from 'material-ui/svg-icons/action/swap-horiz';
import RightArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  transferAmount, isOnline, payVPNUsage, getAvailableTokens, sendError, getTokenBalance,
  getSentValue, getSentTransactionHistory, swapRawTransaction, swapPivx
} from '../Actions/AccountActions';
import { getPrivateKey, ethTransaction, tokenTransaction, getGasCost, swapTransaction } from '../Actions/TransferActions';
import ReactTooltip from 'react-tooltip';
import CopyToClipboard from 'react-copy-to-clipboard';
var config = require('../config');
var lang = require('./language');
let scientificToDec = require('scientific-to-decimal');

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

class SendComponent extends Component {
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
      converting: false,
      logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
      testDisabled: false,
      pivxScreenToAddr: '',
      pivxScreenAmount: 0,
      pivxScreenExpctd: 0,
      pivxTokenDetails: [],
      pivxSendAddr: '',
      showAddress: false,
      isPivxDisabled: true,
      showTransPivxScreen: false,
      pivxOption: 1,
      isFromPivx: true,
      isEthIn: false,
      pivxScreenPwd: '',
      isPivxSend: false
    };
  }

  componentWillMount = () => {
    //this.getGas()
    this.getTokensList();
  }

  componentDidCatch(error, info) {
    sendError(error);
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
      this.props.propReceiveChange()
      if (nextProps.to_addr !== '') {
        this.getGasLimit(nextProps.amount, nextProps.to_addr, nextProps.unit);
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
      this.setState({ snackOpen: true, snackMessage: 'Please send 100 SENTS', sending: false, isDisabled: false })
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
      ethTransaction(from_addr, to_addr, amount, gas_price, gas, privateKey, false, function (data) {
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

  pivxAddressChange = (event, to_addr) => {
    if (this.state.isFromPivx) {
      this.setState({ pivxScreenToAddr: to_addr })
      let trueAddress = to_addr.match(/^0x[a-zA-Z0-9]{40}$/)
      if (trueAddress !== null) {
        this.setState({ isPivxDisabled: false })
      }
      else {
        this.setState({ isPivxDisabled: true })
      }
    }
    else {
      this.setState({ pivxScreenToAddr: to_addr })
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
    let amount;
    if (unit === 'ETH') amount = (unit !== this.state.unit) ? this.state.amount * Math.pow(10, 10) : this.state.amount;
    else amount = (unit !== this.state.unit) ? this.state.amount / Math.pow(10, 10) : this.state.amount;
    this.setState({ amount: amount, unit: unit });
    let trueAddress = this.state.to_address.match(/^0x[a-zA-Z0-9]{40}$/)
    if (trueAddress !== null && amount !== '') {
      this.getGasLimit(amount, this.state.to_address, unit)
    }
  };

  handleClose = () => {
    this.setState({ showTransScreen: false });
  };

  handleTransClose = () => {
    this.setState({ showTransPivxScreen: false });
  };

  getTokensList = () => {
    let self = this;
    getAvailableTokens(function (err, tokens) {
      if (err) { }
      else {
        let tokensList = tokens.filter((token) => (token.symbol !== 'SENT' && token.symbol !== 'PIVX'));
        let pivxToken = tokens.filter((token) => token.symbol === 'PIVX');
        self.setState({ tokens: tokensList, pivxTokenDetails: pivxToken })
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
      obj[token.symbol] = this.props.balance.eths !== 'Loading' ? this.props.balance.eths.toFixed(8) : 'Loading';
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
    let token = this.state.tokens.find(obj => obj.symbol === unit);
    this.setState({ selectedToken: unit, logoUrl: token.logo_url ? token.logo_url : '../src/Images/default.png' });
    this.getCompareValue(unit);
  };

  getCompareValue = (symbol) => {
    let token = this.state.tokens.find(obj => obj.symbol === symbol);
    if (token) {
      let self = this;
      let value = 10 ** token.decimals;
      getSentValue(token.symbol, 'SENT', value, 8, function (err, swapValue) {
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

  pivxValueChange = (event, value) => {
    if (this.state.isFromPivx) {
      this.setState({ pivxScreenAmount: value, showAddress: false });
      if (value !== '') this.getPivxCompareValue('PIVX', this.state.isEthIn ? 'ETH' : 'SENT', value, this.state.isEthIn ? 18 : 8);
    } else {
      this.setState({ pivxScreenAmount: value, showAddress: false });
      if (value !== '') {
        if (this.state.isEthIn) {
          value = scientificToDec(value * (10 ** 18));
          this.getPivxCompareValue('ETH', 'PIVX', value, 0);
        }
        else {
          value = scientificToDec(value * (10 ** 8));
          this.getPivxCompareValue('SENT', 'PIVX', value, 0);
        }
      };
    }
  }

  getPivxCompareValue = (from, to, value, decimals) => {
    let self = this;
    getSentValue(from, to, value, decimals, function (err, swapValue) {
      if (err) { }
      else {
        self.setState({ pivxScreenExpctd: swapValue });
      }
    })
  }

  onClickPivxConvert = () => {
    let self = this;
    let to = this.state.isEthIn ? 'ETH' : 'SENT';
    this.setState({ isPivxSend: true })
    swapPivx(this.state.pivxScreenToAddr, 'PIVX', to, function (err, address) {
      if (err) { isPivxSend: false }
      else {
        self.setState({
          pivxSendAddr: address, showAddress: true, pivxScreenAmount: 0, isPivxSend: false,
          pivxScreenToAddr: self.props.local_address, pivxScreenExpctd: 0, isPivxDisabled: false
        });
      }
    })
  }

  handlePivxMenuChange = (event, index, value) => {
    if (value === 1 || value === 2)
      this.setState({
        pivxOption: value, isFromPivx: true, isEthIn: value === 2, isPivxSend: false,
        pivxScreenToAddr: '', pivxScreenAmount: 0, pivxScreenExpctd: 0, isPivxDisabled: true
      });
    else
      this.setState({
        pivxOption: value, isFromPivx: false, isEthIn: value === 4, isPivxSend: false,
        pivxScreenToAddr: '', pivxScreenAmount: 0, pivxScreenExpctd: 0, isPivxDisabled: true
      });
  }

  onClickConvert = () => {
    let self = this;
    if (this.state.convertPass === '') {
      this.setState({ sending: false, snackOpen: true, snackMessage: lang[this.props.lang].PasswordEmpty })
    }
    else if (parseFloat(this.state.currentSentValue * this.state.swapAmount) > 10000) {
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
              let token = self.state.tokens.find(o => o.symbol === self.state.selectedToken);
              let ether_address = (self.state.tokens.find(o => o.symbol === 'ETH'))['address'];
              swapTransaction(self.props.local_address, ether_address, token.address,
                self.state.swapAmount * (10 ** (token.decimals)), privateKey,
                self.state.selectedToken, function (err, data) {
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

  onClickPivxTrans = () => {
    let self = this;
    if (this.state.pivxScreenPwd === '') {
      this.setState({ snackOpen: true, snackMessage: lang[this.props.lang].PasswordEmpty })
    }
    else {
      this.setState({ isPivxSend: true });
      setTimeout(function () {
        getPrivateKey(self.state.pivxScreenPwd, self.props.lang, function (err, privateKey) {
          if (err) {
            self.setState({
              snackOpen: true,
              snackMessage: err.message,
              isPivxSend: false
            })
          }
          else {
            let from_addr = self.props.local_address;
            let amount = self.state.pivxScreenAmount;
            let gas_price = 20 * (10 ** 9)
            let ether_address = (self.state.tokens.find(o => o.symbol === 'ETH'))['address'];
            if (self.state.isEthIn) {
              ethTransaction(from_addr, ether_address, amount, gas_price, 100000, privateKey, true, function (data) {
                swapRawTransaction(data, self.state.pivxScreenToAddr, 'ETH', 'PIVX', function (err, txHash) {
                  if (err) {
                    self.setState({
                      snackOpen: true,
                      snackMessage: err.message,
                      isPivxSend: false
                    })
                  }
                  else {
                    self.props.getCurrentSwapHash(txHash);
                    self.setState({
                      pivxScreenPwd: '',
                      openSnack: true,
                      tx_addr: txHash,
                      isPivxSend: false
                    })
                  }
                })
              })
            }
            else {
              tokenTransaction(from_addr, ether_address, amount * (10 ** 8), gas_price, 100000, privateKey, function (data) {
                swapRawTransaction(data, self.state.pivxScreenToAddr, 'SENT', 'PIVX', function (err, txHash) {
                  if (err) {
                    self.setState({
                      snackOpen: true,
                      snackMessage: err.message,
                      isPivxSend: false
                    })
                  }
                  else {
                    self.props.getCurrentSwapHash(txHash);
                    self.setState({
                      pivxScreenPwd: '',
                      openSnack: true,
                      tx_addr: txHash,
                      isPivxSend: false
                    })
                  }
                })
              })
            }
          }
        })
      }, 500);
    }
  }

  render() {
    let self = this;
    if (!this.state.isGetBalanceCalled) {
      setInterval(function () {
        self.getTokensList()
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
                <p style={{ fontSize: 16, fontWeight: 600, color: '#253245', letterSpacing: 2 }}>{lang[language].TokenBal}</p>
                <div style={{ padding: '6% 4%', paddingBottom: 0, backgroundColor: '#ececf1', height: 85 }}>
                  <Row>
                    <Col xs={4}>
                      <img src={'../src/Images/logo.svg'} alt="logo" style={{ width: 50, height: 50, margin: '1% 10%' }} />
                    </Col>
                    <Col xs={8}>
                      <p style={{
                        fontSize: 18, fontWeight: 'bold', letterSpacing: 3, whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis', width: 150, overflow: 'hidden'
                      }} data-tip data-for="sentsBal">
                        {this.props.balance.sents !== 'Loading' ? this.props.balance.sents.toFixed(8) : 'Loading'}
                      </p>
                      <p style={{ color: 'grey', marginTop: -15, letterSpacing: 2, wordBreak: 'break-all' }}>Sentinel [SENT]</p>
                    </Col>
                    <ReactTooltip id="sentsBal" place="bottom">
                      <span>{this.props.balance.sents !== 'Loading' ? this.props.balance.sents.toFixed(8) : 'Loading'}</span>
                    </ReactTooltip>
                  </Row>
                </div>
                <div style={styles.otherBalanceDiv}>
                  {this.state.tokens.length !== 0 ?
                    this.state.tokens.map((token) =>
                      <Row>
                        <Col xs={4}>
                          <img src={token.logo_url ? token.logo_url : '../src/Images/default.png'} alt="logo" style={styles.otherBalanceLogo} />
                        </Col>
                        <Col xs={8}>
                          <p style={styles.otherBalanceBalc}>{this.state.tokenBalances[token.symbol] ? this.state.tokenBalances[token.symbol] : 0}</p>
                          <p style={styles.otherBalanceText}>{token.name} [{token.symbol}]</p>
                        </Col>
                      </Row>
                    )
                    :
                    <div>
                      <p style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginTop: '35%' }}>
                        No Tokens Found
                                            </p>
                    </div>
                  }
                  {this.state.pivxTokenDetails.length !== 0 ?
                    this.state.pivxTokenDetails.map((token) =>
                      <Row style={{ cursor: this.props.isTest ? 'not-allowed' : 'pointer', backgroundColor: '#badee4', paddingTop: 5 }}
                        onClick={() => { if (!this.props.isTest) this.setState({ showTransPivxScreen: true, showAddress: false, isPivxSend: false }); }}>
                        <Col xs={4}>
                          <img src={token.logo_url ? token.logo_url : '../src/Images/default.png'} alt="logo" style={styles.otherBalanceLogo} />
                        </Col>
                        <Col xs={8}>
                          {/* <p style={styles.otherBalanceBalc}>{this.state.tokenBalances[token.symbol] ? this.state.tokenBalances[token.symbol] : 0}</p> */}
                          <p style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            letterSpacing: 3,
                            wordBreak: 'break-all',
                            marginTop: 10
                          }}>{token.name} [{token.symbol}]</p>
                        </Col>
                      </Row>
                    )
                    : null}
                </div>
              </Col>
              <Col xs={8} style={{ padding: '3% 5% 0px' }}>
                <div>
                  <span style={styles.formHeading}>{lang[language].SendTo}</span>
                  <span data-tip data-for="toField" style={styles.questionMark}>?</span>
                  <TextField
                    hintText="Ex:0x93186402811baa5b188a14122C11B41dA0099844"
                    hintStyle={{ bottom: 8, paddingLeft: 10, letterSpacing: 2 }}
                    style={{ backgroundColor: '#d4dae2', height: 42, marginTop: 15 }}
                    underlineShow={false} fullWidth={true}
                    onChange={this.addressChange.bind(this)}
                    value={this.state.to_address}
                    inputStyle={styles.textInputStyle}
                  />
                </div>
                <div style={{ marginTop: '5%' }}>
                  <span style={styles.formHeading}>{lang[language].AmountTo}</span>
                  <span data-tip data-for="amountField" style={styles.questionMark}>?</span>
                  <Row>
                    <Col xs={8}>
                      <TextField
                        type="number"
                        underlineShow={false} fullWidth={true}
                        inputStyle={styles.textInputStyle}
                        style={styles.textStyle}
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
                        iconStyle={styles.dropDownIconStyle}
                        labelStyle={styles.dropDownLabelStyle}
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
                      <span style={styles.formHeading}>{lang[language].GasLimit}</span>
                      <span data-tip data-for="gasField" style={styles.questionMark}>?</span>
                      <TextField
                        type="number"
                        style={styles.textStyle}
                        underlineShow={false} fullWidth={true}
                        inputStyle={styles.textInputStyle}
                        onChange={(event, gas) => this.setState({ gas })}
                        value={this.state.gas}
                      />
                    </Col>
                    <Col xsOffset={1} xs={7}>
                      <span style={styles.formHeading}>{lang[language].GasPrice}</span>
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
                  label={lang[language].ConvertERC}
                  labelStyle={styles.buttonLabelStyle}
                  fullWidth={true}
                  disabled={this.props.isTest || this.state.tokens.length === 0}
                  onClick={() => {
                    this.setState({ showTransScreen: true });
                    this.getCompareValue(this.state.selectedToken);
                  }}
                  icon={<TransIcon style={{ marginLeft: 0, height: 36, width: 36 }} />}
                  buttonStyle={this.props.isTest || this.state.tokens.length === 0 ?
                    styles.disabledButtonStyle : styles.enabledButtonStyle}
                  style={{ height: 48 }}
                />
              </Col>
              <Col xs={8} style={{ padding: '0% 5%' }}>
                <Row>
                  <Col xs={6} style={{ marginTop: -35 }}>
                    <span style={styles.formHeading}>{lang[language].Password}</span>
                    <span data-tip data-for="passwordField" style={styles.questionMark}>?</span>
                    <TextField
                      type="password"
                      onChange={(event, password) => this.setState({ password })}
                      value={this.state.password}
                      underlineShow={false} fullWidth={true}
                      inputStyle={styles.textInputStyle}
                      style={{ backgroundColor: '#d4dae2', height: 48, marginTop: 10 }}
                    />
                  </Col>
                  <Col xsOffset={1} xs={5}>
                    <RaisedButton
                      disabled={this.state.to_address === '' || this.state.sending || this.state.isDisabled ? true : false}
                      onClick={this.onClickSend.bind(this)}
                      label={this.state.sending === null || this.state.sending === false ? lang[language].Send : "Sending..."}
                      labelStyle={styles.buttonLabelStyle}
                      fullWidth={true}
                      buttonStyle={
                        this.state.to_address === '' || this.state.sending === true || this.state.isDisabled === true ?
                          styles.disabledButtonStyle : styles.enabledButtonStyle
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
                <p style={{ textAlign: 'center', padding: 10, color: 'black', fontSize: 14, letterSpacing: 1 }}>{lang[language].ExchangeERC}</p>
              </div>
              <div style={{ backgroundColor: '#435e8d', marginTop: -16 }}>
                <p style={{ textAlign: 'center', padding: 30 }}>
                  <Row>
                    <Col xsOffset={3} xs={1}>
                      <img src={this.state.logoUrl} alt="logo" style={{ height: 70, width: 70 }} />
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
                <p style={{ fontSize: 16, textAlign: 'center', color: '#2c3d5b', fontWeight: 'bold' }}>{lang[language].Convert}</p>
                <Row style={{ width: '100%', marginTop: -12 }}>
                  <Col xsOffset={2} xs={4}>
                    <TextField
                      type="number"
                      underlineShow={false} fullWidth={true}
                      inputStyle={styles.textInputStyle}
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
                      iconStyle={styles.dropDownIconStyle}
                      labelStyle={styles.dropDownLabelStyle}
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
                      inputStyle={styles.textInputStyle}
                      style={{ height: 42, backgroundColor: '#f6f7f9' }}
                    />
                  </Col>
                  <Col xs={5}>
                    <RaisedButton
                      label={this.state.converting ? 'CONVERTING' : lang[language].Convert}
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
            < Dialog
              contentStyle={{ width: 700 }}
              bodyStyle={{ padding: '5%' }}
              open={this.state.showTransPivxScreen}
              onRequestClose={this.handleTransClose}
            >
              <div style={{ marginBottom: 10, display: this.state.showAddress ? 'none' : 'inline' }}>
                <span style={{ fontWeight: 'bold', color: '#253245' }}>Swap on PIVX Tokens</span>
                <DropDownMenu value={this.state.pivxOption}
                  autoWidth={false}
                  underlineStyle={{ border: 0 }}
                  labelStyle={{ color: '#253245', fontWeight: 'bold' }}
                  menuStyle={{ width: 'auto' }}
                  style={{ position: 'absolute', right: 0, marginTop: -16 }}
                  onChange={this.handlePivxMenuChange}>
                  <MenuItem value={1} primaryText="PIVX to SENT" />
                  <MenuItem value={2} primaryText="PIVX to ETH" />
                  <MenuItem value={3} primaryText="SENT to PIVX" />
                  <MenuItem value={4} primaryText="ETH to PIVX" />
                </DropDownMenu>
                <hr />
              </div>
              {this.state.isFromPivx ?
                (!this.state.showAddress ?
                  <div>
                    <span style={styles.formHeading}>How Many PIVX Tokens?</span>
                    <TextField
                      type="number"
                      underlineShow={false} fullWidth={true}
                      inputStyle={styles.textInputStyle}
                      style={styles.textStyle}
                      onChange={this.pivxValueChange.bind(this)}
                      value={this.state.pivxScreenAmount}
                      underlineShow={false} fullWidth={true}
                    />
                    <div style={{ backgroundColor: '#4e5565', fontFamily: 'Poppins', marginTop: 10, marginBottom: 10 }}>
                      <p style={{ fontSize: 16, color: 'white', padding: 10, letterSpacing: 1, textAlign: 'center' }}><span style={{ fontWeight: 'bold' }}>Expected {this.state.pivxScreenExpctd}</span>
                        <span style={{ fontSize: 16, color: 'white', letterSpacing: 1 }}>{this.state.isEthIn ? ' ETH TOKENS' : ' SENT TOKENS'}</span>
                      </p>
                    </div>
                    <span style={styles.formHeading}>{this.state.isEthIn ? 'ETH Address' : 'SENT Address'}</span>
                    <TextField
                      hintText="Example: 0x93186402811baa5b188a14122C11B41dA0099844"
                      hintStyle={{ bottom: 8, paddingLeft: 10, letterSpacing: 2 }}
                      style={{ backgroundColor: '#d4dae2', height: 42, marginTop: 15, marginBottom: 10 }}
                      underlineShow={false} fullWidth={true}
                      onChange={this.pivxAddressChange.bind(this)}
                      value={this.state.pivxScreenToAddr}
                      inputStyle={styles.textInputStyle}
                    />
                    <RaisedButton
                      disabled={this.state.pivxScreenToAddr === '' || this.state.isPivxDisabled || this.state.isPivxSend ? true : false}
                      onClick={this.onClickPivxConvert.bind(this)}
                      label={this.state.isPivxSend ? 'Swapping' : 'Swap'}
                      labelStyle={styles.buttonLabelStyle}
                      fullWidth={true}
                      buttonStyle={
                        this.state.pivxScreenToAddr === '' || this.state.isPivxDisabled || this.state.isPivxSend ?
                          styles.disabledButtonStyle : styles.enabledButtonStyle
                      }
                      style={{ height: 48 }}
                    />
                  </div>
                  :
                  <span style={{ fontWeight: 'bold' }}>Send {this.state.pivxScreenAmount} PIVX Tokens to <span style={{ color: 'green' }}>{this.state.pivxSendAddr}</span>
                    <CopyToClipboard text={this.state.pivxSendAddr}
                      onCopy={() => this.setState({
                        snackMessage: 'Copied to Clipboard Successfully',
                        snackOpen: true
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
                    </CopyToClipboard>
                    <ReactTooltip id="copyImage" place="bottom">
                      <span>Copy</span>
                    </ReactTooltip>
                  </span>
                ) :
                <div>
                  <span style={styles.formHeading}>{this.state.isEthIn ? 'How Many ETH Tokens?' : 'How Many SENT Tokens?'}</span>
                  <TextField
                    type="number"
                    underlineShow={false} fullWidth={true}
                    inputStyle={styles.textInputStyle}
                    style={styles.textStyle}
                    onChange={this.pivxValueChange.bind(this)}
                    value={this.state.pivxScreenAmount}
                    underlineShow={false} fullWidth={true}
                  />
                  <div style={{ backgroundColor: '#4e5565', fontFamily: 'Poppins', marginTop: 10, marginBottom: 10 }}>
                    <p style={{ fontSize: 16, color: 'white', padding: 10, letterSpacing: 1, textAlign: 'center' }}><span style={{ fontWeight: 'bold' }}>Expected {this.state.pivxScreenExpctd}</span>
                      <span style={{ fontSize: 16, color: 'white', letterSpacing: 1 }}> PIVX TOKENS</span>
                    </p>
                  </div>
                  <span style={styles.formHeading}>PIVX Address</span>
                  <TextField
                    hintText="Enter pivx address"
                    hintStyle={{ bottom: 8, paddingLeft: 10, letterSpacing: 2 }}
                    style={{ backgroundColor: '#d4dae2', height: 42, marginTop: 15, marginBottom: 10 }}
                    underlineShow={false} fullWidth={true}
                    onChange={this.pivxAddressChange.bind(this)}
                    value={this.state.pivxScreenToAddr}
                    inputStyle={styles.textInputStyle}
                  />
                  <Row>
                    <Col xs={6}>
                      <TextField
                        type="password"
                        hintText="KEYSTORE PASSWORD"
                        hintStyle={{ fontSize: 16, bottom: 11, paddingLeft: 10 }}
                        onChange={(event, password) => this.setState({ pivxScreenPwd: password })}
                        value={this.state.pivxScreenPwd}
                        underlineShow={false} fullWidth={true}
                        inputStyle={styles.textInputStyle}
                        style={{ height: 48, backgroundColor: '#d4dae2' }}
                      />
                    </Col>
                    <Col xs={6}>
                      <RaisedButton
                        disabled={this.state.pivxScreenToAddr === '' || this.state.isPivxSend ? true : false}
                        onClick={this.onClickPivxTrans.bind(this)}
                        label={this.state.isPivxSend ? 'Swapping' : 'Swap'}
                        labelStyle={styles.buttonLabelStyle}
                        fullWidth={true}
                        buttonStyle={
                          this.state.pivxScreenToAddr === '' || this.state.isPivxSend ?
                            styles.disabledButtonStyle : styles.enabledButtonStyle
                        }
                        style={{ height: 48 }}
                      />
                    </Col>
                  </Row>
                </div>
              }
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
    letterSpacing: 3,
    wordBreak: 'break-all'
  },
  otherBalanceText: {
    color: 'grey',
    fontSize: 14,
    marginTop: -15,
    letterSpacing: 2,
    wordBreak: 'break-all'
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
  },
  textInputStyle: {
    padding: 10,
    fontWeight: 'bold',
    color: '#2f3245'
  },
  textStyle: {
    backgroundColor: '#d4dae2',
    height: 42,
    marginTop: 12
  },
  dropDownLabelStyle: {
    height: 42,
    lineHeight: '42px',
    fontWeight: '600',
    color: '#2f3245',
    textAlign: 'center',
    paddingLeft: 0,
    paddingRight: 24
  },
  dropDownIconStyle: {
    top: -5,
    right: 0,
    fill: 'white'
  },
  buttonLabelStyle: {
    textTransform: 'none',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  disabledButtonStyle: {
    backgroundColor: '#bdbdbd',
    height: 48,
    lineHeight: '48px',
    cursor: 'not-allowed'
  },
  enabledButtonStyle: {
    backgroundColor: '#595d8f',
    height: 48,
    lineHeight: '48px'
  }
}

export default SendComponent;