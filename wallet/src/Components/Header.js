import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Snackbar, FlatButton, Dialog, SelectField, MenuItem, Toggle } from 'material-ui';
import { getVPNList, connectVPN, disconnectVPN, isVPNConnected, isOnline } from '../Actions/AccountActions';
import VPNComponent from './VPNComponent';
import ReactTooltip from 'react-tooltip';
import CopyIcon from 'material-ui/svg-icons/content/content-copy';

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
      isTest: false,
      showPay: false,
      payAccount: '',
      testDisabled: false
    }
  }

  openInExternalBrowser(url) {
    shell.openExternal(url);
  }

  componentWillMount = () => {
    let that = this;
    localStorage.setItem('config', 'MAIN')
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
      if (err) console.log('Error', err);
      else {
        that.setState({ vpnList: data });
      }
    })
  }

  _connectVPN = () => {
    this.setState({ showPopUp: false, statusSnack: true, testDisabled: true, statusMessage: 'Connecting...Please Wait' })
    let that = this;
    if (isOnline()) {
      connectVPN(this.props.local_address, this.state.selectedVPN, function (err, isMacError, isWinError, account) {
        if (isMacError) {
          that.setState({ status: false, showInstruct: true, testDisabled: false, statusSnack: false, isMac: true })
        }
        else if (isWinError) {
          that.setState({ status: false, showInstruct: true, testDisabled: false, statusSnack: false, isMac: false })
        }
        else if (account) {
          that.setState({ status: false, showPay: true, statusSnack: false, testDisabled: false, isMac: false, payAccount: account })
        }
        else if (err) {
          if (err.message !== true)
            that.setState({ status: false, statusSnack: false, showInstruct: false, testDisabled: false, openSnack: true, snackMessage: err.message })
        }
        else {
          that.props.onChange();
          //that.returnVPN();
          that.setState({ status: true, statusSnack: false, showInstruct: false, testDisabled: false, openSnack: true, snackMessage: "Connected VPN" })
        }
      })
    }
    else {
      this.setState({ openSnack: true, statusSnack: false, testDisabled: false, snackMessage: 'Check your Internet Connection' })
    }
  }

  payVPN = () => {
    let data = {
      account_addr: this.state.payAccount,
      amount: 10000000000,
      id: -1
    }
    this.props.vpnPayment(data);
    this.setState({ showPay: false })
  }

  returnVPN = () => {
    return <VPNComponent isConnected={true} />
  }

  _disconnectVPN = () => {
    this.setState({ statusSnack: true, statusMessage: 'Disconnecting...' })
    var that = this;
    disconnectVPN(function (err) {
      that.props.onChange();
      that.setState({ selectedVPN: null, statusSnack: false, status: false, openSnack: true, snackMessage: "Disconnected VPN" })
    });
  }

  handleToggle = (event, toggle) => {
    if (this.state.isTest) {
      if (isOnline()) {
        if (toggle) {
          let that = this;
          getVPNList(function (err, data) {
            if (err) console.log('Error', err);
            else {
              that.setState({ vpnList: data, showPopUp: true });
            }
          })
        }
        else {
          this._disconnectVPN();
        }
      }
      else {
        this.setState({ openSnack: true, snackMessage: 'Check your Internet Connection' })
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

  closeInstruction = () => {
    this.setState({ showInstruct: false });
  }

  snackRequestClose = () => {
    this.setState({
      openSnack: false
    });
  };
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Connect"
        primary={true}
        disabled={this.state.selectedVPN == null || this.state.vpnList.length === 0 ? true : false}
        onClick={this._connectVPN.bind(this)}
      />,
    ];
    const instrucActions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.closeInstruction}
      />
    ];
    const paymentActions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Pay"
        primary={true}
        onClick={this.payVPN.bind(this)}
      />,
    ];
    return (
      <div style={{ height: 70, background: 'linear-gradient(to right,#2f3245 72%,#3d425c 28%)' }}>
        <div>
          <Grid>
            <Row style={{ paddingTop: 10 }}>
              <Col xs={1}>
                <div>
                  <img src={'../src/Images/logo.svg'} alt="logo" style={{ width: 50, height: 50, marginLeft: 10 }} />
                </div>
              </Col>
              <Col xs={5} style={{
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
                        snackMessage: 'Copied to Clipboard Successfully',
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
              <Col xs={1} style={{ paddingLeft: 50 }}>
                <Col style={{
                  fontSize: 12,
                  fontWeight: '600',
                }}>
                  <FlatButton
                    label="VPN"
                    labelStyle={this.state.isTest ? { color: '#fafafa', textTransform: 'none', fontWeight: 600, fontSize: 14 } :
                      { color: '#4b4e5d', textTransform: 'none', fontWeight: 600, fontSize: 14 }}
                    style={{ height: '18px', lineHeight: '18px' }}
                    disabled={!this.state.isTest}
                    onClick={() => { this.setState({ showPopUp: !this.state.status }) }} />
                </Col>
                <Col>
                  <Toggle
                    thumbStyle={this.state.isTest ? null : { backgroundColor: '#4b4e5d' }}
                    trackStyle={this.state.isTest ? null : { backgroundColor: '#4b4e5d' }}
                    toggled={this.state.status}
                    onToggle={this.handleToggle}
                    style={{ marginTop: 8, marginLeft: 20 }}
                  />
                </Col>
              </Col>
              <Snackbar
                open={this.state.openSnack}
                message={this.state.snackMessage}
                autoHideDuration={2000}
                onRequestClose={this.snackRequestClose}
                style={{ marginBottom: '2%' }}
              />
              <Snackbar
                open={this.state.statusSnack}
                message={this.state.statusMessage}
                style={{ marginBottom: '2%' }}
              />
              <Dialog
                title="VPN List"
                titleStyle={{ fontSize: 14 }}
                actions={actions}
                modal={true}
                open={this.state.showPopUp}
              >
                {this.state.vpnList.length !== 0 ?
                  <SelectField
                    hintText="Select VPN"
                    value={this.state.selectedVPN}
                    autoWidth={true}
                    onChange={(event, index, value) => {
                      this.setState({ selectedVPN: value })
                    }}
                  >
                    {this.state.vpnList.map((vpn) =>
                      <MenuItem value={vpn.account_addr} 
                      primaryText={`City:${vpn.location.city}, Speed:${(vpn.net_speed.download/ (1024 * 1024)).toFixed(2) + ' Mbps'}, Latency:${vpn.latency ? vpn.latency : 'None'}`} />
                    )}
                  </SelectField>
                  :
                  <span>No VPNs Found</span>
                }
              </Dialog>
              <Dialog
                title="Install Dependencies"
                titleStyle={{ fontSize: 14 }}
                actions={instrucActions}
                modal={true}
                open={this.state.showInstruct}
              >{this.state.isMac ? <span>
                This device does not have OpenVPN installed. Please install it by running below command: <br />
                <code>brew install openvpn</code>
                <CopyToClipboard text='brew install openvpn'
                  onCopy={() => this.setState({
                    snackMessage: 'Copied to Clipboard Successfully',
                    openSnack: true
                  })} >
                  <img
                    src={'../src/Images/download.jpeg'}
                    alt="copy"
                    data-tip data-for="copyImage"
                    style={styles.clipBoardDialog}
                  />
                </CopyToClipboard>
                <br />
                If brew is also not installed, then follow <a style={{ cursor: 'pointer' }}
                  onClick={() => {
                    this.openInExternalBrowser(`https://wwww.howtogeek.com/211541/homebrew-
                    for-os-x-easily=installs-desktop-apps-and-terminal-utilities/`)
                  }}
                >this page</a>
              </span>
                :
                <span>
                  OpenVPN Not Installed.
                  Install here https://openvpn.net/index.php/open-source/downloads.html.
                  <CopyToClipboard text='https://openvpn.net/index.php/open-source/downloads.html'
                    onCopy={() => this.setState({
                      snackMessage: 'Copied to Clipboard Successfully',
                      openSnack: true
                    })} >
                    <img
                      src={'../src/Images/download.jpeg'}
                      alt="copy"
                      data-tip data-for="copyImage"
                      style={styles.clipBoardDialog}
                    />
                  </CopyToClipboard>

                </span>
                }
              </Dialog>
              <Dialog
                title="Initial Payment Reminder"
                titleStyle={{ fontSize: 14 }}
                actions={paymentActions}
                modal={true}
                open={this.state.showPay}
              >
                <span>
                  Inorder to use VPN, you need to pay 100 sents for the first time. Please pay and then try to connect to the vpn.
                </span>
              </Dialog>
              <ReactTooltip id="copyImage" place="bottom">
                <span>Copy</span>
              </ReactTooltip>
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