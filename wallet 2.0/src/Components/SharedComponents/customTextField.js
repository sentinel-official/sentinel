import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import { sendComponentStyles } from '../../Assets/sendcomponent.style';


const styles = theme => ({
textField:{
	background: '#F5F5F5',
	height:'45px'
}
});

class TextFields extends React.Component {

	render() {
		const { classes } = this.props;

		return (
			<Input
			  type={this.props.type}
				placeholder="Example: 0x6b6df9e25f7bf23343mfkr45" // added "Example" in lang.js
				autoFocus={false}
				disableUnderline={true}
				className={classes.textField}
				onChange={this.props.function}
				value = {this.props.value}
				inputProps={{style:sendComponentStyles.textInputStyle}}
				fullWidth={true}
			/>
		);
	}
}

TextFields.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextFields);