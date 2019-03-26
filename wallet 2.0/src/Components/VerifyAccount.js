import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { Button, Snackbar } from '@material-ui/core';
import { createAccountStyle } from '../Assets/createtm.styles';
import { accountStyles } from '../Assets/tmaccount.styles';
import CustomTextField from './customTextfield';
import lang from '../Constants/language';
import IconButton from "@material-ui/core/IconButton";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import AddNode from './AddNode';
import { setAccountVerified, verifyMyAccount } from '../Actions/node.action';



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

class VerifyAccount extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            AccountAddress: '',
            AccountName: '',
            AccountPassword: '',
            verfied: false,
            sending : false,
            snackMessage: '',
        }
    }

    componentDidMount = () => {
        const { isTendermint , tmAccountDetails, walletAddress} = this.props;
        if (isTendermint && tmAccountDetails.address) {
            this.setState({ AccountAddress: tmAccountDetails.address,
            AccountName : tmAccountDetails.name })
        }
        else{

            this.setState({ AccountAddress: walletAddress })
        }
    }
    componentWillReceiveProps = (next) => {
        const { isTendermint , tmAccountDetails, walletAddress} = next;
        if (isTendermint && tmAccountDetails.address) {
            this.setState({ AccountAddress: tmAccountDetails.address,
            AccountName : tmAccountDetails.name })
        }
        else{

            this.setState({ AccountAddress: walletAddress })
        }
    }
    handleShow = () => {
        this.setState({ showPassword: !this.state.showPassword })
    }
    handleSnackClose = (event, reason) => {
        this.setState({ snackOpen: false });
    };
    verifyAccount = () => {
        this.setState({ sending : true})
        verifyMyAccount(this.state.AccountAddress,this.state.AccountName,this.state.AccountPassword, res =>{
            // console.log("response from 405", res)
            if(res.data){
                if (res.data.success) {
                    this.setState({ verfied: true, sending : false })
                    this.props.setAccountVerified(true)
                }
             
                else{
                    this.setState({  
                        sending : false,
                        snackOpen: true,
                        snackMessage: lang[this.props.language].IncorrectPwd })
                }
                
            }
            else{
                this.setState({  
                    sending : false,
                    snackOpen: true,
                    snackMessage: lang[this.props.language].Somethingwentwrong})
            }
           
        })
       
       
    }
    render() {
        let { language, classes,isAccountVerified} = this.props;
        let isDisabled = (this.state.sending || this.state.AccountAddress === '' || this.state.AccountName === '' ||
            this.state.AccountPassword === '') ? true : false
        return (

            <div>

                {isAccountVerified ? <AddNode /> :
                    <div style={accountStyles.nodeFormStyle}>
                        <div style={createAccountStyle.secondDivStyle}
                            onKeyPress={(ev) => { if (ev.key === 'Enter' && !isDisabled) this.verifyAccount() }}>
                            <h1 className="nodeHeading">{lang[language].VerifyHeading}</h1>
                            {/* <p style={createAccountStyle.headingStyle}>{lang[language].NodeUserID}</p> */}
                            <p style={createAccountStyle.headingStyle}>{lang[language].AccountAddress}</p>
                            <CustomTextField type={'text'} placeholder={''} disabled={false}
                                multi={false}
                                value={this.state.AccountAddress} onChange={(e) => { this.setState({ AccountAddress: e.target.value }) }}
                            />
                            <p style={createAccountStyle.headingStyle}>{lang[language].AccountName}</p>
                            <CustomTextField
                                type={'text'}
                                placeholder={''} disabled={false}
                                multi={false}
                                value={this.state.AccountName} onChange={(e) => { this.setState({ AccountName: e.target.value }) }}
                            />
                            <p style={createAccountStyle.headingStyle}>{lang[language].AccountPwd}</p>
                            <CustomTextField
                                type={this.state.showPassword ? 'text' : 'password'}
                                placeholder={''} disabled={false}
                                multi={false}
                                value={this.state.AccountPassword} onChange={(e) => { this.setState({ AccountPassword: e.target.value }) }}
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
                                onClick={() => { this.verifyAccount() }}
                                className={!isDisabled ? classes.enableButton : classes.disableButton}
                                style={createAccountStyle.buttonStyle}>
                                {this.state.sending ? lang[language].Verifying: lang[language].Verify}
                                
                                    </Button>
                        </div>
                    </div>
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

function mapStateToProps(state) {
    return {
        language: state.setLanguage,
        isTendermint: state.setTendermint,
        tmAccountDetails: state.setTMAccount,
        walletAddress: state.getAccount,
        isAccountVerified : state.isAccountVerified

    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setAccountVerified,
    }, dispatch)
}

export default compose(withStyles(Customstyles), connect(mapStateToProps, mapDispatchToActions))(VerifyAccount);