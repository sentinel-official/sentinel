import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import { DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { withStyles, Button, Avatar, List, ListItem, ListItemAvatar, ListItemText,
    DialogTitle, Dialog, CircularProgress } from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import CheckIcon from '@material-ui/icons/Check';
import ConnectIcon from '@material-ui/icons/SwapVerticalCircle';
import blue from '@material-ui/core/colors/blue';
import { connectVPN } from '../Actions/connectOVPN'
import { connectSocks } from '../Actions/connectSOCKS';
import { setCurrentTab } from '../Actions/sidebar.action';
import { initPaymentAction } from '../Actions/initPayment';
import { getVPNUsageData } from "../Utils/utils";

const electron = window.require('electron');
const remote = electron.remote;

const emails = ['username@gmail.com', 'user02@gmail.com'];
const styles = theme => ({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    container: {
        width: 280,
        overflow: 'none'
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
    },
    fabProgress: {
        margin: theme.spacing.unit * 2,
        height: '1em',
        width: '1em'
    },
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    listRoot: {
        display: 'flex',
        backgroundColor: theme.palette.background.paper,
        justifyContent: 'center',
    },
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative',
    },
    button: {
        margin: theme.spacing.unit,
        outline: 'none',
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },

});

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
        const { classes, ...other } = this.props;

        return (
                    <Dialog onClose={this.handleClose}
                            aria-labelledby="simple-dialog-title" keepMounted
                            {...other} className={{ classes: { paper: classes.container } }}
                    >
                        <DialogTitle className={classes.container} id="simple-dialog-title">Connect to dVPN</DialogTitle>
                        <div>

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
                                    <span style={styles.dialogValue}>{(this.props.data.speed / (1024 * 1024)).toFixed(2)}</span>
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

                                <div className={classes.listRoot}>
                                    <Button disabled={this.props.isLoading} variant="extendedFab" aria-label="Connect"
                                            onClick={() => this.props.onClick(this.props.data.vpn_addr)}
                                            className={classes.button}>
                                        { !this.props.isLoading && this.props.success ?  <CheckIcon
                                            className={classes.extendedIcon} /> : <ConnectIcon className={classes.extendedIcon} /> }
                                        { !this.props.isLoading && this.props.success ? 'Connected' : 'Connect' }
                                    </Button>
                                </div>
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
        this.setState({ open: false, success: false, isLoading: false });
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
        isLoading: false,
        success: false,
        timer: true,
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

        this.setState({ isLoading: true });
        if (this.props.vpnType === 'openvpn') {
            connectVPN(this.props.getAccount, vpn_addr, remote.process.platform, (res) => {

                if (res.data && res.data.account_addr) {
                    this.setState({
                        pendingInitPayment: res.data.message, isPending: false, open: true,
                        paymentAddr: res.data.account_addr, isLoading: false
                    })
                } else if (res.success) {
                    this.setState({isLoading: false, success: true});
                    // setTimeout(() => {  this.setState({ open: false })}, 4000)
                } else {
                    this.setState({open: false, isLoading: false})
                }

            })
        } else {
            this.props.connectSocks(this.props.getAccount, vpn_addr);
        }
    };

    render() {
        console.log(this.props, 'socks props here')
        if (this.state.success && this.state.timer) {
            setInterval(() => { this.props.getVPNUsageData(this.props.getAccount)
                .then(res => {console.log('usage', res)})
                .catch(err => { console.log('err', err) });
            }, 3000);
            this.setState({ timer: false })
        }
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
                        isLoading={this.state.isLoading}
                        success={this.state.success}
                    />
                }
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {

    return bindActionCreators({ setCurrentTab, initPaymentAction, getVPNUsageData, connectSocks }, dispatch)
}

function mapStateToProps({ connecVPNReducer, getAccount, socksReducer }) {
    return { connecVPNReducer, getAccount, socksReducer }
}

export default connect(mapStateToProps, mapDispatchToProps)(SimpleDialogDemo);
