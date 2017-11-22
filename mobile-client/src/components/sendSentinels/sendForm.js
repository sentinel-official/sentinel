import React, { Component } from 'react';
import { StyleSheet, StatusBar, Slider, Right, TextInput, View, AsyncStorage, Text, TouchableOpacity } from 'react-native';
import { Picker, Card, CardItem, Label, Button, Input, Item as FormItem, Form, Content, Container, Icon } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';

const Item = Picker.Item;

export default class SendForm extends Component {

	

	constructor(props){
		super(props);
		 this.state = {
				localAddr: '',
				recepientAddr: '',
				unit: 'SENT',
				amount: null,
				keystore: '',
				gas: 90000,
				password: '',
				selected3: "key0",
				selected4: "key1",
				file: '',
		};
		this.doTransaction.bind(this);
	}	
	
	onValueChange3 = (value: string) => {
		this.setState({
		  selected3: value
		});
	  }

	onValueChange4 = (value: string) => {
		this.setState({
		  selected4: value
		});
	  }
	  

	componentWillMount() {
		AsyncStorage.getItem('keystore').then((value) => {
			this.setState({
				'keystore': value
			})
		}).done();
		AsyncStorage.getItem('localAddr').then((value) => {
			this.setState({
				'localAddr': value
			})
		}).done();
		
	}


	doTransaction = () => {
		let body = {
			from_addr: this.state.localAddr,
			to_addr: this.state.recepientAddr,
			unit: this.state.unit,
			amount: this.state.amount,
			gas: this.state.gas,
			password: this.state.password,
			keystore: this.state.keystore
		};
		fetch('http://35.198.204.28:8000/send-amount', {
			method: 'POST',
		    headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json',
		  },
			body: JSON.stringify(body)
		})
		.then((response) => response.json())
		.then((res, err) => {	
			if (res){
			  console.log(res, "sending response")
				alert("Transaction Initiated");
			} else {
				  alert(err);
				//   console.log(err)
			}
		})
		.done();
	}

	render(){       		
		return(
				<Container>
					<Content>
						<Card style={{justifyContent: 'center', margin:0, height: 623}}>
							<Form>
								<CardItem><Text style={{fontSize: 20, fontWeight: '400'}}>To</Text></CardItem>
							<CardItem>
							<Grid>
							  <Col>
								<TextInput 
								onChangeText={(recepientAddr) => this.setState({recepientAddr})}
								value={this.state.recepientAddr} placeholder='Recepient Address'/>
							  </Col>
							</Grid>
							</CardItem>
							<CardItem>
							<Grid>
								<Col>
									<Picker
										mode="dropdown"
										iosHeader="Your Header"
										selectedValue={this.state.selected3}
										// onValueChange={onValueChange3.bind(this)}
										>
										<Item label="SENTs" value="key0" />
										<Item label="ETH" value="key1" />
										<Item label="BTC" value="key2" />
										<Item label="USD" value="key3" />
										<Item label="INR" value="key4" />
									</Picker>
									<TextInput placeholder='Amount' onChangeText={(amount) => this.setState({amount})} value={this.state.amount} underline={true}/>
								</Col>
								<Col>
								<Picker
									mode="dropdown"
									iosHeader="Your Header"
									selectedValue={this.state.selected4}
									// onValueChange={this.onValueChange4.bind(this)}
									>
									<Item label="SENTs" value="key0" />
									<Item label="ETH" value="key1" />
									<Item label="BTC" value="key2" />
									<Item label="USD" value="key3" />
									<Item label="INR" value="key4" />
							</Picker>
								<TextInput placeholder='Converted Amount'/>
								</Col>
							</Grid>
						</CardItem>
						<CardItem>
						<Text>Gas Fee</Text>
						</CardItem>
						<CardItem><Grid><Col><Slider></Slider></Col></Grid></CardItem>
							</Form>
							<View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
							<Text style={{fontSize: 20, fontWeight: '600'}}>0.06 SENTs</Text>
							</View>	
							<View style={{alignItems: 'center'}}>
							<CardItem style={{paddingTop: 30}}>
							<Button onPress={this.doTransaction} style={styles.buttonContainer}><Text style={{textAlign: 'center', fontWeight: '500', fontSize: 24, color: '#ffffff'}}>Send</Text></Button>						
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
		backgroundColor: '#D50000',
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