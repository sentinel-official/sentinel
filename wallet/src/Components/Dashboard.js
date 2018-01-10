import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Toolbar, ToolbarGroup, ToolbarSeparator ,TextField, RaisedButton, Chip, Tabs, Tab } from 'material-ui';
import SendComponent from './SendComponent';
import tab from 'material-ui/svg-icons/action/tab';
import Header from './Header';
import transferAmount from '../Actions/AccountActions';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'send',
            password: '',
            activeTab: 'purple',
            color: 'purple'
        }
        this.set = this.props.set;
    }

    handleChange = (value) => {
      this.setState({
        value: value,
        color: 'orange'
      });
    };

    render() {
        return (
            <MuiThemeProvider>
                <div>
                  <div>
                  <div>
                    <Header local_address="0xiuwebfiuwebiufbiewfadns" />
                    <div>
                    <Tabs
                          value={this.state.value}
                          onChange={this.handleChange}
                          tabItemContainerStyle={{
                            backgroundColor: '#FAFAFA'
                          }}
                          inkBarStyle={{backgroundColor: 'purple'}}
                          >
                          <Tab style={{fontSize: 20, fontWeight: 'bold', color: 'purple'}} label="HISTORY" value="history">
                            <div>
                              history
                            </div>
                          </Tab>
                          <Tab style={{fontSize: 20, fontWeight: 'bold', color: 'purple'}} label="SEND" value="send">
                            <SendComponent />
                          </Tab>
                          <Tab style={{fontSize: 20, fontWeight: 'bold', color: 'purple'}} label="RECEIVE" value="receive">
                            <div>
                             rx
                            </div>
                          </Tab>
                        </Tabs>
                    </div>
                    <hr style={{backgroundColor: '#6a1b9a', fontSize: 20, fontWeight: 'bold', color: '#6a1b9a'}} />
                </div>
                  </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Dashboard;