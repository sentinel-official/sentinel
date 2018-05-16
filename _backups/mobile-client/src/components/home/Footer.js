import React, { Component } from 'react';
import { Footer, FooterTab, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default class FooterComponent extends Component {
    render(){
        return(
            <View><Text>Helllo</Text></View>
        )
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