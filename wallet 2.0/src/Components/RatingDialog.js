import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, Button, DialogTitle } from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Rating } from 'material-ui-rating';
import { rateVPNSession } from './../Actions/vpnlist.action';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider } from 'material-ui/styles';
import lang from '../Constants/language';
import './ratingStyle.css'

class RatingDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rateValue: 5  // initial rate value
        }
    }

    handleCancel = () => {
        this.props.onClose();
    };

    handleOk = () => {
        rateVPNSession(this.state.rateValue, (err) => {
            if (err) {
                this.props.onClose();
                this.props.snackOpenDialog(err.message);
            } else {
                this.props.onClose();
                this.props.snackOpenDialog(lang[this.props.language].RatedSuccess);
            }
        })
    };

    render() {
        let { language, ...other } = this.props;
        return (
            <MuiThemeProvider>
                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    maxWidth="xs"
                    aria-labelledby="confirmation-dialog-title"
                    {...other}
                >
                    <DialogTitle id="confirmation-dialog-title">{lang[language].RateSession}</DialogTitle>
                    <DialogContent>
                        <Rating
                            value={this.state.rateValue}
                            max={5}
                            onChange={(value) => { this.setState({ rateValue: value }) }}
                        />
                        <TextField
                            id="filled-multiline-flexible"
                            label={lang[language].Comment}
                            multiline
                            rowsMax="4"
                            value={this.state.multiline}
                            //   onChange={this.handleChange('multiline')}
                            className="commentField"
                            margin="normal"
                            //   helperText="hello"
                            variant="filled"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCancel} color="primary">
                            {lang[language].Cancel}
                        </Button>
                        <Button onClick={this.handleOk} color="primary">
                            {lang[language].Submit}
                        </Button>
                    </DialogActions>
                </Dialog>
            </MuiThemeProvider>
        );
    }
}

RatingDialog.propTypes = {
    onClose: PropTypes.func,
    snackOpenDialog: PropTypes.func
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

export default connect(mapStateToProps, mapDispatchToActions)(RatingDialog);