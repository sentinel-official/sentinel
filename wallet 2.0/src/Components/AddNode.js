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
import { getPrivateKey } from '../Actions/authentication.action';
import lang from '../Constants/language';
import '../Assets/createtm.css';
import IconButton from "@material-ui/core/IconButton";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import NodeManagement from './NodeManagement';
import { setDockerContainers } from '../Actions/node.action';
import { getVpnList } from '../Actions/vpnlist.action';
import './nodeStyle.css';

let ContainersInterval = null;
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
            keystorePassword: '',
            sending: false,
            showPassword: false,
            connected: false,
            snackOpen: false,
            snackMessage: '',
            tmAccountAddress: null,
            isTendermint: false,
            loading: false
        }
    }

    componentWillMount = () => {
        this.setState({ isTendermint: this.props.isTM, loading: true });
        if (this.props.isTM) {
            this.getTMIp(this.props);
            this.setState({ tmAccountAddress: this.props.tmAccountDetails.address });
        } else {
            this.getETHIp(this.props);
        }
    }

    getTMIp = (props) => {
        this.props.getVpnList('openvpn', true)
            .then((res) => {
                let hostedNode = res.payload.find(obj => obj.accountAddress === props.tmAccountDetails.address.toLowerCase());
                if (hostedNode) {
                    this.setState({ ip: hostedNode.IP, loading: false });
                } else {
                    this.setState({ ip: null, loading: false });
                }
            })
    }

    getETHIp = (props) => {
        this.props.getVpnList('openvpn', false)
            .then((vpnList) => {
                let hostedNode = vpnList.payload.find(obj => obj.account_addr === props.walletAddress.toLowerCase());
                if (hostedNode) {
                    this.setState({ ip: hostedNode.ip, loading: false });
                } else {
                    this.props.getVpnList('socks5', false)
                        .then((socksList) => {
                            let socksNode = socksList.payload.find(obj => obj.account_addr === props.walletAddress.toLowerCase());
                            if (socksNode) {
                                this.setState({ ip: socksNode.ip, loading: false });
                            } else {
                                this.setState({ ip: null, loading: false });
                            }
                        })
                }
            })
    }

    componentWillReceiveProps = (next) => {
        if (this.props.connectionStatus === true) {
            this.setState({
                connected: false,
                ip: null,
                username: '',
                password: '',
                sending: false,
                showPassword: false,
                connected: false,
                snackOpen: false,
            })
        }
        if (next.isTM !== this.state.isTendermint) {
            this.setState({ isTendermint: next.isTM, loading: true });
            if (next.isTM) {
                this.setState({ tmAccountAddress: next.tmAccountDetails.address })
                this.getTMIp(next);
            } else {
                this.getETHIp(next);
            }
        } else {
            if (next.isTM && next.tmAccountDetails.address !== this.state.tmAccountAddress) {
                this.setState({ tmAccountAddress: next.tmAccountDetails.address, loading: true });
                this.getTMIp(next);
            }
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
        if (!this.props.isTM) {
            getPrivateKey(this.state.keystorePassword, this.props.language, (err, privateKey) => {
                if (err) {
                    this.setState({
                        sending: false,
                        snackOpen: true,
                        snackMessage: err.message
                    })
                } else {
                    this.connectNM();
                }
            })
        } else {
            this.connectNM();
        }
    }

    connectNM = () => {
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

    handleLogout = () => {
        this.props.logoutNode();
        if (ContainersInterval) {
            // console.log("clearing cont")
            clearInterval(ContainersInterval);
            ContainersInterval = null;
        }
    }

    render() {
        let { classes, language, connectionStatus, logout } = this.props;
        if (connectionStatus === true && !ContainersInterval) {
            ContainersInterval = setInterval(() => {
                this.props.setDockerContainers();
            }, 15000);
        }

        if (!connectionStatus && ContainersInterval) {
            // console.log("clearing cont")
            clearInterval(ContainersInterval);
            ContainersInterval = null;
        }

        let isDisabled = (this.state.sending || this.state.username === '' ||
            this.state.password === '') ? true : false
        return (
            <div>
                {!connectionStatus ?
                    (this.state.loading ?
                        <div style={accountStyles.noIp}>{lang[language].Loading}</div>
                        :
                        (this.state.ip ?
                            <div style={accountStyles.nodeFormStyle}>
                                <div style={createAccountStyle.secondDivStyle}
                                    onKeyPress={(ev) => { if (ev.key === 'Enter') this.handleConnect() }}>
                                    <h1 className="nodeHeading">{lang[language].NodeHeading}</h1>
                                    {this.props.isTM ?
                                        null :
                                        <div>
                                            <p style={createAccountStyle.headingStyle}>{lang[language].KeyPass}</p>
                                            <CustomTextField type={'password'} placeholder={''} disabled={false}
                                                multi={false}
                                                value={this.state.keystorePassword} onChange={(e) => {
                                                    this.setState({ keystorePassword: e.target.value });
                                                }}
                                            />
                                        </div>
                                    }
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
                            <div style={accountStyles.noIp}>{lang[language].NoNodeFound}</div>
                        ))
                    :
                    <NodeManagement logoutNode={this.handleLogout} />
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
        tmAccountDetails: state.setTMAccount,
        isTM: state.setTendermint,
        walletAddress: state.getAccount,
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        logoutNode,
        isConnected,
        connectToNodeDocker,
        setDockerContainers,
        getVpnList,
    }, dispatch)
}

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(AddNode);