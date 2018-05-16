import React, { Component } from 'react';
import { StyleProvider, Button, Header, CardItem, Body, Icon, Switch, Right, Left, Text, Container, Content, Card } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material.js';
//import RxHistoryComponent from '../RxHistory/ReceivedSentinels'
// import { StackNavigator } from 'react-navigation';

// const Nav = StackNavigator({

// })
// import TxComponent from 

export default class TxRx extends Component {
	// static navigationOptions = {
	// 	title: 'TxRx',
	// };


	constructor(props) {
	  super(props);
	
	  // this.state = {};
	}
	render(){
		console.log("noooo " +this.props.navigate.navigate)
		// const { navigate } = this.props.navigation;
		function sayPoor(){
			alert('Uh, Ah! You Are Poor')
		}
		function openDrawer(){
		console.log("heyyew",this.props)
	}
		return(
			<StyleProvider style={getTheme(material)}>
			<Container>
			  <Content>
			    <Card>
			      <CardItem>
				<Text>Yesterday</Text>
				<Text>Received</Text>
				<Right />
				<Button
				 onPress={ ()=> this.props.navigate.navigate('Rx') } 
				 title="Go To RxHistory"
				dark>
			<Text>Rx Details </Text>
				</Button>
		         	</CardItem>
				<CardItem>

				<Text>Yesterday</Text>
				<Text>Sent</Text>
			<Right />
			<Button
				dark
			 onPress={()=> this.props.navigate.navigate('Tx')} 
			>
			<Text>Tx Details</Text>
			</Button>
				</CardItem>
			    </Card>
			</Content>
			</Container>

			</StyleProvider>
		);
	}
}
const styles = StyleSheet.create({
	txrxContainer:{
		justifyContent: 'space-between'
	},
	white:{
		backgroundColor:'#fff'
	}
});
