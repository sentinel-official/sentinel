import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/SwapVerticalCircle';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import { connectVPN } from '../Actions/connectOVPN'
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

function Transition (props) {
    return <Slide direction="up" {...props} />;
};

class SimpleDialog extends React.Component {

    state = {
        pendingInitPayment: null,
    };

    handleClose = () => {
        this.props.onClose(this.props.selectedValue);
    };
    render() {
        // console.log(this.props, "dialog props");
        const { classes, onClose, selectedValue, ...other } = this.props;

        return (
                    <Dialog style={{width: 300}} onClose={this.handleClose}
                            aria-labelledby="simple-dialog-title" {...other}
                            TransitionComponent={Transition}
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

                                <ListItem button onClick={() => this.props.onClick}>
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

    render() {
        return (
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            { this.props.message }
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
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
    };

    handleClickOpen = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = value => {
        this.setState({ selectedValue: value, open: false });
    };

    handleListItemClick = () => {
        // this.props.onClose(value);
        // this.setState({ open: false })
        connectVPN('0x108953974437ad11d6a850791e74908716c3a40b', '0x108953974437ad11d6a850791e74908716c3a40b' , 'linux', (res) => {
            console.log(res, "nakli res")

            this.setState({ pendingInitPayment: res.data.message, isPending: true, open: false })

            if (res.data.account_addr) {
                this.setState({ pendingInitPayment: res.data.message, isPending: true, open: false })
            }
        })
    };

    render() {
        console.log(this.state, 'state');
        console.log(this.props, 'props props props');
        // console.log('down props', this.props.data );
        return (
            <div>
                {this.state.isPending ?
                    <AlertDialog
                        open={this.state.isPending}
                        message={this.state.pendingInitPayment}
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

function mapStateToProps({ connecVPNReducer }) {
    return { connecVPNReducer }
}

export default connect(mapStateToProps)(SimpleDialogDemo);
