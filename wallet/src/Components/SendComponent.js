import React, { Component } from 'react';
import { MuiThemeProvider, Snackbar, DropDownMenu, MenuItem, FlatButton, TextField } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { transferAmount, isOnline, payVPNUsage, getGasPrice } from '../Actions/AccountActions';
import { getPrivateKey, ethTransaction, tokenTransaction, getGasCost } from '../Actions/TransferActions';
import { purple500 } from 'material-ui/styles/colors';
import ReactTooltip from 'react-tooltip';
var config = require('../config');


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
      session_id: null
    };
  }

  componentWillMount = () => {
    //this.getGas()
  }

  getGas = () => {
    var that = this;
    getGasPrice(function (error, gasPrice) {
      if (error) console.log(error.message)
      else {
        var gas = parseFloat(gasPrice * 21000).toFixed(9);
        that.setState({ gas: gas });
      }
    })
  }

  openInExternalBrowser(url) {
    shell.openExternal(url);
    this.setState({ tx_addr: null })
  };

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
      this.getGasLimit(nextProps.amount,nextProps.to_addr,nextProps.unit);
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
    tokenTransaction(from_addr, to_addr, amount, gas, privateKey, function (data) {
      let body = {
        from_addr: self.props.local_address,
        amount: self.state.amount,
        session_id: self.state.session_id,
        tx_data: data
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
            isDisabled: true
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
    if (this.state.unit === 'ETH') {
      ethTransaction(from_addr, to_addr, amount, gas, privateKey, function (data) {
        self.mainTransaction(data)
      })
    }
    else {
      tokenTransaction(from_addr, to_addr, amount, gas, privateKey, function (data) {
        self.mainTransaction(data)
      })
    }
  }

  mainTransaction(tx_data) {
    console.log("Main")
    let self = this;
    transferAmount(tx_data, function (err, tx_addr) {
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
          this.openInExternalBrowser(`${config.statusUrl}/tx/${this.state.tx_addr}`)
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
          minHeight: 450,
          backgroundColor: '#c3deea',
          margin: 15,
          padding: '5%'
        }}>
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
            <Row style={{ marginBottom: 15 }}>
              <Col xs={3}>
                <span>Amount</span>
                <span data-tip data-for="amountField" style={styles.questionMark}>?</span>
              </Col>
              <Col xs={6}>
                <TextField
                  type="number"
                  style={{ backgroundColor: '#FAFAFA', height: 30 }} underlineShow={false}
                  fullWidth={true}
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
                    color: purple500
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
                    primaryText="ETH"
                  />
                  <MenuItem
                    value="SENT"
                    primaryText="SENT"
                  />
                </DropDownMenu>
              </Col>
            </Row>
            <Row style={{ marginBottom: 15 }}>
              <Col xs={3}>
                <span>Gas</span>
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
                {/* <span style={{backgroundColor:'white',padding:3.5,paddingRight:23}}>ETHS</span> */}
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
            <Row style={{ marginBottom: 15 }}>
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
              <span>Total Ethereum Tokens that you want to send as Gas</span>
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
              onActionClick={() => { this.openInExternalBrowser(`https://${config.statusUrl}/tx/${this.state.tx_addr}`) }}
            />
            <Snackbar
              open={this.state.snackOpen}
              message={this.state.snackMessage}
              autoHideDuration={10000}
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
                  { backgroundColor: '#f05e09', marginLeft: 20 }
              }
              labelStyle={{ paddingLeft: 10, paddingRight: 10, fontWeight: '600', color: '#FAFAFA' }}
            />
          </div>
          {/* {this.state.tx_addr == null ? '' :  this.openSnackBar() } */}
        </div>
        <div>
        </div>
      </MuiThemeProvider>
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
