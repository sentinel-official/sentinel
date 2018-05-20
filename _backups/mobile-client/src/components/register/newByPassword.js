import React, {Component} from 'react';
import {Platform, StyleSheet, TextInput, AsyncStorage, View} from 'react-native';
import {
  Card,
  CardItem,
  Form,
  Container,
  CheckBox,
  ListItem,
  Body,
  Content,
  Text,
  Item,
  Input,
  Label,
  Button
} from 'native-base';
import {Grid, Row, Col} from 'react-native-easy-grid';

export default class NewByPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      checkbox: true,
      localAddr: '',
      keystore: ''
    }
  }
  testing = () => {
    alert(this.state.password)
  }
  // componentWillMount() {
  //   AsyncStorage.getItem("localAddr").then((value) => {
  //     this.setState({"localAddr" : value})
  //   }).done();
  // }

  render() {
    // console.log(localAddr, "Your Local Addr")
    const {navigate} = this.props.navigation;
    function alert() {
      console.log(".....clicked....")
    }
    return (<Container style={styles.container}>
      <Content>
        <View>
          <CardItem>
            <Text>LocalAddr: {this.state.localAddr}</Text>
          </CardItem>
          <CardItem>
            <Item stackedLabel="stackedLabel">
              <Label>Please Enter Password</Label>
              <Input onChangeText={(password) => this.setState({password})} value={this.state.password} secureTextEntry={true}/>
            </Item>
          </CardItem>
          <CardItem style={{
              justifyContent: 'center'
            }}>
            <Button block="block" onPress={this.createAccount} style={{
                backgroundColor: '#B71C1C',
                height: 50,
                width: 270
              }}>
              <Text style={{
                  fontSize: 25,
                  fontWeight: '400'
                }}>Create</Text>
            </Button>
          </CardItem>
          <CardItem style={{
              marginTop: 10
            }}>
            <Text note="note">Your Private Key Is:
            </Text>
          </CardItem>
          <CardItem style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Item regular="regular">
              <Text style={{
                  textAlign: 'center'
                }}>Keystore.json</Text>
              <Input/>
            </Item>
          </CardItem>
          <CardItem style={{
              marginTop: 10
            }}>
            <Text note="note">Your KeyStore Files is Stored At:
            </Text>
          </CardItem>
          <CardItem style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Item regular="regular">
              <Label style={{
                  textAlign: 'center'
                }}>/data/com.sentinel.network/keystore</Label>
              <Input/>
            </Item>
          </CardItem>
          <CardItem>
            <ListItem>
              <CheckBox checked={true} onPress={() => this.setState({
                  checked: !this.state.checkbox
                })}/>
              <Text note="note" style={{
                  marginLeft: 5
                }}>Yes, I Have Stored My Keystore Securely</Text>
            </ListItem>
          </CardItem>
        </View>
        <CardItem style={{
            justifyContent: 'center',
            height: 130
          }}>
          <Button onPress={this.kjnf} block="block" style={{
              backgroundColor: '#B71C1C',
              height: 50,
              width: 270
            }}>
            <Text style={{
                fontSize: 25,
                fontWeight: '400'
              }}>Dashboard</Text>
          </Button>
        </CardItem>
      </Content>
    </Container>);
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    // backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#01579B',
    fontSize: 30,
    fontWeight: '700'
  },
  buttonContainer: {
    backgroundColor: '#454545',
    paddingVertical: 15,
    backgroundColor: '#01579B',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  buttonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: '700'
  }
})
