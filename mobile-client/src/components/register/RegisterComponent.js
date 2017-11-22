import React, {Component} from 'react';
import {KeyboardAvoidingView, Image, View, StyleSheet, TextInput} from 'react-native';
import {
  Container,
  Content,
  Card,
  Button,
  CardItem,
  Input,
  Form,
  Text
} from 'native-base';

import RegisterForm from './RegistrationForm';

export default class RegisterComponent extends Component {

  notAvailable() {
    alert("This Feature Is Not Yet Available")
  }
  render() {
    const {navigate} = this.props.navigation;
    return (<Container style={styles.container}>
      <Card style={styles.alignButtons}>
        <CardItem>
          <Button onPress={() => navigate('NewByPassword')} style={styles.buttonContainer}>
            <Text style={{
                textAlign: 'center',
                fontWeight: '500',
                fontSize: 24
              }}>New Wallet</Text>
          </Button>
        </CardItem>
        <CardItem>
          <Button
            //  onPress={() => navigate('ImportWallet')}
            onPress={this.notAvailable} style={styles.buttonContainer}>
            <Text style={{
                textAlign: 'center',
                fontWeight: '500',
                fontSize: 24
              }}>Import Wallet</Text>
          </Button>
        </CardItem>
      </Card>
    </Container>);

  }

}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#FAFAFA'
  },
  logo: {
    height: 190,
    width: 160
  },
  alignButtons: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    backgroundColor: '#B71C1C',
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    height: 70
  },
  formContainer: {
    paddingBottom: 40
  },
  textStyle1: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#252525',
    marginTop: 10
  },
  textStyle2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#252525',
    marginTop: 7
  }
});
