import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Snackbar, FlatButton, Dialog, SelectField, MenuItem, Toggle } from 'material-ui';
import { getVPNList, connectVPN, disconnectVPN, isVPNConnected, isOnline, sendError, connectSocks, disconnectSocks } from '../Actions/AccountActions';
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
      testDisabled: false
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
    this.setState({ status: nextProps.status, testDisabled: nextProps.testDisabled, isTest: nextProps.isTest })
  }

  _disconnectVPN = () => {
    this.setState({ statusSnack: true, statusMessage: lang[this.props.lang].Disconnecting })
    var that = this;
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
      this.setState({ isTest: false })
      localStorage.setItem('config', 'MAIN')
      this.props.ontestChange(false);
    }
  }

  sockChange = (event, toggle) => {
    let self = this;
    if (toggle) {
      this.setState({ isSock: true })
      localStorage.setItem('vpnType', 'socks5')
      connectSocks();
      this.props.onsockChange(true);
    }
    else {
      this.setState({ isSock: false })
      localStorage.setItem('vpnType', 'openvpn')
      disconnectSocks();
      this.props.onsockChange(false);
    }
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
              <Col xs={4} style={{
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
              <Col xs={3}>
                <div>
                  <Col style={styles.sentBalance}>
                    <span>{this.state.isTest ? 'TEST SENT: ' : 'SENT: '}</span>
                    <span style={{ color: '#c3deef' }}>{this.props.balance.sents}</span>
                  </Col>
                  <Col style={styles.ethBalance}>
                    <span>{this.state.isTest ? 'TEST ETH: ' : 'ETH: '}</span>
                    <span style={{ color: '#c3deef' }}>{this.props.balance.eths === 'Loading'
                      ? this.props.balance.eths :
                      parseFloat(this.props.balance.eths).toFixed(8)
                    }</span>
                  </Col>
                </div>
              </Col>
              <Col xs={1}>
                <Col style={{
                  fontSize: 12,
                  fontWeight: '600',
                }}>
                  <FlatButton
                    label="TESTNET"
                    labelStyle={{ color: '#FAFAFA', textTransform: 'none', fontWeight: 600, fontSize: 14 }}
                    style={{ height: '18px', lineHeight: '18px' }}
                    disabled={true}
                  />
                </Col>
                <Col>
                  <Toggle
                    toggled={this.state.isTest}
                    disabled={this.state.testDisabled}
                    onToggle={this.testChange}
                    style={{ marginTop: 8, marginLeft: 20 }}
                  />
                </Col>
              </Col>
              <Col xs={1} style={{ paddingLeft: 40 }}>
                <Col style={{
                  fontSize: 12,
                  fontWeight: '600',
                }}>
                  <FlatButton
                    label="VPN"
                    labelStyle={this.state.isTest ? { color: '#fafafa', textTransform: 'none', fontWeight: 600, fontSize: 14 } :
                      { color: '#4b4e5d', textTransform: 'none', fontWeight: 600, fontSize: 14 }}
                    style={{ height: '18px', lineHeight: '18px' }}
                    disabled={true}
                    onClick={() => { this.setState({ showPopUp: !this.state.status }) }} />
                </Col>
                <Col>
                  <Toggle
                    toggled={this.state.status}
                    onToggle={this.handleToggle}
                    style={{ marginTop: 8, marginLeft: 20 }}
                    thumbStyle={this.state.isTest ? null : { backgroundColor: '#4b4e5d' }}
                    trackStyle={this.state.isTest ? null : { backgroundColor: '#4b4e5d' }}
                  />
                </Col>
              </Col>
              <Col xs={1} style={{ paddingLeft: 60 }}>
                <Col style={{
                  fontSize: 12,
                  fontWeight: '600',
                }}>
                  <FlatButton
                    label="SOCKS"
                    labelStyle={this.state.isTest ?
                      { color: '#fafafa', textTransform: 'none', fontWeight: 600, fontSize: 14 } :
                      { color: '#4b4e5d', textTransform: 'none', fontWeight: 600, fontSize: 14 }}
                    style={{ height: '18px', lineHeight: '18px' }}
                    disabled={true}
                  />
                </Col>
                <Col>
                  <Toggle
                    toggled={this.state.isSock}
                    onToggle={this.sockChange}
                    style={{ marginTop: 8, marginLeft: 20 }}
                    thumbStyle={this.state.isTest ? null : { backgroundColor: '#4b4e5d' }}
                    trackStyle={this.state.isTest ? null : { backgroundColor: '#4b4e5d' }}
                  />
                </Col>
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
    marginTop: '3%'
  },
  sentBalance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FAFAFA'
  }
}
export default Header;