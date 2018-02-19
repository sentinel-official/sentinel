import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Snackbar, FlatButton, Dialog, SelectField, MenuItem, Toggle } from 'material-ui';
import { getVPNList, connectVPN, disconnectVPN, isVPNConnected, isOnline } from '../Actions/AccountActions';
import VPNComponent from './VPNComponent';
import ReactTooltip from 'react-tooltip';

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
      status: false
    }
  }

  componentWillMount = () => {
    let that = this;
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
    this.setState({ showPopUp: false, statusSnack: true, statusMessage: 'Connecting...' })
    let that = this;
    if (isOnline()) {
      connectVPN(this.props.local_address, this.state.selectedVPN, function (err) {
        if (err) {
          that.setState({ status: false, statusSnack: false, openSnack: true, snackMessage: err.message })
        }
        else {
          that.props.onChange();
          //that.returnVPN();
          that.setState({ status: true, statusSnack: false, openSnack: true, snackMessage: "Connected VPN" })
        }
      })
    }
    else {
      this.setState({ openSnack: true, snackMessage: 'Check your Internet Connection' })
    }
  }

  returnVPN = () => {
    return <VPNComponent isConnected={true} />
  }

  _disconnectVPN = () => {
    this.setState({ statusSnack: true, statusMessage: 'Disconnecting...' })
    var that = this;
    disconnectVPN(function (err) {
      if (err) {
        console.log(err);
        that.setState({ status: true, statusSnack: false, openSnack: true, snackMessage: err.message })
        // _toggleVPNButtons();
      } else {
        that.props.onChange();
        that.setState({ selectedVPN: null, statusSnack: false, status: false, openSnack: true, snackMessage: "Disconnected VPN" })
      }
    });
  }

  handleToggle = (event, toggle) => {
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
  };

  handleClose = () => {
    this.setState({ showPopUp: false });
  };

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
    return (
      <div style={{ height: 70, backgroundColor: '#532d91' }}>
        <div>
          <Grid>
            <Row style={{ paddingTop: 10 }}>
              <Col xs={2}>
                <div>
                  <img src={'../src/Images/3.png'} alt="logo" style={{ width: 70, height: 70, marginTop: -10 }} />
                </div>
              </Col>
              <Col xs={5} style={{
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div>
                  <span style={styles.basicWallet}>SENTINEL - Basic Wallet</span>
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
                      <img
                        src={'../src/Images/download.jpeg'}
                        alt="copy"
                        data-tip data-for="copyImage"
                        style={styles.clipBoard}
                      />
                    </CopyToClipboard>
                    <ReactTooltip id="copyImage" place="bottom">
                      <span>Copy</span>
                    </ReactTooltip>
                  </Col>
                </Row>
              </Col>
              <Col xs={3}>
                <div>
                  <Col style={styles.sentBalance}>
                    <span>SENT: {this.props.balance.sents}</span>
                  </Col>
                  <Col style={styles.ethBalance}>
                    <span>ETH: {this.props.balance.eths === 'Loading'
                      ? this.props.balance.eths :
                      parseFloat(this.props.balance.eths).toFixed(8)
                    }</span>
                  </Col>
                </div>
              </Col>
              <Col xs={2}>
                <Col style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#FAFAFA'
                }}>
                  <FlatButton
                    label="VPN"
                    labelStyle={{ color: 'white', textTransform: 'none' }}
                    style={{ height: '18px', lineHeight: '18px' }}
                    onClick={() => { this.setState({ showPopUp: !this.state.status }) }} />
                </Col>
                <Col>
                  <Toggle
                    toggled={this.state.status}
                    onToggle={this.handleToggle}
                    style={{ marginTop: '5%', marginLeft: '15%' }}
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
                      <MenuItem value={vpn.account.addr} primaryText={vpn.location.city} />
                    )}
                  </SelectField>
                  :
                  <span>No VPNs Found</span>
                }
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
    height: 12,
    width: 12,
    cursor: 'pointer',
    marginTop: '5%',
    marginLeft: -12
  },
  walletAddress: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FAFAFA',
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