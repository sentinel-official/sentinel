import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, PermissionsAndroid} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {Root} from 'native-base';

import Splash from './Splash';
import RegisterComponent from './src/components/register/RegisterComponent';
import RegisterationForm from './src/components/register/RegistrationForm';
import LoginComponent from './src/components/login/LoginComponent';
import HomeComponent from './src/components/home/HomeComponent';
import SendComponent from './src/components/sendSentinels/sendComponent';
import SendForm from './src/components/sendSentinels/sendForm';
import ReceiveForm from './src/components/receiveSentinels/receiveForm';
import NewByPassword from './src/components/register/newByPassword';
import ImportWallet from './src/components/register/importWallet';
import ReceiveComponent from './src/components/receiveSentinels/receiveComponent';
import SentinelBalance from './src/components/home/SentinelBalance';

const NavigationApp = StackNavigator({
  Splash: {
    screen: Splash,
    navigationOptions: {
      headerStyle: {
        display: "none"
      },
      headerLeft: null
    }
  },
  Register: {
    screen: RegisterComponent,
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#B71C1C'
      },
      headerTitleStyle: {
        color: '#FAFAFA'
      },
      // headerLeft: null,
      title: 'Sign Up For Sentinel Network'
    }
  },
  NewByPassword: {
    screen: RegisterationForm,
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#B71C1C'
      },
      headerTitleStyle: {
        color: '#FAFAFA'
      },
      // headerLeft: null,
      title: 'Sign Up With Password'
    }
  },
  ImportWallet: {
    screen: ImportWallet,
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#B71C1C'
      },
      // headerLeft: null,
      title: 'Import Your Wallet'
    }
  },
  SendSentinels: {
    screen: SendForm,
    navigationOptions: {
      title: 'Send',
      headerStyle: {
        backgroundColor: '#B71C1C'
      },
      headerTitleStyle: {
        color: '#ffffff'
      }
    }
  },
  ReceiveSentinels: {
    screen: ReceiveComponent,
    navigationOptions: {
      title: 'Receive Sentinels',
      headerStyle: {
        backgroundColor: '#B71C1C'
      },
      headerTitleStyle: {
        color: '#ffffff'
      }
    }
  },
  // RegisterForm: { screen: RegisterForm },
  Login: {
    screen: LoginComponent
  },
  Home: {
    screen: HomeComponent,
    navigationOptions: {
      headerStyle: {
        display: "none"
      },
      headerLeft: null
    }
  },
},);

async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      'title': 'Cool Photo App Camera Permission',
      'message': 'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.'
    })
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera")
    } else {
      console.log("Camera permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}

export default class App extends Component {
  render() {
    return (<NavigationApp/>);
  }
}
