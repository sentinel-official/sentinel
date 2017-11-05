import React, { Component } from 'react';
import { Platform, TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Card, CardItem } from 'native-base';



export default class WalletAddress extends Component {
   
    constructor(props) {
      super(props);
    }
   

  render() {
      const { navigate } = this.props.navigation;
      function alert(){
        console.log(".....clicked....")
      }
    return (
        <View>
          <View /* style={StyleSheet.container} */ >
            <Text style={styles.text}>Your Wallet Address: </Text>
            <Text style={styles.text}>"0xa75b6544e9ffb1a4a364936d9684a5a47f22b99f"</Text>
          </View>


      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={()=> navigate('Home')}
        // onPress={alert}
      >
        <Text style={styles.buttonText}>Dashboard </Text>
      </TouchableOpacity>
      </View>
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


