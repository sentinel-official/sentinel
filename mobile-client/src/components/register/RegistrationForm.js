import React, { Component } from 'react';
import { StyleSheet, StatusBar, Button, Right, TextInput, View, Text, TouchableOpacity } from 'react-native';

export default class RegisterationForm extends Component {
	constructor(props){
		super(props);
		console.log('----', this.props)
	}

	render(){
		const { navigate  } = this.props.navigate;        		
		return(
	<View style={styles.container}>
	               <StatusBar
	                barStyle='light-content'
	               />
	                 <TextInput
	                     placeholder='Only A Password Is Required'
	                     placeholderTextColor="#252525"
	                     autoCapitalize='none'
	                     autoCorrect={false}
	                     returnKeyType="next"
	                     secureTextEntry={true}
						 // style={styles.white}
	                 />

		<View style={styles.darkRed}>
		<TouchableOpacity
			onPress={ ()=> navigate('sendSentinels') }
			style={styles.buttonContainer}>
	                     <Text style={styles.buttonText}>
	                         Generate Wallet Address
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
		// backgroundColor: '#454545',
		paddingVertical: 15,
		backgroundColor: '#F44336',
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