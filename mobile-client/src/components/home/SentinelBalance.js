import React, { Component }  from 'react';
import {StyleSheet, View } from 'react-native';
import {Container, Content, Card, Left, CardItem, Footer, FooterTab, Icon,Thumbnail, Right, List, ListItem, Header, Switch, Text, Body}  from 'native-base';
import TxRx from './TxRx.js';

export default class SentinelBalance extends Component {
	
	constructor(props){
		super(props); 
		 this.state = {
			// data: [],
			SentSentinels: '1000',
			To: '0xkduek43nj5jsksfeoq93nf491',
			date: Date.now()
		};
		
		
	}

	render(){
		return(
			<Container>
			<Content>
				<Card>
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
				<CardItem><Text note>Recent Activity</Text></CardItem>
					
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