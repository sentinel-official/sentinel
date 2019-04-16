import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, Button, DialogTitle } from '@material-ui/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Rating } from 'material-ui-rating';
import { rateVPNSession } from './../Actions/vpnlist.action';
import { setCurrentTab } from '../Actions/sidebar.action';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider } from 'material-ui/styles';
import lang from '../Constants/language';
import './ratingStyle.css';

let ratingStatements = ['Worst', 'Awful', 'Poor', 'Okay', 'Good', 'Excellent']

class RatingDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rateValue: 5,
            comments: 'Excellent'
        }
    }

    handleCancel = () => {
        this.props.onClose();
        this.props.setCurrentTab('vpnHistory');
    };

    handleOk = () => {
        rateVPNSession(this.state.rateValue, this.props.isTm, this.state.comments, (err) => {
            if (err) {
                this.props.onClose();
                let regError = (err.message).replace(/\s/g, "");
                this.props.snackOpenDialog(lang[this.props.language][regError] ?
                    lang[this.props.language][regError] : err.message);
                this.props.setCurrentTab('vpnHistory');
            } else {
                this.props.onClose();
                this.props.snackOpenDialog(lang[this.props.language].RatedSuccess);
                this.props.setCurrentTab('vpnHistory');
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
                            onChange={(value) => {
                                this.setState({ rateValue: value, comments: ratingStatements[value] });
                            }}
                        />
                        <TextField
                            id="filled-multiline-flexible"
                            label={lang[language].Comment}
                            multiline
                            rowsMax="4"
                            value={this.state.comments}
                            className="commentField"
                            margin="normal"
                            variant="filled"
                            onChange={(e) => { this.setState({ comments: e.target.value }) }}
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
        language: state.setLanguage,
        isTm: state.setTendermint,
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setCurrentTab
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToActions)(RatingDialog);