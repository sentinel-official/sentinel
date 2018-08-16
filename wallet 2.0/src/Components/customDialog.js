import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import AddIcon from '@material-ui/icons/SwapVerticalCircle';
import blue from '@material-ui/core/colors/blue';
import { connectVPN } from '../Actions/connectOVPN'
import { setCurrentTab } from '../Actions/sidebar.action';
import { initPaymentAction } from '../Actions/initPayment';
import {getAccount} from "../Reducers/dashboard.reducer";

const electron = window.require('electron');
const remote = electron.remote;

const emails = ['username@gmail.com', 'user02@gmail.com'];
const styles = {
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    dialogLabel: {
        fontSize: 14,
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        textAlign: 'right'
    },
    dialogValue: {
        fontSize: 13,
        fontFamily: 'Montserrat',
    }
};

// function Transition (props) {
//     return <Slide direction="up" {...props} />;
// }

class SimpleDialog extends React.Component {

    state = {
        pendingInitPayment: null,
    };

    handleClose = () => {
        this.props.onClose(this.props.selectedValue);
    };

    render() {
        const { classes, onClose, selectedValue, ...other } = this.props;

        return (
                    <Dialog onClose={this.handleClose}
                            aria-labelledby="simple-dialog-title"
                            {...other}
                            // TransitionComponent={Transition}
                    >
                        <DialogTitle id="simple-dialog-title">Connect to dVPN</DialogTitle>
                        <div>

                            {/*// this.props.data && this.props.data.price >= 0 ?*/}
                            <List>
                                <ListItem button onClick={() => {
                                }}>
                                    <ListItemText>
                                        <label style={styles.dialogLabel}>City:&nbsp;</label>
                                        <span style={styles.dialogValue}>{this.props.data.city}</span>
                                    </ListItemText>
                                </ListItem>

                                <ListItem button onClick={() => {
                                }}>
                                    <ListItemText>
                                        <label style={styles.dialogLabel}>Country:&nbsp;</label>
                                        <span style={styles.dialogValue}>{this.props.data.country}</span>
                                    </ListItemText>
                                </ListItem>

                                <ListItem button onClick={() => {
                                }}>
                                    {/*<ListItemText primary={`Bandwidth: ${this.props.data.speed}`} />*/}
                                    <label style={styles.dialogLabel}>Bandwidth:&nbsp;</label>
                                    <span style={{
                                        fontSize: 13,
                                        fontFamily: 'Montserrat',
                                        marginTop: -8
                                    }}>{(this.props.data.speed / (1024 * 1024)).toFixed(2)}</span>
                                </ListItem>

                                <ListItem button onClick={() => {
                                }}>
                                    <ListItemText>
                                        <label style={styles.dialogLabel}>Price:&nbsp;</label><span
                                        style={styles.dialogValue}>{this.props.data.price_per_GB}</span>
                                    </ListItemText>
                                </ListItem>
                                <ListItem button onClick={() => {
                                }}>
                                    <ListItemText> <label style={styles.dialogLabel}>Latency:&nbsp;</label>
                                        <span style={styles.dialogValue}> {this.props.data.latency}</span>
                                    </ListItemText>
                                </ListItem>

                                <ListItem button onClick={() => this.props.onClick(this.props.data.vpn_addr)}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <AddIcon/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="connect"/>
                                </ListItem>
                            </List>
                            {/*: ''*/}
                            {/*}*/}
                        </div>
                    </Dialog>
        );
    }
}

SimpleDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};

const SimpleDialogWrapped = withStyles(styles)(SimpleDialog);


class AlertDialog extends React.Component {

    componentWillReceiveProps(nextProps) {
        this.setState({ open: nextProps.open });
    }

    state = {
        open: false,
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    makeInitPayment = async () => {

        let data = {
          account_addr: this.props.paymentAddr,
          amount: 10000000000,
          id: -1
        };

        await this.props.initPaymentAction(data);
        this.props.setCurrentTab('send')
    };

    render() {
        return (
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Initial Payment Alert"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            { `${this.props.message} Please click on pay button to make the initial payment` }
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.makeInitPayment} color="primary" autoFocus>
                            Pay
                        </Button>
                    </DialogActions>
                </Dialog>
        );
    }
}

// export default AlertDialog;


class SimpleDialogDemo extends React.Component {

    componentWillReceiveProps(nextProps) {
        this.setState({ open: this.props.open })
    }

    state = {
        open: false,
        selectedValue: emails[1],
        pendingInitPayment: null,
        isPending: false,
        paymentAddr: '',
    };

    handleClickOpen = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = value => {
        this.setState({ selectedValue: value, open: false });
    };

    handleListItemClick = (vpn_addr) => {

        connectVPN(this.props.getAccount, vpn_addr , remote.process.platform, (res) => {

            console.log(res, 'check this out')
            if ( res.data && res.data.account_addr) {
                this.setState({ pendingInitPayment: res.data.message, isPending: true, open: false,
                    paymentAddr: res.data.account_addr })
            } else if (res.success) {
                console.log('res came, connect now', res.data)
                this.setState({ open: false })
            }

        })
    };

    render() {
        console.log(this.props, 'props props props');
        // console.log('down props', this.props.data );
        return (
            <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }} >
                {this.state.isPending ?
                    <AlertDialog
                        open={this.state.isPending}
                        message={this.state.pendingInitPayment}
                        paymentAddr={this.state.paymentAddr}
                        initPaymentAction={this.props.initPaymentAction}
                        setCurrentTab={this.props.setCurrentTab}
                    />
                    :
                    <SimpleDialogWrapped
                        selectedValue={this.state.selectedValue}
                        open={this.state.isPending === false && this.state.open}
                        onClose={this.handleClose}
                        data={this.props.data}
                        onClick={this.handleListItemClick}
                    />
                }
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {

    return bindActionCreators({ setCurrentTab, initPaymentAction }, dispatch)
}

function mapStateToProps({ connecVPNReducer, getAccount }) {
    return { connecVPNReducer, getAccount }
}

export default connect(mapStateToProps, mapDispatchToProps)(SimpleDialogDemo);
