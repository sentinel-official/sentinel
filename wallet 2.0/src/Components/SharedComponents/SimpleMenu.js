import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  icon: {
    fill: 'white',
    right: '60px'
  },
  list: {
    backgroundColor: '#B6B9CB',
    height: '45px',
    fontFamily: 'Montserrat,Medium',
    fontWeight: 600,
    alignItems: 'center'
  }
});


class SimpleListMenu extends React.Component {

  state = {
    token: 'ETH'
  }

  handleMenuItemClick = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    this.props.token(event.target.value);
  };


  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Select
          value={this.state.token}
          onChange={this.handleMenuItemClick}
          displayEmpty
          name='token'
          // native={true}
          disableUnderline={true}
          className={classes.list}
          fullWidth={true}
          inputProps={{
              classes: {
                icon: classes.icon,
              }
          }}
          SelectDisplayProps={{
            style:{paddingLeft:'60px'}
          }
          }
        >
          <MenuItem value={'ETH'} >ETH</MenuItem>
          <MenuItem value={'SENT'}>SENT</MenuItem>
        </Select>
      </div>
    );
  }
}

SimpleListMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleListMenu);