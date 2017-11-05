import React, { Component } from 'react';
import { StyleProvider, View, Container, Drawer, Icon, Header, Title, Content, Footer, FooterTab, Switch, Button, Left, Right, Body, Text } from 'native-base';
import { DrawerNavigation } from 'react-navigation';
import { TouchableOpacity } from 'react-native';

import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material.js';

import { StyleSheet } from 'react-native';
import SentinalBalance from './SentinelBalance.js';
import TxRx from './TxRx.js';
import SideBarComponent from './SideBar/SideBarComponent';
//import RxHistoryComponent   from '../RxHistory/ReceivedSentinel';

export default class HomeComponent extends Component {

	constructor(props) {
	  super(props);
	  this.state = {

	  }
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

	   	render(){
	   		const { navigate } = this.props.navigation;
		return(
			<StyleProvider style={getTheme(material)}>
				<Container>	
				<Header style={styles.headerStyle}>
					<Left>
						<Button transparent>
						<Icon name='menu' />
						</Button>
					</Left>
					<Body style={styles.headerBody}>
						<Title style={styles.headerText}>Dashboard</Title>
					</Body>
					<Right />
						<Text style={styles.vpnText}>VPN</Text>
						<Switch 
							// onClick={value = false}
							value = {false}
							// onValueChange={(value)=> this.onChangeText(value)}
							// onSubmitEditing={this.onSubmit}
					 	/>
				</Header>
                <Content >
                	// <SideBarComponent />
                    <SentinalBalance 
					   	navigate={this.props.navigation}/>
                </Content>
		<Footer>
            <FooterTab style={styles.darkRed}>
				<TouchableOpacity 
				// onPress={()=> navigate('sendSentinels')}
				style={styles.test}>
            		<Text style={styles.HeaderText}>Send</Text>
            	</TouchableOpacity>
            </FooterTab>

            <FooterTab style={styles.darkRed}>
            	<TouchableOpacity
            	 	// onPress={()=> navigate('receiveSentinels')}
            	  	style={styles.test}>
            		<Text style={styles.HeaderText}>Details</Text>
            	</TouchableOpacity>
            </FooterTab> 

            <FooterTab style={styles.darkRed}>
            	<TouchableOpacity
            	 	// onPress={()=> navigate('receiveSentinels')}
            	  	style={styles.test}>
            		<Text style={styles.HeaderText}>Receive</Text>
            	</TouchableOpacity>
            </FooterTab>
		</Footer>
            </Container>
		</StyleProvider>
			);
}
}



const styles = StyleSheet.create({
	footerText:{
		fontWeight: '100',
		textAlign: 'center',
		color: '#252525',
		opacity: .7
	},
	darkRed: {
		backgroundColor: '#D50000'
	},
	test:{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F44336'
	},
	footerContainer:{
		backgroundColor: '#01579B',
		justifyContent: 'center',
		alignItems: 'center'
	},
	headerContainer:{
		backgroundColor: "#252525"
	},
	HeaderText:{
		color: '#fff',
		fontWeight: '500',
		fontSize: 20
	},
	footer:{

	},
	headerStyle:{
		backgroundColor: '#F44336'
	},
	headerText:{
		textAlign: 'center',
		fontSize: 20,
		fontWeight: '500'
	},
	headerBody:{
		justifyContent: 'center',
		alignItems: 'center'
	},
	vpnText:{
		color: '#fff',
		fontWeight: '200'
	}
});