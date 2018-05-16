import React, { Component } from 'react';
import { StyleSheet, StatusBar, Right, Picker, TextInput, View, AsyncStorage } from 'react-native';
import { Form, Container, Content, Text, Button, Card, Item as FormItem, CardItem,  } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import QRCode from 'react-native-qrcode';

const Item = Picker.Item;

export default class ReceiveForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			addr: '',
			selected3: "key0",
			selected4: "key1"
		}
	}
	onValueChange3(value: string) {
		this.setState({
		  selected3: value
		});
	  }
	  onValueChange4(value: string) {
		this.setState({
		  selected4: value
		});
	  }
	  componentWillMount(){
		  AsyncStorage.getItem('localAddr').then((value) => {
			  this.setState({
				  'addr': value
			  })
		  })
	  }

	render(){
		function successMsg(){
			alert('Submitted For Mining');
		}      		
		return(
			<Container>
				<Content>
					<Card style={{height: 628}}>
						<CardItem>
							<Text note style={{textAlign: 'center'}}>Tap To Copy This Address. Share It Via Text or Email To Receive Sentinels.</Text>
						</CardItem>
						<CardItem style={{justifyContent: 'center', alignItems: 'center'}}>
						<QRCode
						value={this.state.addr}
						size={220}
						bgColor='black'
						fgColor='white'/>
						</CardItem>
						<CardItem style={{justifyContent: 'center', alignItems: 'center'}}>
							<Text>Your Address: </Text>
							<Text note style={{fontSize: 12}}>{this.state.addr}</Text>
						</CardItem>
						<CardItem>
						<Grid>
						<Col>
							<Picker
							mode="dropdown"
							iosHeader="Your Header"
							selectedValue={this.state.selected3}
							onValueChange={this.onValueChange3.bind(this)}
							>
							<Item label="SENTs" value="key0" />
							<Item label="ETH" value="key1" />
							<Item label="BTC" value="key2" />
							<Item label="USD" value="key3" />
							<Item label="INR" value="key4" />
							</Picker>
						</Col>
						<Col>
						<Picker
						mode="dropdown"
						iosHeader="Your Header"
						selectedValue={this.state.selected4}
						onValueChange={this.onValueChange4.bind(this)}
						>
						<Item label="SENTs" value="key0" />
						<Item label="ETH" value="key1" />
						<Item label="BTC" value="key2" />
						<Item label="USD" value="key3" />
						<Item label="INR" value="key4" />
						</Picker>
						</Col>
					</Grid>
						</CardItem>
						<CardItem>
						<Grid>
							<Col>
								<TextInput placeholder='Amount' underline={true}/>
							</Col>
							<Col>
								<TextInput placeholder='Converted Amount'/>
						</Col>
						</Grid>
					</CardItem>
					<View style={{alignItems: 'center'}}>
					<CardItem style={{paddingTop: 30}}>
					<Button onPress={() => navigate('ImportWallet')} style={styles.buttonContainer}><Text style={{textAlign: 'center', fontWeight: '500', fontSize: 24}}>Request</Text></Button>						
					</CardItem>
					</View>
					</Card>
				</Content>
			</Container>
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
		backgroundColor: '#B71C1C',
		paddingVertical: 15,
		paddingHorizontal: 70
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