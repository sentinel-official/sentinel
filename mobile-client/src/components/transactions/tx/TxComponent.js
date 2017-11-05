import React, { Component } from 'react';
import { StyleProvider, List, ListItem, Button, Header, CardItem, Icon, Switch, Container, Content, Right, Left, Text, Card } from 'native-base';
import { StyleSheet } from 'react-native';
// import { Container, Content, List, ListItem, Text } from 'native-base';

import getTheme from '../../../../native-base-theme/components';
import material from '../../../../native-base-theme/variables/material';

export default class RxComponent extends Component {
	static navigationOptions = {
		title: 'Transfer History',
	};
	constructor(props) {
	  super(props);
	}

	render(){
		// const { navigate  } = this.props.navigation;
		return(
			<Container>
			<Content>
			  <List>
				<ListItem>
				  <Text>Not Simon Mignolet</Text>
				</ListItem>
				<ListItem>
				  <Text>Nathaniel Clyne</Text>
				</ListItem>
				<ListItem>
				  <Text>Dejan Lovren</Text>
				</ListItem>
				<ListItem>
				  <Text>Simon Mignolet</Text>
				</ListItem>
				<ListItem>
				  <Text>Nathaniel Clyne</Text>
				</ListItem>
				<ListItem>
				  <Text>Dejan Lovren</Text>
				</ListItem>
				<ListItem>
				  <Text>Simon Mignolet</Text>
				</ListItem>
				<ListItem>
				  <Text>Nathaniel Clyne</Text>
				</ListItem>
				<ListItem>
				  <Text>Dejan Lovren</Text>
				</ListItem>
				<ListItem>
				  <Text>Simon Mignolet</Text>
				</ListItem>
				<ListItem>
				  <Text>Nathaniel Clyne</Text>
				</ListItem>
				<ListItem>
				  <Text>Dejan Lovren</Text>
				</ListItem>
				<ListItem>
				  <Text>Simon Mignolet</Text>
				</ListItem>
				<ListItem>
				  <Text>Nathaniel Clyne</Text>
				</ListItem>
				<ListItem>
				  <Text>Dejan Lovren</Text>
				</ListItem>
				<ListItem>
				  <Text>Simon Mignolet</Text>
				</ListItem>
				<ListItem>
				  <Text>Nathaniel Clyne</Text>
				</ListItem>
				<ListItem>
				  <Text>Dejan Lovren</Text>
				</ListItem>
				<ListItem>
				  <Text>Simon Mignolet</Text>
				</ListItem>
				<ListItem>
				  <Text>Nathaniel Clyne</Text>
				</ListItem>
				<ListItem>
				  <Text>Dejan Lovren</Text>
				</ListItem>
				<ListItem>
				  <Text>Simon Mignolet</Text>
				</ListItem>
				<ListItem>
				  <Text>Nathaniel Clyne</Text>
				</ListItem>
				<ListItem>
				  <Text>Dejan Lovren</Text>
				</ListItem>
				<ListItem>
				  <Text>Simon Mignolet</Text>
				</ListItem>
				<ListItem>
				  <Text>Nathaniel Clyne</Text>
				</ListItem>
				<ListItem>
				  <Text>Dejan Lovren</Text>
				</ListItem>
				<ListItem>
				  <Text>Simon Mignolet</Text>
				</ListItem>
				<ListItem>
				  <Text>Nathaniel Clyne</Text>
				</ListItem>
				<ListItem>
				  <Text>Dejan Lovren</Text>
				</ListItem>
			  </List>
			</Content>
		  </Container>		
		);
	}
}
const styles = StyleSheet.create({
	txrxContainer:{
		justifyContent: 'space-between'
	},
	white:{
		backgroundColor:'#fff'
	}
});
