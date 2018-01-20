import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Snackbar, FlatButton, Dialog, SelectField, MenuItem, Toggle } from 'material-ui';
import { getVPNList, connectVPN, disconnectVPN, isVPNConnected } from '../Actions/AccountActions';
import VPNComponent from './VPNComponent';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openSnack: false,
      snackMessage: '',
      showPopUp: false,
      vpnList: [],
      selectedVPN: null,
      status: false
    }
  }

  componentWillMount = () => {
    let that = this;
    isVPNConnected(function (err, data) {
      if (err) console.log('Error', err);
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
    let that = this;
    connectVPN(this.props.local_address, this.state.selectedVPN, function (err, res) {
      if (err) {
        console.log(err, "Error");

        that.setState({ showPopUp: false, status: false, openSnack: true, snackMessage: err.message })
      }
      else {
        console.log("Connected", res);
        that.props.onChange();
        //that.returnVPN();
        that.setState({ showPopUp: false, status: true, openSnack: true, snackMessage: "Connected VPN" })
      }
    })
  }

  returnVPN = () => {
    return <VPNComponent isConnected={true} />
  }

  _disconnectVPN = () => {
    var that = this;
    disconnectVPN(function (err) {
      if (err) {
        console.log(err);
        // _toggleVPNButtons();
      } else {
        console.log('Disconnected');
        that.props.onChange();
        that.setState({ status: false, openSnack: true, snackMessage: "Disconnected VPN" })
      }
    });
  }

  handleToggle = (event, toggle) => {
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
        disabled={this.state.selectedVPN == null ? true : false}
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
                  <img src={'../src/Images/5.png'} style={{ width: 70, height: 70, marginTop: -10 }} />
                </div>
              </Col>
              <Col xs={5} style={{
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div>
                  <span style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#FAFAFA'
                  }}>SENTINEL - Basic Wallet</span>
                </div>
                <Row>
                  <Col xs={8}><span
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: '#FAFAFA',
                      whiteSpace: 'nowrap',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginTop: '5%'
                    }}>
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
                        style={styles.clipBoard}
                      />
                    </CopyToClipboard>
                  </Col>
                </Row>
              </Col>
              <Col xs={3}>
                <div>
                  <Col style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#FAFAFA',
                    marginTop: '3%'
                  }}>
                    <span>SENT: {this.props.balance.sents}</span>
                  </Col>
                  <Col style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#FAFAFA',
                    marginTop: '5%'
                  }}>
                    <span>ETH: {this.props.balance.eths}</span>
                  </Col>
                </div>
              </Col>
              <Col xs={2}>
                <Col style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#FAFAFA',
                  marginTop: '5%'
                }}>
                  <FlatButton
                    label="VPN"
                    labelStyle={{ color: 'white', textTransform: 'none' }}
                    style={{ height: '18px', lineHeight: '18px' }}
                    onClick={() => { this.setState({ showPopUp: true }) }} />
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
                style={{ marginBottom: '2%', width: '80%' }}
              />
              <Dialog
                title="VPN List"
                titleStyle={{ fontSize: 14 }}
                actions={actions}
                modal={true}
                open={this.state.showPopUp}
              >
                <SelectField
                  hintText="Select VPN"
                  value={this.state.selectedVPN}
                  autoWidth={true}
                  onChange={(event, index, value) => {
                    console.log("Value:", value);
                    this.setState({ selectedVPN: value })
                  }}
                >
                  {this.state.vpnList.map((vpn) =>
                    <MenuItem value={vpn.account.addr} primaryText={vpn.location.city} />
                  )}
                </SelectField>
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
    marginTop: '12%',
    marginLeft:-10
  }
}
export default Header;