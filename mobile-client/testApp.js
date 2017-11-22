import React, { Component } from 'react';
import { TouchableHighlight, Text, View, StyleSheet } from 'react-native';

import { connect } from 'react-redux';
import fetchTxFromAPI from './actions';


let styles
const App = (props) => {
    const {
        container,
        text,
        button,
        buttonText
    } = styles
    const { tx, isFetching } = tx
        return (
        <View style={container}>
            <Text style={text}>
                 Redux App
            </Text>
            <TouchableHighlight
            style={button}
            onPress={props.getTx}
            >
            <Text style={buttonText}>
                Fetch Transactions
            </Text>
            </TouchableHighlight>
            {
                isFetching && <Text>Loading...</Text>
            }
            {
                tx.length ? (
                    tx.map((tx, index) => {
                        return(
                            <View key={index}>
                            <Text>Name: {tx.name}</Text>
                            <Text>Time: {tx.birth_year}</Text>
                            </View>
                        )
                    })
                ) :null
            }
        </View>
        )
}

function mapStateToProps() {
    return{
        txs: state.TxReducer
    }
}

function mapDispatchToProps() {
    return {
        getTx: () => dispatch(fetchTxFromAPI())
    }
}

export default (mapStateToProps, mapDispatchToProps)(App)



const styles = StyleSheet.create({
    container: {
        marginTop: 100,
        paddingLeft: 20,
        paddingTop: 20,
    },
    text: {
        textAlign: 'center'
    },
    button: {
        backgroundColor: '#0b7eff',
        height:  60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText:{
        color: '#ffffff'
    }
})