import React, { Component  } from 'react';
import { AppRegistry, Text, KeyboardAvoidingView, Image, View, StyleSheet, TextInput  } from 'react-native';
import SendForm from './sendForm';

export default class ReceiveComponent extends Component{


	constructor(props) {
	  super(props);
	
	  // this.state = {};
	}
	render(){
		console.log(this.props,"jow")
        const { navigate  } = this.props.navigation;        
		return(
			<SendForm navigate={this.props.navigation}/>
		);

	}

}


const styles = StyleSheet.create({
	container:{
		  flex:1,
		  backgroundColor: '#252525'
    },
	logo:{
		 height: 160,
		 width:160
    },
	logoContainer:{
		 alignItems: 'center',
		 justifyContent: 'center',
		 flexGrow: 1
    }
});


