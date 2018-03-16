import React, { Component } from 'react';
import { MuiThemeProvider, Snackbar, DropDownMenu, MenuItem, FlatButton, TextField } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { transferAmount, isOnline, payVPNUsage, getFreeAmount } from '../Actions/AccountActions';
import { getPrivateKey, ethTransaction, tokenTransaction, getGasCost } from '../Actions/TransferActions';
import { purple500 } from 'material-ui/styles/colors';
import ReactTooltip from 'react-tooltip';
import Slider from 'material-ui/Slider';
import { sendError } from '../helpers/ErrorLog';
var config = require('../config');

let statusUrl;
let shell = window
  .require('electron')
  .shell;

class SendComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keystore: '',
      to_address: '',
      amount: '',
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
      snackMessage: '',
      isDisabled: true,
      isInitial: true,
      transactionStatus: '',
      session_id: null,
      textDisabled: false,
      sliderValue: 20
    };
  }

  componentWillMount = () => {
    //this.getGas()
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
      if (nextProps.session_id === -1)
        this.setState({ textDisabled: true })
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
        self.props.clearSend();
        if (err) {
          self.setState({
            snackOpen: true,
            snackMessage: err.message,
            to_address: '',
            amount: '',
            session_id: null,
            unit: 'ETH',
            password: '',
            sending: false,
            isDisabled: true,
            textDisabled: false
          });
        }
        else {
          self.clearFields(tx_addr)
        }
      });
    })
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
      isDisabled: true,
      textDisabled: false
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
      this.setState({ sending: false, snackOpen: true, snackMessage: 'Amount field is Empty' })
    }
    else if (this.state.password === '') {
      this.setState({ sending: false, snackOpen: true, snackMessage: 'Password field is Empty' })
    }
    else {
      if (isOnline()) {
        this.setState({
          isDisabled: true,
          sending: true
        });
        setTimeout(function () {
          getPrivateKey(self.state.password, function (err, privateKey) {
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
        this.setState({ snackOpen: true, snackMessage: 'Check your Internet Connection' })
      }
    }
  }

  renderLink() {
    return (
      <div>
        Your Transaction is Placed Successfully. Check Status <a onClick={() => {
          statusUrl = this.getStatusUrl();
          this.openInExternalBrowser(`${statusUrl}/tx/${this.state.tx_addr}`)
        }} style={{ color: '#1d400' }}>Here</a>
      </div>
    )
  }

  openSnackBar = () => this.setState({
    snackMessage: 'Your Transaction is Placed Successfully.',
    openSnack: true
  })

  amountChange = (event, amount) => {
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
    if (unit === 'ETH') amount = amount * Math.pow(10, 18)
    else amount = amount * Math.pow(10, 8)
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
    this.setState({ unit });
    let trueAddress = this.state.to_address.match(/^0x[a-zA-Z0-9]{40}$/)
    if (trueAddress !== null && this.state.amount !== '') {
      this.getGasLimit(this.state.amount, this.state.to_address, unit)
    }
  };
  render() {
    return (
      <MuiThemeProvider>
        <div style={{
          minHeight: 530,
          backgroundColor: '#c3deea',
          padding: '5%'
        }}>
          <FlatButton
            label="Get Free Amount"
            labelStyle={{ paddingLeft: 10, paddingRight: 10, fontWeight: '600', fontSize: 12, color: '#FAFAFA' }}
            onClick={this.getFree.bind(this)}
            disabled={!this.props.isTest}
            style={{
              backgroundColor: this.props.isTest ? '#2f3245' : 'rgba(47, 50, 69, 0.34)',
              position: 'absolute', right: 0, marginTop: -30, marginRight: 60
            }}
          />
          <Grid>
            <Row style={{ marginBottom: 15, paddingTop: 20 }}>
              <Col xs={3}>
                <span>To</span>
                <span data-tip data-for="toField" style={styles.questionMark}>?</span>
              </Col>
              <Col xs={9}>
                <TextField
                  hintText="Ex:0x6b6df9e25f7bf233435c1a52a7da4c4a64f5769e"
                  hintStyle={{ bottom: 0, paddingLeft: '2%' }}
                  style={{ backgroundColor: '#FAFAFA', height: 30 }}
                  underlineShow={false} fullWidth={true}
                  onChange={this.addressChange.bind(this)}
                  value={this.state.to_address}
                  inputStyle={{ padding: 10 }}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 15, height: 30 }}>
              <Col xs={3}>
                <span>Amount</span>
                <span data-tip data-for="amountField" style={styles.questionMark}>?</span>
              </Col>
              <Col xs={6}>
                <TextField
                  type="number"
                  style={{ backgroundColor: '#FAFAFA', height: 30 }} underlineShow={false}
                  fullWidth={true}
                  disabled={this.state.textDisabled}
                  inputStyle={{ padding: 10 }}
                  onChange={this.amountChange.bind(this)} value={this.state.amount} />
              </Col>
              <Col xs={3}>
                <DropDownMenu
                  autoWidth={true}
                  iconStyle={{
                    top: -6
                  }}
                  labelStyle={{
                    height: 30,
                    lineHeight: '30px',
                    fontWeight: '600',
                    color: '#2f3245'
                  }}
                  style={{
                    backgroundColor: '#FAFAFA',
                    height: 30,
                    width: '100%'
                  }}
                  value={this.state.unit}
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
            <Row style={{ marginBottom: 15, height: 30 }}>
              <Col xs={3}>
                <span>Gas Limit</span>
                <span data-tip data-for="gasField" style={styles.questionMark}>?</span>
              </Col>
              <Col xs={9}>
                <TextField
                  type="number"
                  style={{ backgroundColor: '#FAFAFA', height: 30, width: '100%' }}
                  underlineShow={false} fullWidth={true}
                  inputStyle={{ padding: 10, color: '#666' }}
                  onChange={(event, gas) => this.setState({ gas })}
                  value={this.state.gas}
                />
              </Col>
            </Row>
            {/* <Row style={{ marginBottom: 15 }}>
              <Col xs={3}>
                <span>Message/Note</span>
                <span data-tip data-for="messageField" style={styles.questionMark}>?</span>
              </Col>
              <Col xs={9}>
                <TextField
                  style={{ backgroundColor: '#FAFAFA', height: 30 }}
                  underlineShow={false} fullWidth={true}
                  inputStyle={{ padding: 10 }}
                  onChange={(event, data) => this.setState({ data })} value={this.state.data} />
              </Col>
            </Row> */}
            <Row style={{ marginBottom: 15, height: 30 }}>
              <Col xs={3}>
                <span >Password</span>
                <span data-tip data-for="passwordField" style={styles.questionMark}>?</span>
              </Col>
              <Col xs={9}>
                <TextField
                  type="password"
                  style={{ backgroundColor: '#FAFAFA', height: 30 }}
                  underlineShow={false} fullWidth={true}
                  inputStyle={{ padding: 10 }}
                  onChange={(event, password) => this.setState({ password })} value={this.state.password} />
              </Col>
            </Row>
            <Row style={{ marginBottom: 15, height: 30 }}>
              <Col xs={3}>
                <span>Gas Price</span>
                <span data-tip data-for="gasPrice" style={styles.questionMark}>?</span>
              </Col>
              <Col xs={4}>
                <Slider
                  min={1}
                  max={99}
                  step={1}
                  value={this.state.sliderValue}
                  onChange={this.handleSlider}
                  sliderStyle={{ color: '#532d91', marginBottom: 0, marginTop: 2, height: 'auto', width: '80%' }}
                />
              </Col>
              <Col xs={2} style={{ marginLeft: -50 }}>
                <span >{this.state.sliderValue} Gwei</span>
              </Col>
            </Row>
          </Grid>
          <div>
            <ReactTooltip id="toField" place="bottom">
              <span>Wallet Address that you want to send Sentinel Tokens to</span>
            </ReactTooltip>
            <ReactTooltip id="amountField" place="bottom">
              <span>Total Ethereum/Sentinel Tokens<br />
                that you want to send to. <br />
                Yes, this wallet can<br /> hold Ethereum too.</span>
            </ReactTooltip>
            <ReactTooltip id="gasField" place="bottom">
              <span>21000 is the default gas limit</span>
            </ReactTooltip>
            <ReactTooltip id="gasPrice" place="bottom">
              <span>Amount you pay per unit of gas</span>
            </ReactTooltip>
            <ReactTooltip id="messageField" place="bottom">
              <span>A message that you might want to add as a transaction note</span>
            </ReactTooltip>
            <ReactTooltip id="passwordField" place="bottom">
              <span>Your Sentinel AUID Password</span>
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
          </div>
          <div>
            <FlatButton disabled={this.state.to_address === '' || this.state.sending || this.state.isDisabled ? true : false}
              onClick={this.onClickSend.bind(this)}
              label={this.state.sending === null || this.state.sending === false ? "Send" : "Sending..."}
              style={
                this.state.to_address === '' || this.state.sending === true || this.state.isDisabled === true ?
                  { backgroundColor: '#bdbdbd', marginLeft: 20 }
                  :
                  { backgroundColor: '#2f3245', marginLeft: 20 }
              }
              labelStyle={{ paddingLeft: 10, paddingRight: 10, fontWeight: '600', color: '#FAFAFA' }}
            />
          </div>
          {/* {this.state.tx_addr == null ? '' :  this.openSnackBar() } */}
        </div>
        <div>
        </div>
      </MuiThemeProvider >
    );
  }
}

const styles = {
  questionMark: {
    marginLeft: 3,
    fontSize: 12,
    borderRadius: '50%',
    backgroundColor: '#4d9bb9',
    paddingLeft: 5,
    paddingRight: 5,
    color: 'white'
  }
}
export default SendComponent;
