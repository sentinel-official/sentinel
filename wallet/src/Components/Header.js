import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Snackbar, FlatButton, Dialog, SelectField, MenuItem, Toggle, TextField, DropDownMenu, RaisedButton } from 'material-ui';
import {
  getVPNList, connectVPN, disconnectVPN, isVPNConnected, isOnline,
  sendError, connectSocks, disconnectSocks, sendUsage, getSentValue, swapPivx
} from '../Actions/AccountActions';
import RightArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import DownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';
import VPNComponent from './VPNComponent';
import ReactTooltip from 'react-tooltip';
import CopyIcon from 'material-ui/svg-icons/content/content-copy';

let lang = require('./language');
let shell = window
  .require('electron')
  .shell;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openSnack: false,
      snackMessage: '',
      statusSnack: false,
      statusMessage: '',
      showPopUp: false,
      vpnList: [],
      selectedVPN: null,
      status: false,
      showInstruct: false,
      isMac: false,
      isSock: false,
      isTest: false,
      showPay: false,
      payAccount: '',
      testDisabled: false,
      showTransScreen: false,
      eth_address: '',
      pivxAmount: 0,
      expectedEth: 0,
      pivx_address: '',
      send_address: '',
      showAddress: false,
      isDisabled: true
    }
  }

  componentDidCatch(error, info) {
    sendError(error);
  }

  openInExternalBrowser(url) {
    shell.openExternal(url);
  }

  componentWillMount = () => {
    let that = this;
    localStorage.setItem('config', 'MAIN')
    localStorage.setItem('vpnType', 'OpenVPN')
    isVPNConnected(function (err, data) {
      if (err) { }
      else if (data) {
        that.setState({ status: true });
      }
      else {
        that.setState({ status: false });
      }
    })
  }

  componentDidMount = () => {
    let that = this;
    getVPNList(function (err, data) {
      if (err) { }
      else {
        that.setState({ vpnList: data });
      }
    })
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ status: nextProps.status, testDisabled: nextProps.testDisabled, isTest: nextProps.isTest, isSock: nextProps.isSock })
  }

  _disconnectVPN = () => {
    this.setState({ statusSnack: true, statusMessage: lang[this.props.lang].Disconnecting })
    var that = this;
    if (this.state.isSock) {
      disconnectSocks(function (err) {
        if (err) {
          that.setState({ statusSnack: false, openSnack: true, snackMessage: err.message ? err.message : 'Disconnecting Failed.' })
          that.props.onChange();
        }
        else {
          that.props.onChange();
          sendUsage(that.props.local_address, that.state.selectedVPN, null);
          that.setState({ selectedVPN: null, statusSnack: false, status: false, openSnack: true, snackMessage: lang[that.props.lang].DisconnectVPN })
        }
      });
    }
    else {
      disconnectVPN(function (err) {
        if (err) {
          that.setState({ statusSnack: false, openSnack: true, snackMessage: err.message ? err.message : 'Disconnecting Failed.' })
          that.props.onChange();
        }
        else {
          that.props.onChange();
          that.setState({ selectedVPN: null, statusSnack: false, status: false, openSnack: true, snackMessage: lang[that.props.lang].DisconnectVPN })
        }
      });
    }
  }

  addressChange = (event, to_addr) => {
    this.setState({ eth_address: to_addr })
    let trueAddress = to_addr.match(/^0x[a-zA-Z0-9]{40}$/)
    if (trueAddress !== null) {
      this.setState({ isDisabled: false })
    }
    else {
      this.setState({ isDisabled: true })
    }
  }

  handleToggle = (event, toggle) => {
    if (this.state.isTest) {
      if (isOnline()) {
        if (toggle) {
          // let that = this;
          // getVPNList(function (err, data) {
          //   if (err) console.log('Error', err);
          //   else {
          //     that.setState({ vpnList: data, showPopUp: true });
          //   }
          // })
          this.props.moveToList();
          this.setState({ openSnack: true, snackMessage: lang[this.props.lang].SelectNode })
        }
        else {
          this._disconnectVPN();
        }
      }
      else {
        this.setState({ openSnack: true, snackMessage: lang[this.props.lang].CheckInternet })
      }
    }
  };

  handleClose = () => {
    this.setState({ showPopUp: false, showPay: false });
  };

  handleTransClose = () => {
    this.setState({ showTransScreen: false });
  };

  testChange = (event, toggle) => {
    let self = this;
    if (toggle) {
      this.setState({ isTest: true })
      localStorage.setItem('config', 'TEST')
      this.props.ontestChange(true);
    }
    else {
      if (this.state.status)
        this._disconnectVPN();
      this.setState({ isTest: false, isSock: false })
      localStorage.setItem('config', 'MAIN')
      this.props.ontestChange(false);
      this.props.onsockChange(false);
    }
  }

  valueChange = (event, value) => {
    this.setState({ pivxAmount: value, showAddress: false });
    this.getCompareValue(value);
  }

  getCompareValue = (value) => {
    let self = this;
    getSentValue('PIVX', value, function (err, swapValue) {
      if (err) { console.log("Err..", err) }
      else {
        self.setState({ expectedEth: (swapValue / (10 ** 8)) });
      }
    })
  }

  sockChange = (event, index, unit) => {
    if (this.state.isTest) {
      if (unit === 'SOCKS') {
        this.setState({ isSock: true })
        localStorage.setItem('vpnType', 'socks5')
        this.props.onsockChange(true);
      }
      else {
        if (this.state.status) {
          this._disconnectVPN()
        }
        this.setState({ isSock: false })
        localStorage.setItem('vpnType', 'openvpn')
        this.props.onsockChange(false);
      }
    }
  }

  onClickConvert = () => {
    let self = this;
    swapPivx(this.state.eth_address, function (err, address) {
      if (err) { console.log("ConErr..", err) }
      else {
        self.setState({
          send_address: address, showAddress: true, pivx_address: '',
          pivxAmount: 0, eth_address: self.props.local_address, expectedEth: 0, isDisabled: true
        });
      }
    })
  }

  closeInstruction = () => {
    this.setState({ showInstruct: false });
  }

  snackRequestClose = () => {
    this.setState({
      openSnack: false
    });
  };
  render() {
    let language = this.props.lang;
    return (
      <div style={{ height: 70, background: 'linear-gradient(to right,#2f3245 65%,#3d425c 35%)' }}>
        <div>
          <Grid>
            <Row style={{ paddingTop: 10 }}>
              <Col xs={1}>
                <div>
                  <img src={'../src/Images/logo.svg'} alt="logo" style={{ width: 50, height: 50, marginLeft: 10 }} />
                </div>
              </Col>
              <Col xs={3} style={{
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div>
                  <span style={styles.basicWallet}>SENTINEL</span>
                </div>
                <Row>
                  <Col xs={8}><span
                    style={styles.walletAddress}>
                    {this.props.local_address}</span>
                  </Col>
                  <Col xs={4}>
                    <CopyToClipboard text={this.props.local_address}
                      onCopy={() => this.setState({
                        snackMessage: lang[language].Copied,
                        openSnack: true
                      })} >
                      {/* <img
                        src={'../src/Images/download.png'}
                        alt="copy"
                        data-tip data-for="copyImage"
                        style={styles.clipBoard}
                      /> */}
                      <CopyIcon
                        data-tip data-for="copyImage"
                        style={styles.clipBoard}
                      />
                    </CopyToClipboard>
                    <ReactTooltip id="copyImage" place="bottom">
                      <span>{lang[language].Copy}</span>
                    </ReactTooltip>
                  </Col>
                </Row>
              </Col>
              <Col xs={4}>
                <Row>
                  <Col xs={7}>
                    <div>
                      <Col style={styles.sentBalance}>
                        <span>{this.state.isTest ? 'TEST SENT: ' : 'SENT: '}</span>
                        <span style={styles.balanceText}>{this.props.balance.sents}</span>
                      </Col>
                      <Col style={styles.ethBalance}>
                        <span>{this.state.isTest ? 'TEST ETH: ' : 'ETH: '}</span>
                        <span style={styles.balanceText}>{this.props.balance.eths === 'Loading'
                          ? this.props.balance.eths :
                          parseFloat(this.props.balance.eths).toFixed(8)
                        }</span>
                      </Col>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <RaisedButton
                      label="PIVX=ETH"
                      primary={true}
                      labelStyle={{
                        color: '#FAFAFA',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: 14
                      }}
                      onClick={() => { this.setState({ showTransScreen: true }) }}
                      buttonStyle={{ backgroundColor: '#595d8f' }}
                    // style={styles.buttonHeightStyle}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={1}>
                <Col style={styles.columnStyle}>
                  <FlatButton
                    label="TESTNET"
                    labelStyle={styles.toggleLabelisTest}
                    style={styles.buttonHeightStyle}
                    disabled={true}
                  />
                </Col>
                <Col>
                  <Toggle
                    toggled={this.state.isTest}
                    disabled={this.state.testDisabled}
                    onToggle={this.testChange}
                    style={styles.toggleStyle}
                  />
                </Col>
              </Col>
              <Col xs={1} style={{ paddingLeft: 40 }}>
                <Col style={styles.columnStyle}>
                  <FlatButton
                    label="VPN"
                    labelStyle={this.state.isTest ? styles.toggleLabelisTest :
                      { color: '#4b4e5d', textTransform: 'none', fontWeight: 600, fontSize: 14 }}
                    style={styles.buttonHeightStyle}
                    disabled={true}
                    onClick={() => { this.setState({ showPopUp: !this.state.status }) }} />
                </Col>
                <Col>
                  <Toggle
                    toggled={this.state.status}
                    onToggle={this.handleToggle}
                    style={styles.toggleStyle}
                    thumbStyle={this.state.isTest ? null : styles.thumbTrackStyle}
                    trackStyle={this.state.isTest ? null : styles.thumbTrackStyle}
                  />
                </Col>
              </Col>
              <Col xs={1} style={{ paddingLeft: 60 }}>
                <DropDownMenu
                  autoWidth={false}
                  disabled={(!this.state.isTest) || this.state.status}
                  iconButton={<DownArrow />}
                  iconStyle={{
                    top: -5,
                    right: -10,
                    fill: this.state.isTest ? 'white' : '#4b4e5d'
                  }}
                  labelStyle={{
                    height: 42,
                    lineHeight: '42px',
                    fontWeight: '600',
                    color: this.state.isTest ? 'white' : '#4b4e5d',
                    textAlign: 'center',
                    paddingLeft: 0,
                    paddingRight: 24
                  }}
                  style={{
                    height: 42
                  }}
                  underlineStyle={{ border: 0 }}
                  menuStyle={{ width: 'auto' }}
                  onChange={this.sockChange}
                  value={this.state.isSock ? 'SOCKS' : 'OpenVPN'}
                >
                  <MenuItem
                    value="OpenVPN"
                    primaryText="OpenVPN"
                  />
                  <MenuItem
                    value="SOCKS"
                    primaryText="SOCKS v5"
                  />
                </DropDownMenu>
              </Col>
              <Snackbar
                open={this.state.openSnack}
                message={this.state.snackMessage}
                autoHideDuration={2000}
                onRequestClose={this.snackRequestClose}
                style={{ marginBottom: '1%' }}
              />
              <Snackbar
                open={this.state.statusSnack}
                message={this.state.statusMessage}
                style={{ marginBottom: '1%' }}
              />
            </Row>
          </Grid>
          < Dialog
            contentStyle={{ width: 700 }}
            bodyStyle={{ padding: '5%' }}
            open={this.state.showTransScreen}
            onRequestClose={this.handleTransClose}
          >
            <span style={styles.formHeading}>How Much</span>
            <TextField
              type="number"
              underlineShow={false} fullWidth={true}
              inputStyle={styles.textInputStyle}
              style={styles.textStyle}
              onChange={this.valueChange.bind(this)}
              value={this.state.pivxAmount}
              underlineShow={false} fullWidth={true}
            />
            <div style={{ backgroundColor: '#4e5565', fontFamily: 'Poppins' }}>
              <p style={{ fontSize: 16, color: 'white', padding: 10, letterSpacing: 1, textAlign: 'center' }}><span style={{ fontWeight: 'bold' }}>Expected {this.state.expectedEth}</span>
                <span style={{ fontSize: 16, color: 'white', letterSpacing: 1 }}> SENT TOKENS</span>
              </p>
            </div>
            <span style={styles.formHeading}>ETH Address</span>
            <TextField
              hintText="Example: 0x93186402811baa5b188a14122C11B41dA0099844"
              hintStyle={{ bottom: 8, paddingLeft: 10, letterSpacing: 2 }}
              style={{ backgroundColor: '#d4dae2', height: 42, marginTop: 15 }}
              underlineShow={false} fullWidth={true}
              onChange={this.addressChange.bind(this)}
              value={this.state.eth_address}
              inputStyle={styles.textInputStyle}
            />
            <RaisedButton
              disabled={this.state.eth_address === '' || this.state.isDisabled ? true : false}
              onClick={this.onClickConvert.bind(this)}
              label="Swap"
              labelStyle={styles.buttonLabelStyle}
              fullWidth={true}
              buttonStyle={
                this.state.eth_address === '' || this.state.isDisabled ?
                  styles.disabledButtonStyle : styles.enabledButtonStyle
              }
              style={{ height: 48 }}
            />
            {this.state.showAddress ? <span>Send Pivx Tokens to {this.state.send_address}</span> : null}
          </Dialog>
        </div>
      </div >
    )
  }
}


const styles = {
  clipBoard: {
    height: 18,
    width: 15,
    color: '#5ca1e8',
    cursor: 'pointer',
    marginTop: '5%',
    marginLeft: -12
  },
  clipBoardDialog: {
    height: 14,
    width: 14,
    cursor: 'pointer',
    marginLeft: 5
  },
  walletAddress: {
    fontSize: 12,
    fontWeight: '600',
    color: '#c3deef',
    whiteSpace: 'nowrap',
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: '3%'
  },
  basicWallet: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FAFAFA'
  },
  ethBalance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FAFAFA',
    marginTop: '3%',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  sentBalance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FAFAFA',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  toggleLabelisTest: {
    color: '#FAFAFA',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: 14
  },
  buttonHeightStyle: {
    height: '18px',
    lineHeight: '18px'
  },
  balanceText: {
    color: '#c3deef'
  },
  columnStyle: {
    fontSize: 12,
    fontWeight: '600'
  },
  toggleStyle: {
    marginTop: 8,
    marginLeft: 20
  },
  thumbTrackStyle: {
    backgroundColor: '#4b4e5d'
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
export default Header;