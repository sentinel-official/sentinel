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
import lang from '../Constants/language';

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
        const { language, ...other } = this.props;
        return (
            <div>
                <Dialog
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    {...other}
                >
                    <DialogTitle id="alert-dialog-title">{lang[language].OpenVpnNotInstalled}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {lang[language].OpenVpnInstallAlert}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            {lang[language].Close}
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
        language: state.setLanguage
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(OpenvpnAlert);