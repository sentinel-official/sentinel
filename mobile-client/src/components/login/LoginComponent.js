import React, { Component  } from 'react';
import { AppRegistry, Text, KeyboardAvoidingView, Image, View, StyleSheet, TextInput  } from 'react-native';
// import RegisterForm from './RegistrationForm';

export default class RegisterComponent extends Component{

	static NavigationOptions = {
		title: 'Login'
	}
	render(){
        // const { navigate  } = this.props.navigation;        
		return(
			<View style={styles.container}>
			    <Text>
					Login Component
				</Text>
            </View>

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


