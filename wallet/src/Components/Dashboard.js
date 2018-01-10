import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Toolbar, ToolbarGroup, TextField, RaisedButton, Chip, Tabs, Tab } from 'material-ui';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            keystore: '',
            file: ''
        }
        this.set = this.props.set;
    }
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <Toolbar style={{ backgroundColor: '#223366' }}>
                        <ToolbarGroup>
                            <center><p style={{ color: 'white' }}>Dashboard</p></center>
                        </ToolbarGroup>
                    </Toolbar>
                    <Tabs inkBarStyle={{ backgroundColor: 'black' }} tabItemContainerStyle={{ backgroundColor: 'whitesmoke' }}>
                        <Tab label="My Wallet" buttonStyle={{ textTransform: 'capitalize', color: 'black' }}>My Wallet</Tab>
                        <Tab label="VPN List" buttonStyle={{ textTransform: 'capitalize', color: 'black' }}>VPN List</Tab>
                        <Tab label="Transfer" buttonStyle={{ textTransform: 'capitalize', color: 'black' }}>Transfer</Tab>
                        <Tab label="VPN Status" buttonStyle={{ textTransform: 'capitalize', color: 'black' }}>VPN Status</Tab>
                    </Tabs>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Dashboard;