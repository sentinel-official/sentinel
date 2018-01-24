import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Toolbar, ToolbarGroup, ToolbarSeparator, TextField, RaisedButton, Chip, Tabs, Tab } from 'material-ui';
import SendComponent from './SendComponent';
import tab from 'material-ui/svg-icons/action/tab';
import Header from './Header';
import { getEthBalance, getSentBalance, getAccount, transferAmount, getVPNdetails } from '../Actions/AccountActions';
import History from './History';
import ReceiveComponent from './ReceiveComponent';
import VPNComponent from './VPNComponent';

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
      status: false
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
  }

  getUserEthBalance() {
    let that = this;
    getEthBalance(this.state.local_address, (err, ethBalance) => {
      if (err) console.log(err, 'got an error')
      else {
        that.setState({ ethBalance })
      }
    })
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
    this.setState({
      value: value,
      color: 'orange'
    });
  };

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

    return (
      <MuiThemeProvider>
        <div>
          <div>
            <div>
              <Header balance={userBalance} onChange={this.getVPNapi} local_address={this.state.local_address} />
              <div>
                <Tabs
                  value={this.state.value}
                  onChange={this.handleChange}
                  tabItemContainerStyle={{
                    backgroundColor: '#FAFAFA'
                  }}
                  inkBarStyle={{ backgroundColor: '#532d91' }}
                >
                  <Tab style={{ fontSize: 14, fontWeight: 'bold', color: '#532d91' }} label="HISTORY" value="history">
                    <History local_address={this.state.local_address} />
                  </Tab>
                  <Tab style={{ fontSize: 14, fontWeight: 'bold', color: '#532d91' }} label="SEND" value="send">
                    <SendComponent local_address={this.state.local_address} />
                  </Tab>
                  <Tab style={{ fontSize: 14, fontWeight: 'bold', color: '#532d91' }} label="RECEIVE" value="receive">
                    <div>
                      <ReceiveComponent local_address={this.state.local_address} />
                    </div>
                  </Tab>
                  <Tab style={{ fontSize: 14, fontWeight: 'bold', color: '#532d91' }} label="VPN List" value="vpn">
                    <VPNComponent
                      local_address={this.state.local_address}
                      status={this.state.status}
                      vpnData={this.state.vpnData}
                    />
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Dashboard;