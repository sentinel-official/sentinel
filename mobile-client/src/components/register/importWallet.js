import React, { Component } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Card, CardItem, Container, Content, Text, Input, Button } from 'native-base';



export default class ImportWallet extends Component {
   
    constructor(props) {
      super(props);
    }
   

  render() {
      const { navigate } = this.props.navigation;
      function alert(){
        console.log(".....clicked....")
      }
    return (
        <Container>
            <Content>
                <Card>
                    <Text note style={{fontSize: 28}}>Welcome!</Text>
                </Card>
            </Content>
        </Container>
    );
  }
}


const styles = StyleSheet.create({
  container:{
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text:{
      color: '#01579B',
      fontSize: 30,
      fontWeight: '700',
  },
  buttonContainer:{
    backgroundColor: '#454545',
    paddingVertical: 15,
    backgroundColor: '#01579B',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  buttonText:{
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: '700',
  }
})
