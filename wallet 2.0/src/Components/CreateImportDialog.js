import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from 'material-ui/styles';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@material-ui/core';
import CreateTMAccount from './CreateTMAccount';
import TMRecoverWallet from './TMRecoverWallet';
import TMAccountDetails from './TMAccountDetails';
import lang from '../Constants/language';
import { setCurrentTab } from '../Actions/sidebar.action';


class CreateImportDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seedData: false
        }
    }

    handleCancel = () => {
        if (this.state.seedData) {
            this.props.tmAccountDone(true);
            this.props.setCurrentTab('receive');
        }
        this.setState({ seedData: false });
        this.props.onClose();
    };


    accountDone = (value) => {
        this.setState({ seedData: value });
    }

    render() {
        let { language, ...other } = this.props;
        return (
            <MuiThemeProvider>
                <Dialog
                    // disableBackdropClick
                    disableEscapeKeyDown
                    maxWidth="lg"
                    fullWidth={true}
                    aria-labelledby="confirmation-dialog-title"
                    {...other}
                >
                    <DialogContent style={{ paddingBottom: 0 }}>
                        {
                            this.state.seedData ?
                                <TMAccountDetails isPopup={true} />
                                :
                                (this.props.isCreate ?
                                    <CreateTMAccount isPopup={true} accountCreated={this.accountDone} />
                                    :
                                    <TMRecoverWallet isPopup={true} accountCreated={this.accountDone} />)
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} color="primary">
                            {this.state.seedData ? lang[language].GoToSTWallet : lang[language].Cancel}
                        </Button>
                    </DialogActions>
                </Dialog>
            </MuiThemeProvider>
        )
    }
}

CreateImportDialog.propTypes = {
    onClose: PropTypes.func
};

function mapStateToProps(state) {
    return {
        language: state.setLanguage
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setCurrentTab
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(CreateImportDialog);