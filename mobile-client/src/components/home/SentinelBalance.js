import React, { Component }  from 'react';
import {StyleSheet, FlatList, View } from 'react-native';
import {Container, Content, Card, CardItem, Icon, Right, Header, Switch, Text, Body}  from 'native-base';
import TxRx from './TxRx.js';

export default class SentinelBalance extends Component {
	
	constructor(props){
		super(props); 
		 this.state = {
			// data: []
		};
		// fetchDetails = async () => {
		// 	const response = await fetch('https://randomuser.me/api?results=10');
		// 	console.log("=>=>=>=>=>", response)
		// 	const json = await response.json();
		// 	this.setState({data: json.results})
		// 	console.log(json, "=>=>=>=>=>=>");
		//   }
		
	}

	render(){
		return(
			<Container>
			<Content>
				<Card style={{height: 150}}>
					<CardItem>
						<Text note>
							Your Balance
						</Text>
					</CardItem>
					<CardItem style={styles.balance}>
						<Text 
						 style={styles.balanceText}>0.00 SENTs</Text>
						<Text>   =   </Text>
						<Text style={styles.balanceText}>0.00 Eths</Text>
					</CardItem>
				</Card>
				<Card>
				  <CardItem>
				  	<Text note>
							Recent Activity
						</Text>
				  </CardItem >
					<CardItem>
						<Text style={styles.hash}>0x18b62758ced1bba03fb52689313573e09902c415 </Text>
						<Right>
							<Icon name='arrow-forward' />
						</Right>
					</CardItem>
					<CardItem>
						<Text style={styles.hash}>0xf8d1f4738a81b8a0ca19a3f494e10009cda3aa01</Text>
						<Right>
							<Icon name='arrow-forward' />
						</Right>
					</CardItem>>
				</Card>
			</Content>
			</Container>
		);
	}
}
const styles = StyleSheet.create({
	balance:{
		justifyContent: 'center',
		alignItems: 'center',

	},
	balanceText:{
		fontSize: 30,
		fontWeight: '700',
		color: '#616161'

	},
	cardColor:{
		backgroundColor: '#303030',
		height: 130
	},
	hash:{
		fontSize: 13
	}
});