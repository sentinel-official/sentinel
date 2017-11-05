import React, { Component } from 'react';
import { StyleSheet, StatusBar, Button, Right, TextInput, View, AsyncStorage, Text, TouchableOpacity } from 'react-native';
import SideBarComponent from '../home/SideBar/SideBarComponent';

export default class SendForm extends Component {
	constructor(props){
		super(props);
		// console.log('----', this.props)
		 this.state = {
	  		localAddr: '',
	  		remoteAddr: '',
	  		amount: ''
	  		// body: 'This, invincible body'
	  };
	  // sendTx =  () => {
	  // 	alert(this.state.remoteAddr)
	  // }
	  sendTransaction = () => {
	  	fetch('http://192.168.1.12:3000/api/newuser', {
	  		method: 'POST',
 		    headers: {
    			'Accept': 'application/json',
    			'Content-Type': 'application/json',
    		},
  			body: JSON.stringify({
    			name: this.state.localAddr,
    			username: this.state.remoteAddr,
    			email: this.state.amount
    			// body: this.state.body
    		})
  		})
  		.then((response) => response.json())
  		.then((res) => {
  			
  			if (res){
  				console.log("sexy")
  				var localAddr = res.name;
  				AsyncStorage.setItem('localAddr', localAddr);
  				// this.props.navigator.push({
  				// 	screen: 'Home'
  				// })
  				alert("success")
  			} else {
  				alert("Error: ", res.name);
  			}
  		})
  		.done();
  		// console.log(body, " this body");
	  }
	}

	render(){
		// function miningMsg(){
		// 	alert("Submitted Your Transaction For Mining")
		// }
		const { navigate  } = this.props.navigate;        		
		return(
			<View style={styles.container}>
	               <StatusBar
	                barStyle='light-content'
	               />
	                 <TextInput
	                     placeholder='Your Wallet Address'
	                     placeholderTextColor="#252525"
	                     autoCapitalize='none'
	                     autoCorrect={false}
	                     returnKeyType="next"
	                     secureTextEntry={false}
	                     onChangeText={(localAddr) => this.setState({localAddr})}
	                     value={this.state.localAddr}
						 // style={styles.white}
	                 />
	                 <TextInput
	                     placeholder='Remote Wallet Address'
	                     placeholderTextColor="#252525"
	                     autoCapitalize='none'
	                     autoCorrect={false}
	                     returnKeyType="next"
	                     secureTextEntry={false}
	                     onChangeText={(remoteAddr) => this.setState({remoteAddr})}
	                     value={this.state.remoteAddr}
						 // style={styles.white}
	                 />
	                 <TextInput
	                     placeholder='Amount'
	                     placeholderTextColor="#252525"
	                     autoCapitalize='none'
	                     autoCorrect={false}
	                     returnKeyType="next"
	                     secureTextEntry={false}
	                     onChangeText={(amount) => this.setState({amount})}
	                     value={this.state.amount}
						 // style={styles.white}
	                 />

		<View style={styles.darkRed}>
		<TouchableOpacity
			onPress={sendTransaction}
			style={styles.buttonContainer}>
	                     <Text style={styles.buttonText}>
	                         Transfer
	                       </Text>
	                 </TouchableOpacity>
	                 </View>
		</View>		
	);
}
}

const styles = StyleSheet.create({
	container:{
		padding: 20
	},
	buttonText:{
		textAlign: 'center',
		color: '#ffffff',
		fontWeight: '700',
	},
	darkRed: {
		backgroundColor: '#D50000'
	},
	input:{
		
		height:50,
		backgroundColor: 'rgba(255,255,255,0.1)',
		marginBottom: 10,
		color: '#ffffff',
		paddingHorizontal: 10
	},
	buttonContainer:{
		backgroundColor: '#F44336',
		paddingVertical: 15,
		// backgroundColor: '#01579B',
	},
	nextButton:{
		// backgroundColor: '#454545',
		// paddingVertical: 15,
		backgroundColor: '#01579B',
	},
	nextButtonText:{
		textAlign: 'center',
		color: '#ffffff',
		fontWeight: '700',
	},
	white:{
		
	},

});