import React, { Component } from 'react';
// import { DrawerLayoutAndroid } from 'react-navigation';
import { View, Text, DrawerLayoutAndroid } from 'react-native';
// import SideBar from './SideBar';

export default class SideBarComponent extends Component {

  constructor(props) {
    super(props);
  
    // this.state = {};
  }
  render() {
      var navigationView = (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
        </View>
        );
    return (
        <DrawerLayoutAndroid
          drawerWidth={250}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          renderNavigationView={() => navigationView}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text onPress={console.log(this.navigating)} style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Hello</Text>
              <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>World!</Text>
            </View>
        </DrawerLayoutAndroid>
  );
}

}