import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import lang from '../../Constants/language'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';




const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  root1: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    marginTop: '-3px',
  },
  icon: {
    fill: 'black',  //changed from white -> black
    right: '30px',  // changed from 60
    marginTop:-6
    
  },
  list: {
    backgroundColor: '#B6B9CB',
    fontFamily: 'Montserrat,Medium',
    fontWeight: 600,
    fontSize: '18px',
    alignItems: 'center'
  },
  pivxList: {
    backgroundColor: '#fff',
    fontFamily: 'Montserrat,Medium',
    fontWeight: 600,
    fontSize: '16px',
    color: '#253245',
    alignItems: 'center',
    marginLeft: '173px'
  },
  pivxIcon: {
    fill: '#B6B9CB',
  },
});


class SimpleListMenu extends React.Component {

  state = {
    token: '/SENT' , //Changed from 'ETH' to give priority for SENT
    pivxMenu: {
      pivx: 'PIVX',
      eth: 'ETH',
      sent: 'SENT'
    },
    swap: 'PIVX to ETH'
  }

  handleMenuItemClick = (event) => {
    this.setState({ [event.target.name]: event.target.value });

    this.props.token(event.target.value);

  };

  componentWillMount() {
    if (this.props.isSend) {
      this.props.token('ETH');
      this.setState({ token: 'ETH' });
      if (this.props.isVPN) {
        console.log("Props...", this.props)
        this.props.token('SENT');
        this.setState({ token: 'SENT' })
      }
    }
  }

  handlePIVXMenuItemClick = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    console.log('pivx menu', event.target.value)
    let tokens = event.target.value.split('to')
    this.props.setSwap(tokens[0].trim(), tokens[1].trim());
    this.props.rate()
  }

  render() {
    const { language, classes } = this.props;


    if (this.props.isSend) {
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
              style: {
                // padding: '12px', paddingLeft: '50px'
                padding:'12px 12px 8px 30px'
              }
            }}
          >
          
            <MenuItem value={'SENT'}>
              {/* {lang[language].Sent} */}
              /SENT
              </MenuItem>
              <MenuItem value={'ETH'} >
              {/* <img src={'../src/Images/ethereum.svg'} alt="etherem_logo"
                style={{ width: 15, paddingRight: 5, marginTop: -5 }} /> */}

              {/* {lang[language].Eth} */}
              /GB
              </MenuItem>
          </Select>
        </div>
      );
    } else {
      let { pivxMenu } = this.state;
      return (<div className={classes.root1}>
        <Select
          value={this.state.swap}
          onChange={this.handlePIVXMenuItemClick}
          displayEmpty
          name='swap'
          // native={true}
          disableUnderline={true}
          className={classes.pivxList}
          inputProps={{
            classes: {
              icon: classes.pivxIcon,
            }
          }}
          SelectDisplayProps={{
            style: {
              fontFamily: 'Montserrat,Medium',
              backgroundColor: '#fff'
            }
          }}
        >
          <MenuItem value={`${pivxMenu.pivx} to ${pivxMenu.eth}`} >{`${pivxMenu.pivx} to ${pivxMenu.eth}`}</MenuItem>
          <MenuItem value={`${pivxMenu.pivx} to ${pivxMenu.sent}`} >{`${pivxMenu.pivx} to ${pivxMenu.sent}`}</MenuItem>
          <MenuItem value={`${pivxMenu.sent} to ${pivxMenu.pivx}`} >{`${pivxMenu.sent} to ${pivxMenu.pivx}`}</MenuItem>
          <MenuItem value={`${pivxMenu.eth} to ${pivxMenu.pivx}`} >{`${pivxMenu.eth} to ${pivxMenu.pivx}`}</MenuItem>

        </Select>
      </div>);
    }

  }
}

SimpleListMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    language: state.setLanguage,

  }
}
function mapDispatchToActions(dispatch) {
  return bindActionCreators({

  }, dispatch)
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToActions)(SimpleListMenu));