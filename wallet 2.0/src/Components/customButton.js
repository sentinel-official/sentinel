import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const styles = theme => ({
    disabledBtn: {
        backgroundColor: '#F2F2F2',
        height: '41px',
        width: '120px'
    },
    highlightBtn: {
        backgroundColor: '#FFFFFF',
        height: '41px',
        width: '120px'
    },
    btnLabel: {
        fontWeight: 'bold',
        fontFamily: 'Montserrat',
    }
});

class CustomButton extends Component {
    render() {

        const { classes } = this.props;
        return (
            <Button onClick={this.props.onClick} variant={ this.props.active ? 'contained' : 'flat' } component="span" className={ this.props.active ? classes.highlightBtn : classes.disabledBtn }>
                <span className={classes.btnLabel} >{this.props.label}</span>
            </Button>
        );
    }
}

CustomButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomButton);