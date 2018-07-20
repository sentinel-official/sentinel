import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Tabs, Tab } from 'material-ui';
import SendComponent from './SendComponent';
import Header from './Header';
import { getEthBalance, getSentBalance, getAccount, getVPNdetails, getVPNConnectedData, sendError, getMasterUrl } from '../Actions/AccountActions';
import History from './History';
import ReceiveComponent from './ReceiveComponent';
import VPNComponent from './VPNComponent';
import VPNHistory from './VPNHistory';
let lang = require('./language');
const { ipcRenderer } = window.require('electron');

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'send',
      password: '',
      activeTab: 'purple',
      color: 'purple',
      local_address: '',
      ethBalance: 'Loading',
      sentBalance: 'Loading',
      isGetBalanceCalled: false,
      vpnData: null,
      status: false,
      to_addr: '',
      sending: false,
      isPropReceive: false,
      amount: '',
      unit: 'ETH',
      isTest: false,
      isSock: false,
      sessionId: null,
      testDisabled: false,
      lang: 'en',
      currentHash: null,
      swapHash: null,
      isPrivate: false
    }
    this.set = this.props.set;
  }

  componentWillMount() {
    let that = this;
    getAccount((err, account_addr) => {
      if (err) { }
      else {
        that.setState({
          local_address: account_addr
        })
      }
    });
    getVPNConnectedData(function (err, data, sock) {
      if (err) { }
      else {
        that.setState({ status: true, vpnData: data, isTest: true, isSock: sock });
      }
    })
  }

  componentDidCatch(error, info) {
    sendError(error);
  }


  getUserEthBalance() {
    let that = this;
    getEthBalance(this.state.local_address, (err, ethBalance) => {
      if (err) { }
      else {
        that.setState({ ethBalance })
      }
    })
  }

  privValueChange = (value) => {
    this.setState({ isPrivate: value })
  }

  getTxHash = (txHash) => {
    this.setState({ currentHash: txHash })
  }

  getSwapHash = (txHash) => {
    this.setState({ swapHash: txHash })
  }

  getUserSentBalance() {
    let that = this;
    getSentBalance(this.state.local_address, (err, sentBalance) => {
      if (err) { }
      else {
        that.setState({ sentBalance })
      }
    })
  }

  getVPNapi = () => {
    var that = this;
    getVPNdetails(function (status, data) {
      that.setState({ status: status, vpnData: data });
    })
  }

  handleChange = (value) => {
    if (value === 'send') {
      this.setState({
        to_addr: '',
        amount: '',
        sessionId: null,
        unit: 'ETH',
        isPropReceive: true,
        value: 'send',
        color: 'orange'
      })
    }
    else {
      this.setState({
        value: value,
        color: 'orange'
      });
    }
  };

  propReceiveChange = () => {
    this.setState({ isPropReceive: false })
  }

  clearSend = () => {
    this.setState({
      to_addr: '',
      amount: '',
      sessionId: null,
      unit: 'ETH',
      isPropReceive: true
    })
  }

  vpnPayment = (sessionData) => {
    this.setState({
      to_addr: sessionData.account_addr,
      amount: sessionData.amount,
      unit: 'SENT',
      value: 'send',
      sessionId: sessionData.id,
      isPropReceive: true
    })
  }

  moveToVPN = () => {
    this.setState({ value: 'vpn' })
  }

  onTestChange = (value) => {
    if ((value === false && (this.state.value === 'vpn' || this.state.value === 'vpn_history'))
      || (value === true && this.state.value === 'swixer'))
      this.setState({ isTest: value, value: 'send' })
    else
      this.setState({ isTest: value })
    this.getUserEthBalance();
    this.getUserSentBalance();
  }

  onSockChange = (value) => {
    this.setState({ isSock: value })
  }

  removeHash = () => {
    this.setState({ currentHash: null })
  }

  removeSwapHash = () => {
    this.setState({ swapHash: null })
  }

  testDisable = (value) => {
    this.setState({ testDisabled: value })
  }

  render() {
    let that = this;
    if (!this.state.isGetBalanceCalled) {
      setInterval(function () {

        that.getUserEthBalance();
        that.getUserSentBalance();
      }, 5000);

      this.setState({ isGetBalanceCalled: true });
    }
    let userBalance = {
      eths: this.state.ethBalance,
      sents: this.state.sentBalance
    }

    let language = this.props.lang;

    return (
      <MuiThemeProvider>
        <div>
          <Header
            balance={userBalance}
            onChange={this.getVPNapi}
            ontestChange={this.onTestChange}
            onsockChange={this.onSockChange}
            local_address={this.state.local_address}
            vpnPayment={this.vpnPayment}
            status={this.state.status}
            testDisabled={this.state.testDisabled}
            moveToList={this.moveToVPN}
            isTest={this.state.isTest}
            isSock={this.state.isSock}
            lang={this.props.lang}
            privateChange={this.privValueChange}
          />
          <div>
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              tabItemContainerStyle={{
                backgroundColor: '#FAFAFA'
              }}
              inkBarStyle={{ backgroundColor: '#2f3245', height: 3 }}
            >
              <Tab style={styles.enabledTabStyle} label={lang[language].History} value="history">
                <History
                  local_address={this.state.local_address} isTest={this.state.isTest} swapHash={this.state.swapHash}
                  lang={this.props.lang} currentHash={this.state.currentHash} removeHash={this.removeHash} removeSwapHash={this.removeSwapHash} />
              </Tab>
              <Tab style={styles.enabledTabStyle} label={lang[language].Send} value="send">
                <SendComponent
                  local_address={this.state.local_address}
                  amount={this.state.amount}
                  balance={userBalance}
                  to_addr={this.state.to_addr}
                  unit={this.state.unit}
                  session_id={this.state.sessionId}
                  sending={this.state.sending}
                  isTest={this.state.isTest}
                  isPropReceive={this.state.isPropReceive}
                  propReceiveChange={this.propReceiveChange.bind(this)}
                  clearSend={this.clearSend.bind(this)}
                  lang={this.props.lang}
                  getCurrentTx={this.getTxHash}
                  getCurrentSwapHash={this.getSwapHash}
                />
              </Tab>
              <Tab style={styles.enabledTabStyle} label={lang[language].Receive} value="receive">
                <div>
                  <ReceiveComponent local_address={this.state.local_address} lang={this.props.lang} isTest={this.state.isTest} />
                </div>
              </Tab>
              <Tab style={this.state.isTest ? styles.enabledTabStyle : styles.disabledTabStyle}
                label={lang[language].VpnList} value="vpn" disabled={!this.state.isTest}>
                <VPNComponent
                  local_address={this.state.local_address}
                  status={this.state.status}
                  vpnData={this.state.vpnData}
                  isTest={this.state.isTest}
                  onChange={this.getVPNapi}
                  vpnPayment={this.vpnPayment}
                  changeTest={this.testDisable}
                  lang={this.props.lang}
                  isSock={this.state.isSock}
                  isPrivate={this.state.isPrivate}
                />
              </Tab>
              <Tab style={this.state.isTest ? styles.enabledTabStyle : styles.disabledTabStyle}
                label={lang[language].VpnHistory} value="vpn_history" disabled={!this.state.isTest}>
                <VPNHistory local_address={this.state.local_address} payVPN={this.vpnPayment.bind(this)}
                  lang={this.props.lang} isPrivate={this.state.isPrivate} />
              </Tab>
              <Tab style={this.state.isTest ? styles.disabledTabStyle : styles.enabledTabStyle}
                label="Swixer" value="swixer" disabled={this.state.isTest}>
                <div>
                  <iframe src="https://swixer.sentinelgroup.io" style={{ width: 1000, height: 525, border: 0 }}>
                  </iframe>
                </div>
              </Tab>
            </Tabs>
          </div>
          {this.state.isTest ?
            <div style={styles.testModeDiv}>
              <h4 style={styles.testModeHeading}>{lang[language].TestMode}</h4>
            </div>
            :
            <div></div>
          }
        </div>
      </MuiThemeProvider >
    );
  }
}

const styles = {
  enabledTabStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2f3245'
  },
  disabledTabStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#bdbfce'
  },
  testModeDiv: {
    backgroundColor: '#31b0d5',
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  testModeHeading: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    padding: 14,
    margin: 0,
    color: 'white'
  }
}

export default Dashboard;