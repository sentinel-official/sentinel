import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Splash from './Splash';
import RegisterComponent from './src/components/register/RegisterComponent';
import RegisterForm from './src/components/register/RegistrationForm';
import LoginComponent from './src/components/login/LoginComponent';
import HomeComponent from './src/components/home/HomeComponent';
import TxComponent from './src/components/transactions/tx/TxComponent';
import RxComponent from './src/components/transactions/rx/RxComponent';
import SideBarComponent from './src/components/home/SideBar/SideBarComponent';
import SendComponent from './src/components/sendSentinels/sendComponent';
import ReceiveComponent from './src/components/receiveSentinels/receiveComponent';
import WalletAddress from './src/components/register/walletAddress';
import TxRx from './src/components/home/TxRx';
import SentinelBalance from './src/components/home/SentinelBalance';

const NavigationApp = StackNavigator({
  Splash: { screen: Splash,
    navigationOptions: {
    headerStyle: {display:"none"},
    headerLeft: null
  },
   },
  Register: { screen: RegisterComponent, 
    navigationOptions: {
    headerStyle: {display:"none"},
    headerLeft: null
  },
   },
   sendSentinels: { screen: SendComponent, 
    navigationOptions: {
      title: 'Transfer Sentinels'
  },
   },
   receiveSentinels: { screen: ReceiveComponent, 
    navigationOptions: {
      title: 'Receive Sentinels'
  },
   },
  RegisterForm: { screen: RegisterForm },
  WalletAddress: { screen: WalletAddress },
  Login: { screen: LoginComponent },
  Home: { screen: HomeComponent, 
    navigationOptions: {
    headerStyle: {display:"none"},
    headerLeft: null
  }, },
  Tx: { screen: TxComponent },
  Rx: { screen: RxComponent },
},
);

export default class App extends Component {
  render() {
    return (
      <NavigationApp />
    );
  }
}


