import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Toolbar, ToolbarGroup, ToolbarSeparator ,TextField, RaisedButton, Chip, Tabs, Tab } from 'material-ui';
import SendComponent from './SendComponent';
import tab from 'material-ui/svg-icons/action/tab';
import Header from './Header';
import { getBalance, getAccount, transferAmount} from '../Actions/AccountActions';
import History from './History';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'send',
            password: '',
            activeTab: 'purple',
            color: 'purple',
            local_address: '',
            balance: {},
            isGetBalanceCalled: false
        }
        this.set = this.props.set;
    }
    componentWillMount() {
      let that = this;
      
      getAccount( (err, account_addr) => {
        if(err) console.log(err)
        else {
          that.setState({
            local_address: account_addr
          })
        }
      } );
    }

    getUserBalance() {
      let balanceEth = {
        account_addr: this.state.local_address,
        unit: 'ETH'
      }
      let that = this;
      getBalance( balanceEth , (err, balance) => {
        if(err) console.log(err, 'got and error')
        else {
          that.setState({ balance })
        }
      } )

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
  
          that.getUserBalance();
        }, 5000);
        
        this.setState({isGetBalanceCalled: true});
      }

        return (
            <MuiThemeProvider>
                <div>
                  <div>
                  <div>
                    <Header balance={this.state.balance}  local_address={this.state.local_address} />
                    <div>
                    <Tabs
                          value={this.state.value}
                          onChange={this.handleChange}
                          tabItemContainerStyle={{
                            backgroundColor: '#FAFAFA'
                          }}
                          inkBarStyle={{backgroundColor: '#532d91'}}
                          >
                          <Tab style={{fontSize: 14, fontWeight: 'bold', color: '#532d91'}} label="HISTORY" value="history">
                            <History local_address={this.state.local_address} />
                          </Tab>
                          <Tab style={{fontSize: 14, fontWeight: 'bold', color: '#532d91'}} label="SEND" value="send">
                            <SendComponent local_address={this.state.local_address} />
                          </Tab>
                          <Tab style={{fontSize: 14, fontWeight: 'bold', color: '#532d91'}} label="RECEIVE" value="receive">
                            <div>
                             <h3>Work In Progress</h3>
                            </div>
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