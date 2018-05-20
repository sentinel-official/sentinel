import React, {Component} from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  StatusBar,
  Right,
  Left,
  View,
  Modal,
  KeyboardAvoidingView
} from 'react-native';
import {
  Container,
  Content,
  Card,
  Button,
  CardItem,
  Input,
  Form,
  Text,
  Item,
  Label,
  ListItem,
  CheckBox
} from 'native-base';
import {Grid, Row, Col} from 'react-native-easy-grid';

export default class RegisterationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      checkbox: false,
      localAddr: '',
      keystore: '',
      creatingAccount: false,
      disabled: true
    }
  }

  renderCurrentState() {
    if (this.state.creatingAccount) {
      return (<View>
        <ActivityIndicator size="large"/>
      </View>)
    }
  }
  componentWillMount() {
    this.navigateHome();
    this.showToken();
  }
  createAccount = () => {
    fetch('http://35.198.204.28:8000/create-new-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({password: this.state.password})
    }).then((response) => response.json()).then((res) => {
      if (res) {
        let localAddr = res.account_addr;
        let keystore = JSON.stringify(res.keystore);
        AsyncStorage.setItem('localAddr', localAddr);
        AsyncStorage.setItem('keystore', keystore);
        this.setState({
          localAddr: res.account_addr
        })
        // let localAddr = AsyncStorage.getItem('localAddr');
        // this.setState({'localAddr': localAddr, 'keystore': keystore});
        alert('success')
      } else {
        alert("Error: ");
      }
    }).done();
  }

  showError() {
    alert("Please Create An Account First")
  }

  navigateHome() {
    let publicKey = AsyncStorage.getItem('localAddr');
    if (!AsyncStorage.getItem('localAddr')) {
      alert("Please Create A New Account First")
    } else if (AsyncStorage.getItem('localAddr')) {}
  }
  clearAsync() {
    AsyncStorage.removeItem('localAddr');
  }
  showToken = async ()=> {
    try{
      const token = await AsyncStorage.getItem('localAddr');
      this.setState({
        localAddr: token
      })
      console.log(token, 'your token')
    } catch(error){
      console.log(error, 'error')
    }
  }

  render() {
    const {navigate} = this.props.navigation;
    return (<Container style={styles.container}>
      <Card>
        <CardItem>
          <Item floatingLabel={true}>
            <Label>Please Enter Password</Label>
            <Input onChangeText={(password) => this.setState({password})} value={this.state.password} secureTextEntry={true}/>
          </Item>
        </CardItem>
        <CardItem>
          <Text style={{
              fontSize: 14
            }}>Your Wallet: {JSON.stringify(AsyncStorage.getItem('localAddr')[0])}</Text>
        </CardItem>
      </Card>
      <Card style={styles.center}>
        <Grid>
          <Col>
            <Row>
              <CardItem>
                <Text style={{
                    textAlign: 'center'
                  }}>Your Keystore Will Be Stored At:</Text>
              </CardItem>
            </Row>
            <Row>
              <CardItem>
                <Item regular={true}>
                  <Label style={{
                      textAlign: 'center'
                    }}>/data/com.sentinel.network/keystore</Label>
                  <Input/>
                </Item>
              </CardItem>
            </Row>
          </Col>
        </Grid>
      </Card>
      <Card style={styles.containerchild1}>
        <Grid>
          <Col>
            <Row>
              <ListItem>
                <CardItem>
                  <CheckBox checked={this.state.checkbox} onPress={() => this.setState({
                      checked: !this.state.checkbox
                    })}/>
                  <Text note="note" style={{
                      marginLeft: 14,
                      textAlign: 'center'
                    }}>Yes, I Have Stored My Keystore Securely</Text>
                </CardItem>
              </ListItem>
            </Row>
            <Row>
              <CardItem style={styles.center}>
                <ListItem>
                  <CheckBox checked={this.state.checkbox} onPress={() => this.setState({
                      checked: !this.state.checkbox
                    })}/>
                  <Text note="note" style={{
                      marginLeft: 5,
                      textAlign: 'center'
                    }}>Yes, I Agree To Sentinel Network's User Policy</Text>
                </ListItem>
              </CardItem>
            </Row>
            <Row style={{justifyContent: 'center'}}>
              <Button onPress={this.createAccount}
                // onPress={this.createAccount.bind(this)}
                style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Get Wallet</Text>
              </Button>
              <Button
                onPress={this.state.localAddr !== null
                  ? () => navigate('Home')
                  : this.showError.bind(this)}
                  style={styles.buttonContainer}
                  >
                <Text style={styles.buttonText}>DashBoard</Text>
              </Button>
            </Row>
          </Col>
        </Grid>
      </Card>

    </Container>);
  }
}
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    // justifyContent: 'center', alignItems: 'center'
  },
  containerchild1: {
    flex: 2
  },
  containerchild2: {
    flex: 4
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: '700'
  },
  darkRed: {
    backgroundColor: '#D50000'
  },
  buttonContainer: {
    paddingVertical: 20,
    margin: 5,
    width: '40%',
    height: 55,
    marginTop: 10,
    backgroundColor: '#B71C1C',
    justifyContent: 'center'
  }
});
