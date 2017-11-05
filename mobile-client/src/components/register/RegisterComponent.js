import React, { Component  } from 'react';
import { Text, KeyboardAvoidingView, Image, View, StyleSheet, TextInput  } from 'react-native';
import RegisterForm from './RegistrationForm';

export default class RegisterComponent extends Component{

	static NavigationOptions = {
		title: 'Registeration'
	}

	render(){
        // const { navigate  } = this.props.navigation;        
		return(
			<View style={styles.container}>
			    <View style={styles.logoContainer}>
			        <Image
			            style={styles.logo}
			            source={require('../../favicon.png')} />
			        <Text style={styles.textStyle1}>
			        	Join The Sentinel Network
			        </Text>
			        <Text style={styles.textStyle2}>
			        	And Be Annoymous
			        </Text>
                </View>
			    <View style={styles.formContainer}>
			        <RegisterForm 
			        navigate={this.props.navigation}
			        />
			    </View>
            </View>

		);

	}

}


const styles = StyleSheet.create({
	container:{
		  flex:1,
		  // backgroundColor: '#252525'
    },
	logo:{
		 height: 190,
		 width:160
    },
	logoContainer:{
		 alignItems: 'center',
		 justifyContent: 'center',
		 flexGrow: 1
    },
    formContainer:{
    	paddingBottom: 40
    },
    textStyle1:{
    	fontSize: 26,
    	fontWeight: 'bold',
    	color: '#252525',
    	marginTop: 10
    },
    textStyle2:{
    	fontSize: 22,
    	fontWeight: 'bold',
    	color: '#252525',
    	marginTop: 7
    }
});


