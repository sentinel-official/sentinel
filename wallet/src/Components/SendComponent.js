import React, { Component } from 'react';
import { MuiThemeProvider, Snackbar, DropDownMenu, MenuItem, FlatButton, TextField } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { transferAmount, getAccount, isOnline, transferAmountMaster, getTransactionStatus } from '../Actions/AccountActions';
import { purple500 } from 'material-ui/styles/colors';
import ReactTooltip from 'react-tooltip';


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
      gas: '',
      data: '',
      priv_key: '',
      file: '',
      unit: 'ETH',
      tx_addr: null,
      password: '',
      sending: null,
      openSnack: false,
      snackOpen: false,
      snackMessage: '',
      isDisabled: true,
      isInitial: true,
      transactionStatus:'',
      session_id: null
    };
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
        session_id: nextProps.session_id
      })
      this.props.propReceiveChange()
      if (this.state.to !== '') {
        this.setState({ isDisabled: false })
      }
      else {
        this.setState({ isDisabled: false })
      }
    }
  }

  sendToMaster = () => {
    let body = {
      from_addr: this.props.local_address,  
      to_addr: this.state.to_address,
      amount: this.state.amount,
      unit: this.state.unit,
      keystore: this.state.keystore,
      password: this.state.password,
      session_id: null
    }
    let that = this;
    transferAmountMaster(body, function (err, tx_addr) {
      if (err) that.setState(
        {
          snackOpen: true,
          snackMessage: err.message,
          tx_addr: tx_addr,
          to_address: '',
          amount: '',
          gas: '',
          data: '',
          session_id: null,
          unit: 'ETH',
          password: '',
          sending: false,
          isDisabled: true
        });
      else {
        that.sendToTest();
      }
    });
  }

  sendToTest = () => {
    let body = {
      from_addr: this.props.local_address,
      to_addr: this.state.to_address,
      amount: this.state.amount,
      unit: this.state.unit,
      keystore: this.state.keystore,
      password: this.state.password,
      session_id: this.state.session_id,
    }
    let that = this;
    transferAmount(body, function (err, tx_addr) {
      that.props.clearSend();
      if (err) that.setState(
        {
          snackOpen: true,
          snackMessage: err.message,
          tx_addr: tx_addr,
          to_address: '',
          amount: '',
          gas: '',
          data: '',
          session_id: null,
          unit: 'ETH',
          password: '',
          sending: false,
          isDisabled: true
        });
      else {
        that.setState({
          tx_addr: tx_addr,
          openSnack: true,
          to_address: '',
          amount: '',
          gas: '',
          session_id: null,
          data: '',
          unit: 'ETH',
          password: '',
          sending: false,
          isDisabled: true
        })
      }
    });
  }

  onClickSend = () => {
    if (this.state.amount === '') {
      this.setState({ sending: false, snackOpen: true, snackMessage: 'Amount field is Empty' })
    }
    else if (this.state.password === '') {
      this.setState({ sending: false, snackOpen: true, snackMessage: 'Password field is Empty' })
    }
    else {
      if (isOnline()) {
        this.setState({
          sending: true,
          isDisabled: true
        })
        if (this.state.session_id === null) {
          this.sendToTest()
        }
        else {
          this.sendToMaster()
        }
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
          this.openInExternalBrowser(`https://etherscan.io/tx/${this.state.tx_addr}`)
        }} style={{ color: '#1d400' }}>Here</a>
      </div>
    )
  }

  openSnackBar = () => this.setState({
    snackMessage: 'Your Transaction is Placed Successfully.',
    openSnack: true
  })


  snackRequestClose = () => {
    this.setState({
      openSnack: false,
      snackOpen: false
    });
  };

  handleChange = (event, index, unit) => this.setState({ unit });
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
                  onChange={(event, to_address) => this.setState({ to_address: to_address, isDisabled: false })}
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
                <TextField type="number"
                  style={{ backgroundColor: '#FAFAFA', height: 30 }} underlineShow={false}
                  fullWidth={true}
                  inputStyle={{ padding: 10 }}
                  onChange={(event, amount) => this.setState({ amount })} value={this.state.amount} />
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
            {/* <Row style={{ marginBottom: 15 }}>
              <Col xs={3}>
                <span>Gas</span>
                <span data-tip data-for="gasField" style={styles.questionMark}>?</span>
              </Col>
              <Col xs={9}>
                <TextField
                  type="number"
                  style={{ backgroundColor: '#FAFAFA', height: 30 }}
                  underlineShow={false} fullWidth={true}
                  onChange={(event, gas) => this.setState({ gas })} value={this.state.gas} />
              </Col>
            </Row> */}
            <Row style={{ marginBottom: 15 }}>
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
            </Row>
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
            {this.state.session_id !== null ?
              <Row style={{ marginBottom: 15 }}>
                <Col xs={3}>
                  <span >Session ID:</span>
                </Col>
                <Col xs={9}>
                  <span>{this.state.session_id}</span>
                </Col>
              </Row>
              :
              <span></span>
            }

          </Grid>
          <div>
            <ReactTooltip id="toField" place="bottom">
              <span>Sentinel Wallet ID that you want to send Sentinel Tokens to</span>
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
              action="Transaction Placed. Check Status"
              onActionClick={() => { this.openInExternalBrowser(`https://etherscan.io/tx/${this.state.tx_addr}`) }}
            />
            <Snackbar
              open={this.state.snackOpen}
              message={this.state.snackMessage}
              autoHideDuration={10000}
              onRequestClose={this.snackRequestClose}
            />
          </div>
          <div>
            <FlatButton disabled={this.state.to_address == '' || this.state.sending || this.state.isDisabled ? true : false}
              onClick={this.onClickSend.bind(this)} label={this.state.sending === null || this.state.sending === false ? "Send" : "Sending..."}
              style={
                this.state.to_address === '' || this.state.sending || this.state.isDisabled ? { backgroundColor: '#bdbdbd', marginLeft: 20 }
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
