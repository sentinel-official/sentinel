import React, {Component} from 'react';
import {
  StyleProvider,
  View,
  Drawer,
  Thumbnail,
  Fab,
  Separator,
  Container,
  List,
  ListItem,
  Card,
  CardItem,
  Header,
  Title,
  SubTitle,
  Content,
  Footer,
  FooterTab,
  Switch,
  Button,
  Left,
  Right,
  Body,
  Text
} from 'native-base';
import {DrawerNavigation} from 'react-navigation';
import {TouchableOpacity, FlatList, AsyncStorage, DrawerLayoutAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material.js';

import {StyleSheet} from 'react-native';
import SentinalBalance from './SentinelBalance.js';
import SideBarComponent from './SideBar/SideBarComponent';

export default class HomeComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      active: false,
      switchValue: true,
      account_addr: '',
      balance: '',
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      status: 'success'
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('localAddr').then((value) => {
      this.setState({'account_addr': value})
    }).done();
    this.getBalance();
  }

  getBalance() {
    let body = {
      account_addr: this.state.account_addr,
      unit: 'SENT'
    }
    fetch('http://35.198.204.28:8000/get-balance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }, console.log(body)).then((response) => response.json()).then((res, err) => {
      if (res) {
        console.log(res, "your balance")
        // alert("success");
        this.setState({'balance': res.balance})
        return res;
      } else {
        alert("error")
        return err;
      }
    })
  }
  // onChangeText(value){
  // 	this.setState({
  // 		textValue: value
  // 	})
  // }

  // onSubmit(){
  // 	alert('VPN Enabled');
  // }

  // onSwitchChange(value){
  // 	this.setState({
  // 		switchValue:value
  // 	})
  // };

  render() {
    let navigationView = (<View style={{
        flex: 1,
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center'
      }}>

      <TouchableOpacity style={styles.sidebarOptions}>
        <Text style={styles.sidebarOptionsText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarOptions}>
        <Text style={styles.sidebarOptionsText}>Sentinel VPN</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarOptions}>
        <Text style={styles.sidebarOptionsText}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarOptions}>
        <Text style={styles.sidebarOptionsText}>About Us</Text>
      </TouchableOpacity>
    </View>);
    const {navigate} = this.props.navigation;
    let token = AsyncStorage.getItem('localAddr');
    return (<StyleProvider style={getTheme(material)}>
      <DrawerLayoutAndroid drawerWidth={300} drawerPosition={DrawerLayoutAndroid.positions.Left} renderNavigationView={() => navigationView} drawerBackgroundColor='#252525'>
        <Container style={{
            flex: 1
          }}>
          <Header style={styles.headerStyle}>
            <Left>
              <Icon name='menu' size={35}/>
            </Left>
            <Body style={styles.headerBody}>
              <Title style={styles.headerText}>Dashboard</Title>
            </Body>
            <Right/>
            <Text style={styles.vpnText}>VPN :
            </Text>
            <Switch value={this.state.switchValue} onValueChange={() => this.setState({
                value: !this.state.switchValue
              })}
              // onTintColor='#D50000'
              tintColor='black'/>
          </Header>
          <Content>
            <Card style={{
                height: 160
              }}>
              <CardItem>
                <Text note={true}>
                  Your Balance
                </Text>
              </CardItem>
              <CardItem style={styles.balance}>
                <Text onPress={this.getBalance()} style={styles.balanceText}>{this.state.balance}  SENTs </Text>
                <Text>
                   =
                </Text>
                <Text style={styles.balanceText}> $ {this.state.balance}</Text>
              </CardItem>
            </Card>
            <CardItem>
              <Text note="note">Recent Acitivity</Text>
            </CardItem>
            <CardItem>
              <List>
                <ListItem icon="icon">
                  <Left>
                    <Icon name='face' size={30}/>
                  </Left>
                  <Text style={{
                      fontSize: 11
                    }}>To: {this.state.account_addr}</Text>
                </ListItem>
                <ListItem>
                  <Right/>
                  <Text style={{
                      fontSize: 20
                    }}>Amount: 500</Text>
                </ListItem>
                <ListItem>
                  <Right/>
                  <Text style={{
                      fontSize: 17
                    }}>Status: Success
                  </Text>
                  <Icon name='done-all' size={25}/>
                </ListItem>

              </List>
            </CardItem>
            <Separator bordered={true}>
              <Text style={{fontSize: 14}}>Pending Transactions</Text>
            </Separator>
            <CardItem>
              <List>
                <ListItem icon={true}>
                  <Left>
                    <Icon name='face' size={30}/>
                  </Left>
                  <Text style={{
                      fontSize: 11
                    }}>To: {this.state.account_addr}</Text>
                </ListItem>
                <ListItem>
                  <Right/>
                  <Text style={{
                      fontSize: 20
                    }}>Amount: 500</Text>
                </ListItem>
                <ListItem>
                  <Right/>
                  <Text style={{
                      fontSize: 17
                    }}>Status: Success
                  </Text>
                  <Icon name='done' size={25}/>
                </ListItem>

              </List>
            </CardItem>
            <CardItem>
              <List>
                <ListItem icon={true}>
                  <Left>
                    <Icon name='face' size={30}/>
                  </Left>
                  <Text style={{
                      fontSize: 11
                    }}>To: {this.state.account_addr}</Text>
                </ListItem>
                <ListItem>
                  <Right/>
                  <Text style={{
                      fontSize: 20
                    }}>Amount: 500</Text>
                </ListItem>
                <ListItem>
                  <Right/>
                  <Text style={{
                      fontSize: 17
                    }}>Status: Success
                  </Text>
                  <Icon name='pan-tool' size={25}/>
                </ListItem>

              </List>
            </CardItem>

          </Content>
          <View>
            <Fab active={this.state.active} direction="left" containerStyle={{
                marginBottom: 20
              }} style={{
                backgroundColor: '#5067FF'
              }} position="bottomRight" onPress={() => this.setState({
                active: !this.state.active
              })}>
              <Icon name="share"/>
              <Button onPress={() => navigate('SendSentinels')} style={{
                  backgroundColor: '#34A34F'
                }}>
                <Icon name="file-upload" size={20}/>
              </Button>
              <Button onPress={() => navigate('ReceiveSentinels')} style={{
                  backgroundColor: '#DD5144'
                }}>
                <Icon name="file-download" size={20}/>
              </Button>
            </Fab>
          </View>
        </Container>
      </DrawerLayoutAndroid>
    </StyleProvider>);
  }
}

const styles = StyleSheet.create({
  footerText: {
    fontWeight: '100',
    textAlign: 'center',
    color: '#252525',
    opacity: .7
  },
  darkRed: {
    backgroundColor: '#D50000'
  },
  test: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F44336'
  },
  footerContainer: {
    backgroundColor: '#01579B',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerContainer: {
    backgroundColor: "#252525"
  },
  HeaderText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 20
  },
  footer: {},
  balance: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  sidebarOptions: {
    width: '100%',
    height: '8%',
    backgroundColor: '#B71C1C',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2
  },
  sidebarOptionsText: {
    fontSize: 30,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center'
  },
  balanceText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#616161'

  },
  cardColor: {
    backgroundColor: '#303030',
    height: 130
  },
  hash: {
    fontSize: 13
  },
  headerStyle: {
    backgroundColor: '#B71C1C'
  },
  headerText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500'
  },
  headerBody: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  vpnText: {
    color: '#fff',
    fontWeight: '600',
    marginTop: 14,
    fontSize: 20
  }
});
