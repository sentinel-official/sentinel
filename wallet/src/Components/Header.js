import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Snackbar, FlatButton, Dialog, SelectField, TextField, MenuItem, Toggle, DropDownMenu } from 'material-ui';
import {
  getVPNList, connectVPN, disconnectVPN, isVPNConnected, isOnline, isPrivate, getMasterUrl,
  sendError, connectSocks, disconnectSocks, sendUsage, checkGateway, getGatewayUrl, setMaster
} from '../Actions/AccountActions';
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
      isPrivate: false,
      authcode: ''
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
      if (err) { getMasterUrl() }
      else if (data) {
        that.setState({ status: true });
        isPrivate(function (isPrivate, authcode) {
          that.setState({ isPrivate, authcode })
          that.props.privateChange(isPrivate)
        })
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

  handleToggle = (event, toggle) => {
    let self = this;
    if (this.state.isTest) {
      if (isOnline()) {
        if (toggle) {
          checkGateway(function (err, data, url) {
            if (err) {
              self.setState({ showPopUp: true })
            }
            else {
              self.setState({ authcode: data, isPrivate: true, openSnack: true, snackMessage: 'Private Net is Enabled with ' + url })
              self.props.privateChange(true)
            }
          })
          // this.setState({ openSnack: true, snackMessage: lang[this.props.lang].SelectNode })
        }
        else {
          setMaster(function (data) {
            self.setState({ isPrivate: false, authcode: '' })
            self.props.privateChange(true)
          })
        }
      }
      else {
        this.setState({ openSnack: true, snackMessage: lang[this.props.lang].CheckInternet })
      }
    }
  };

  getGatewayAddr = () => {
    let self = this;
    getGatewayUrl(this.state.authcode, function (err, data, url) {
      if (err) {
        self.setState({ isPrivate: false, showPopUp: false, openSnack: true, snackMessage: err.message || 'Problem in enabling private net' })
      }
      else {
        self.setState({ isPrivate: true, showPopUp: false, openSnack: true, snackMessage: 'Private Net is Enabled with ' + url })
        self.props.privateChange(true)
      }
    })
  }

  handleClose = () => {
    this.setState({ isPrivate: false, showPopUp: false });
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
      if (this.state.isPrivate) {
        setMaster(function (data) {
          self.setState({ isPrivate: false, authcode: '' })
        })
      }
    }
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
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={this.state.authcode === '' ? true : false}
        onClick={this.getGatewayAddr.bind(this)}
      />,
    ];
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
                    label="Private Net"
                    labelStyle={this.state.isTest ? styles.toggleLabelisTest :
                      { color: '#4b4e5d', textTransform: 'none', padding: 0, fontWeight: 600, fontSize: 14 }}
                    style={styles.buttonHeightStyle}
                    disabled={true}
                    onClick={() => { this.setState({ showPopUp: !this.state.status }) }} />
                </Col>
                <Col>
                  <Toggle
                    toggled={this.state.isPrivate}
                    onToggle={this.handleToggle}
                    style={styles.toggleStyle}
                    thumbStyle={this.state.isTest ? null : styles.thumbTrackStyle}
                    trackStyle={this.state.isTest ? null : styles.thumbTrackStyle}
                  />
                </Col>
              </Col>
              <Col xs={1} style={{ paddingLeft: 60 }}>
                {/* <Col style={{
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
                </Col> */}
                <DropDownMenu
                  autoWidth={false}
                  disabled={(!this.state.isTest) || this.state.status}
                  iconButton={<DownArrow />}
                  iconStyle={{
                    top: -5,
                    right: -10,
                    fill: this.state.isTest ? 'white' : '#3d425c'
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
              <Dialog
                title='Get Private Gateway URL'
                titleStyle={{ fontSize: 16 }}
                actions={actions}
                modal={true}
                open={this.state.showPopUp}
              >
                <TextField
                  autoFocus={true}
                  hintText='Enter Authcode'
                  hintStyle={{ fontSize: 14 }}
                  onChange={(event, authcode) => { this.setState({ authcode }) }}
                  onKeyPress={(ev) => { if (ev.key === 'Enter') this.getGatewayAddr() }}
                  value={this.state.authcode}
                  style={styles.textFieldCreate}
                />
              </Dialog>
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
  textFieldCreate: {
    width: '85%',
    paddingLeft: '5%',
    height: 40,
    lineHeight: '18px'
  }
}
export default Header;