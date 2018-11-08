import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class OpenvpnAlert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    handleClose = () => {
        this.props.onClose();
    };

    render() {
        const { ...other } = this.props;
        return (
            <div>
                <Dialog
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    {...other}
                >
                    <DialogTitle id="alert-dialog-title">{"Openvpn not installed"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            OpenVPN Not Installed. Please go to C:\Users"your-user-name"\AppData\Local\Sentinel\app-0.1.01\resources\extras and
                            run openvpn-install-2.3.18-I602-x86_64.exe. Just Install Openvpn without changing installation directory.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            Close
            `           </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

OpenvpnAlert.propTypes = {
    onClose: PropTypes.func
};

function mapStateToProps(state) {
    return {
        lang: state.setLanguage
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(OpenvpnAlert);