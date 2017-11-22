import React, { Component } from 'react';
import { AppRegistry, View, TouchableNativeFeedback, Button, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { StackNavigator } from 'react-navigation';
import SideBarComponent from './src/components/home/SideBar/SideBarComponent';

export default class Splash extends Component{

    constructor(props){
        super(props);
        function helloMe(){
            alert("Hello")
        }
    }
    render(){
        const { navigate  } = this.props.navigation;        
        return(
            <View style={styles.bg}>
                <View style={{marginBottom: 40}}>
                 <Image style={styles.senticon}
        source={require('./src/favicon.png')} /> 
                    <Text style={styles.title}>
                        Sentinel Network
                    </Text>
                    <Text style={styles.subtitle}>
                        Powered By Ethereum
                    </Text>
                </View>
                <View style={styles.darkRed}>
                <TouchableOpacity 
                onPress={ ()=> navigate('Register') }
                style={styles.buttonContainer}>
                             <Text style={styles.buttonText}>
                                 Let's Begin
                               </Text>
                         </TouchableOpacity>
                </View>
        </View>
        )
    }
}


const styles = StyleSheet.create({
    bg:{
        // backgroundColor: '#03A9F4',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkRed: {
        backgroundColor: '#B71C1C'
    },
    title:{
        color: 'black',
        // color: 'pink',
        fontSize: 40,
        fontWeight: 'bold',
    },
    subtitle:{
        color: '#252525',
        alignSelf: 'flex-end',
        // alignItems: 'end',
        fontWeight:'200',
    },
    senticon:{
        alignSelf: 'center',
        // borderRadius:35,
        height:190,
        width:160,
        marginBottom: 10
    },
    buttonContainer:{
        backgroundColor: '#B71C1C',
        paddingVertical: 14,
        paddingHorizontal: 60,
        alignItems: 'center',
        // marginTop: 50,
        // backgroundColor: '#454545',
    },
    buttonText:{
        textAlign: 'center',
        color: '#ffffff',
        fontWeight: '800',
        fontSize: 23,
    }
});

AppRegistry.registerComponent('Splash', () => Splash);