import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Tabs, Tab } from 'material-ui';
import SendComponent from './SendComponent';
import Header from './Header';
import { getEthBalance, getSentBalance, getAccount, getVPNdetails, getVPNConnectedData } from '../Actions/AccountActions';
import History from './History';
import ReceiveComponent from './ReceiveComponent';
import VPNComponent from './VPNComponent';
import SendNew from './SendNew';
import VPNHistory from './VPNHistory';
import { sendError } from '../helpers/ErrorLog';
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
      sessionId: null,
      testDisabled: false,
      lang: 'en',
      currentHash: null
    }
    this.set = this.props.set;
  }
  componentWillMount() {
    let that = this;

    getAccount((err, account_addr) => {
      if (err) console.log(err)
      else {
        that.setState({
          local_address: account_addr
        })
      }
    });
    getVPNConnectedData(function (err, data) {
      if (err) console.log(err)
      else {
        that.setState({ status: true, vpnData: data, isTest: true });
      }
    })
  }

  getUserEthBalance() {
    let that = this;
    getEthBalance(this.state.local_address, (err, ethBalance) => {
      if (err) sendError(err);
      else {
        that.setState({ ethBalance })
      }
    })
  }

  getTxHash = (txHash) => {
    this.setState({ currentHash: txHash })
  }

  getUserSentBalance() {
    let that = this;
    getSentBalance(this.state.local_address, (err, sentBalance) => {
      if (err) console.log(err, 'got an error')
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
    if (value === false && (this.state.value === 'vpn' || this.state.value === 'vpn_history'))
      this.setState({ isTest: value, value: 'send' })
    else
      this.setState({ isTest: value })
    this.getUserEthBalance();
    this.getUserSentBalance();
  }

  removeHash = () => {
    this.setState({ currentHash: null })
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
            local_address={this.state.local_address}
            vpnPayment={this.vpnPayment}
            status={this.state.status}
            testDisabled={this.state.testDisabled}
            moveToList={this.moveToVPN}
            isTest={this.state.isTest}
            lang={this.props.lang}
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
              <Tab style={{ fontSize: 14, fontWeight: 'bold', color: '#2f3245' }} label={lang[language].History} value="history">
                <History
                  local_address={this.state.local_address} isTest={this.state.isTest}
                  lang={this.props.lang} currentHash={this.state.currentHash} removeHash={this.removeHash} />
              </Tab>
              <Tab style={{ fontSize: 14, fontWeight: 'bold', color: '#2f3245' }} label={lang[language].Send} value="send">
                <SendComponent
                  local_address={this.state.local_address}
                  amount={this.state.amount}
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
                />
                {/* <SendNew /> */}
              </Tab>
              <Tab style={{ fontSize: 14, fontWeight: 'bold', color: '#2f3245' }} label={lang[language].Receive} value="receive">
                <div>
                  <ReceiveComponent local_address={this.state.local_address} lang={this.props.lang} />
                </div>
              </Tab>
              <Tab style={this.state.isTest ? { fontSize: 14, fontWeight: 'bold', color: '#2f3245' } :
                { fontSize: 14, fontWeight: 'bold', color: '#bdbfce' }} label={lang[language].VpnList} value="vpn" disabled={!this.state.isTest}>
                <VPNComponent
                  local_address={this.state.local_address}
                  status={this.state.status}
                  vpnData={this.state.vpnData}
                  isTest={this.state.isTest}
                  onChange={this.getVPNapi}
                  vpnPayment={this.vpnPayment}
                  changeTest={this.testDisable}
                  lang={this.props.lang}
                />
              </Tab>
              <Tab style={this.state.isTest ? { fontSize: 14, fontWeight: 'bold', color: '#2f3245' } :
                { fontSize: 14, fontWeight: 'bold', color: '#bdbfce' }} label={lang[language].VpnHistory} value="vpn_history" disabled={!this.state.isTest}>
                <VPNHistory local_address={this.state.local_address} payVPN={this.vpnPayment.bind(this)} lang={this.props.lang} />
              </Tab>
            </Tabs>
          </div>
          {this.state.isTest ?
            <div style={{ backgroundColor: '#31b0d5', position: 'absolute', bottom: 0, width: '100%' }}>
              <h4 style={{
                textAlign: 'center', fontSize: 14, fontWeight: 'bold', padding: 14, margin: 0, color: 'white'
              }}>{lang[language].TestMode}</h4>
            </div>
            :
            <div></div>
          }
        </div>
      </MuiThemeProvider >
    );
  }
}

export default Dashboard;