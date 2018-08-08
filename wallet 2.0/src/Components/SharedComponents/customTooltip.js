import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const styles = {
    root: {
        width: 50,
    },
    questionMark: {
        marginLeft: 10,
        fontSize: 13,
        borderRadius: '50%',
        backgroundColor: '#2f3245',
        paddingLeft: 6,
        paddingRight: 6,
        color: 'white'
      }
};

class CustomTooltips extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <Tooltip title={this.props.title} placement="?">
                    <span className={classes.questionMark}>?</span>
                </Tooltip>
            </div>
        );
    }
}

CustomTooltips.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomTooltips);