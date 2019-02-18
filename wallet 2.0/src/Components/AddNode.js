import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connectToNodeDocker } from '../Actions/node.action';
import CustomTextField from './customTextfield';
import { Button, Snackbar } from '@material-ui/core';
import { createAccountStyle } from '../Assets/createtm.styles';
import { accountStyles } from '../Assets/tmaccount.styles';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { logoutNode, isConnected, connectToNM } from '../Actions/node.action';
import lang from '../Constants/language';
import '../Assets/createtm.css';
import IconButton from "@material-ui/core/IconButton";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import NodeManagement from './NodeManagement';
import './nodeStyle.css';


const Customstyles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    enableButton: {
        "&:hover": {
            backgroundColor: '#2f3245'
        },
        backgroundColor: '#2f3245',
        // height: '45px',
    },
    disableButton: {
        backgroundColor: '#BDBDBD',
        // height: '45px',
        cursor: 'not-allowed',
    }
});

class AddNode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ip: '',
            username: '',
            password: '',
            sending: false,
            showPassword: false,
            connected: false,
            snackOpen: false,
            snackMessage: '',

        }
    }

    componentWillMount = () => {
    }
    componentWillReceiveProps = () => {
        if (this.props.connectionStatus === true) {
            this.setState({
                connected: false,
                ip: '',
                username: '',
                password: '',
                sending: false,
                showPassword: false,
                connected: false,
                snackOpen: false,
            })
        }

    }
    componentDidMount = () => {

        console.log("did");
    }
    handleSnackClose = (event, reason) => {
        this.setState({ snackOpen: false });
    };
    handleShow = () => {
        this.setState({ showPassword: !this.state.showPassword })
    }
    handleConnect = () => {
        this.setState({ sending: true })
        connectToNM(this.state.ip, this.state.username, this.state.password, (cb) => {
            if (cb) {
                this.setState({
                    snackMessage: lang[this.props.language].NodeConnectErr,
                    snackOpen: true,
                    sending: false
                })
            }
            else {
                this.props.isConnected(true);
            }

        })


    }
    render() {
        let { classes, language, connectionStatus, logout } = this.props;

        let isDisabled = (this.state.sending || this.state.username === '' ||
            this.state.password === '') ? true : false
        return (
            <div>
                {connectionStatus === false ?
                    <div style={accountStyles.nodeFormStyle}>
                        <div style={createAccountStyle.secondDivStyle}
                            onKeyPress={(ev) => { if (ev.key === 'Enter') this.handleConnect() }}>

                            <h1 className="nodeHeading">{lang[language].NodeHeading}</h1>
                            <p style={createAccountStyle.headingStyle}>{lang[language].NodeUserIP}</p>
                            <CustomTextField type={'text'} placeholder={''} disabled={false}
                                multi={false}
                                value={this.state.ip} onChange={(e) => { this.setState({ ip: e.target.value }) }}
                            />
                            <p style={createAccountStyle.headingStyle}>{lang[language].NodeUserID}</p>
                            <CustomTextField type={'text'} placeholder={''} disabled={false}
                                multi={false}
                                value={this.state.username} onChange={(e) => { this.setState({ username: e.target.value }) }}
                            />
                            <p style={createAccountStyle.headingStyle}>{lang[language].NodeUserPassword}</p>
                            <CustomTextField
                                type={this.state.showPassword ? 'text' : 'password'}
                                placeholder={''} disabled={false}
                                multi={false}
                                value={this.state.password} onChange={(e) => { this.setState({ password: e.target.value }) }}
                            />
                            <IconButton
                                aria-label="Toggle password visibility"
                                className="showPassword"
                                onClick={() => this.handleShow()}
                            >
                                {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                            <Button
                                variant="outlined"
                                disabled={isDisabled}
                                onClick={() => { this.handleConnect() }}
                                className={!isDisabled ? classes.enableButton : classes.disableButton}
                                style={createAccountStyle.buttonStyle}>
                                {this.state.sending ? lang[language].Logging : lang[language].Login}
                            </Button>
                        </div>
                    </div>
                    :
                    <NodeManagement />
                }

                <Snackbar
                    open={this.state.snackOpen}
                    autoHideDuration={4000}
                    onClose={this.handleSnackClose}
                    message={this.state.snackMessage}
                />
            </div>
        )
    }
}

AddNode.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
    return {
        language: state.setLanguage,
        logout: state.isLoggedOutNode,
        connectionStatus: state.connectionStatus,
        isNMConnected: state.isNMConnected,

    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        logoutNode,
        isConnected,
        connectToNodeDocker,


    }, dispatch)
}

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(AddNode);