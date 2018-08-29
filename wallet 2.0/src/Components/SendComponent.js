import React from 'react';
import { Snackbar, Menu, MenuItem, RaisedButton, TextField, FlatButton, Dialog } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { withStyles } from '@material-ui/core/styles';
import TransIcon from 'material-ui/svg-icons/action/swap-horiz';
import RightArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { sendComponentStyles } from '../Assets/sendcomponent.style';
import SimpleMenu from './SharedComponents/SimpleMenu';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CustomTooltips from './SharedComponents/customTooltip';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import lang from '../Constants/language';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { payVPNUsage, transferAmount } from '../Actions/send.action';
import { setVPNDuePayment } from '../Actions/vpnhistory.actions';
import { getGasCost, ethTransaction, tokenTransaction } from '../Utils/Ethereum';
import { getPrivateKeyWithoutCallback } from '../Utils/Keystore';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/lab/Slider'

const muiTheme = createMuiTheme({
  slider: {
    selectionColor: '#595d8f',
    trackSize: 4,
    handleSize: 20
  }
});

const styles = theme => ({
  textField: {
    background: '#F5F5F5',
    height: '45px'
  },
  slider: {
    width: '330px',
    // backgroundColor: '#595D8F',
    marginTop: '16px'
  },
  sliderbackground: {
    backgroundColor: '#595D8F',
  },
  textFieldAmount: {
    background: '#F5F5F5',
    width: '529px',
    height: '45px'
  },
  gasTextField: {
    background: '#F5F5F5',
    marginTop: '12px',
    height: '45px'
  },
  enableButton: {
    "&:hover": {
      backgroundColor: '#2f3245'
    },
    backgroundColor: '#2f3245',
    height: '45px',
  },
  disableButton: {
    backgroundColor: '#BDBDBD',
    height: '45px',
  }
});

class SendComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gwei: 20,
      sendToAddress: '',
      amount: '',
      token: 'ETH',
      password: '',
      gas: 21000,
      isDisabled: true,
      label: 'SEND',
      isVPNPayment: false,
      sessionId:''
    }
  }

  addressChange = (event) => {
    this.setState({ sendToAddress: event.target.value });
    let trueAddress = event.target.value.match(/^0x[a-zA-Z0-9]{40}$/)
    if (trueAddress !== null) {
      this.enableButton();
      if (this.state.amount !== '') {
        this.getGasLimit(this.state.amount, event.target.value, this.state.token)
      }
    }
  }

  enableButton = () => {
    let { token, amount, sendToAddress, password, gwei, gas } = this.state
    if (token && amount && sendToAddress && password && gwei && gas) {
      this.setState({ isDisabled: false })
    } else {
      this.setState({ isDisabled: true })
    }
  }

  setToken = (token) => {
    this.setState({ token });
    setgas();
    let that = this;
    function setgas() {
      setTimeout(() => {
        that.getGasLimit(that.state.amount, that.state.sendToAddress, that.state.token);
        that.enableButton();
      }, 50);
    }
  }

  callEnable = () => {
    setTimeout(() => {
      this.enableButton();
    }, 50);
  }

  setPassword = (event) => {

    this.setState({ password: event.target.value });

    this.callEnable();
  }

  setGasLimit = (event) => {
    this.setState({ gas: event.target.value });
    this.callEnable();
  }

  amountChange = (event) => {
    let amount = event.target.value;
    if (this.state.unit === 'ETH') amount = amount * 1e18;
    else amount = amount * 1e8;
    this.setState({ amount: amount })
    let trueAddress = this.state.sendToAddress.match(/^0x[a-fA-F0-9]{40}$/)
    if (trueAddress !== null) {
      this.getGasLimit(amount, this.state.sendToAddress, this.state.token)
    }

    this.callEnable();

  }

  getGasLimit = (amount, to, unit) => {
    var from = this.props.local_address;
    let that = this;
    getGasCost(from, to, amount, unit, function (gasLimit) {
      that.setState({ gas: gasLimit })
    })
  }
  handleOnclick = () => {
    const { gas, gwei, sendToAddress, amount, password } = this.state;
    let { payVpn, payVPNUsage, initPaymentDetails } = this.props

    console.log('onClik', payVpn)

    this.setState({ label: 'SENDING', isDisabled: true })
    let self = this;

    setTimeout(() => {

      getPrivateKeyWithoutCallback(password, function (err, privateKey) {
        if (err) {
          console.log(err.message);
          self.setState({ label: 'SEND', isDisabled: true })
        } else {
          if (self.state.token === 'ETH') {
            ethTransaction(self.props.local_address, sendToAddress, amount, gwei * 1e9, gas, privateKey, function (err, result) {
              if (err) {
                console.log('Error', err)
                self.setState({ label: 'SEND', isDisabled: true });
              } else {
                transferAmount(self.props.net ? 'rinkeby' : 'main', result).then((response) => {
                  console.log(response)
                  self.setState({ label: 'SEND', isDisabled: true, sendToAddress: '', amount: '', password: '' });
                })
              }
            });
          } else {
            console.log('in else parent')
            tokenTransaction(self.props.local_address, sendToAddress, amount, gwei * 1e9, gas, privateKey, function (err, result) {
              console.log('in callback', err, result)
              if (err) {
                console.log('Error', err)
                self.setState({ label: 'SEND', isDisabled: true })
              } else {
                console.log('in tokentx data', initPaymentDetails)
                let type;
                if (initPaymentDetails.id === -1) {
                  type = 'init'
                } else {
                  type = 'normal'
                }
                if (self.state.isVPNPayment) {
                  let data = {
                    from_addr: self.props.local_address,
                    amount: self.state.amount,
                    session_id: self.state.sessionId,
                    tx_data: result,
                    net: self.props.net ? 'rinkeby' : 'main',
                    payment_type: type
                  }
                  payVPNUsage(data).then((response) => {
                    console.log(response)
                    self.setState({ label: 'SEND', isDisabled: true, sendToAddress: '', amount: '', password: '', isVPNPayment: false });
                  })
                } else {
                  console.log('in else')
                  transferAmount(self.props.net ? 'rinkeby' : 'main', result).then((response) => { console.log(response) })
                  self.setState({ label: 'SEND', isDisabled: true, sendToAddress: '', amount: '', password: '', token: 'ETH' });
                  self.props.setVPNDuePayment(null);
                }
              }
            });
          }
        }
      });

    }, 50);
  }

  onChangeSlider = (event, value) => {
    this.setState({
      gwei: value
    })
  }


  componentWillMount() {
    console.log('will mount', initPaymentDetails)
    let { payVpn, initPaymentDetails } = this.props;
    if (payVpn.isVPNPayment) {
      this.setState({
        sendToAddress: payVpn.data.account_addr,
        amount: payVpn.data.amount,
        token: 'SENT',
        isVPNPayment: true,
        sessionId:payVpn.data.sessionId
      });
      this.getGasLimit(payVpn.data.amount, payVpn.data.account_addr, 'SENT')
    } else if (initPaymentDetails) {
      this.setState({
        sendToAddress: initPaymentDetails.account_addr,
        amount: initPaymentDetails.amount,
        token: 'SENT',
        isVPNPayment: true,
        sessionId:null
      });
      this.getGasLimit(initPaymentDetails.amount, initPaymentDetails.account_addr, 'SENT')
    }
  }

  render() {
    console.log(this.props.initPaymentDetails, 'lao bhai')
    const { language, classes } = this.props;

    return (

      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={sendComponentStyles.mainDiv}>
          <Grid style={{ width: '750px' }}>
            <Row>
              <Col>
                <span style={sendComponentStyles.sendToAddress} >{lang[language].SendTo}</span>
              </Col>
              <Col style={sendComponentStyles.questionMarkDiv}>
                <CustomTooltips title={lang[language].ToTooltip} />
              </Col>
            </Row>
            <Row style={sendComponentStyles.textFieldDiv}>
              <Input
                type={'text'}
                placeholder="Example: 0x6b6df9e25f7bf23343mfkr45"
                autoFocus={false}
                disableUnderline={true}
                className={classes.textField}
                onChange={this.addressChange}
                value={this.state.sendToAddress}
                inputProps={{ style: sendComponentStyles.textInputStyle }}
                fullWidth={true}
              />
            </Row>
            <Row style={sendComponentStyles.amountDiv}>
              <Col>
                <span style={sendComponentStyles.sendToAddress} >{lang[language].AmountTo}</span>
              </Col>
              <Col style={sendComponentStyles.questionMarkDiv}>
                <CustomTooltips title={lang[language].AmountTool1 + '\n' + lang[language].AmountTool2} />
              </Col>
            </Row>
            <Row style={sendComponentStyles.textFieldDiv}>
              <Col style={sendComponentStyles.amountDivCol}>
                <div style={{ display: 'inline-flex' }}>
                  <div>
                    <Input
                      type={'number'}
                      autoFocus={false}
                      disableUnderline={true}
                      fullWidth={true}
                      className={classes.textFieldAmount}
                      onChange={this.amountChange}
                      inputProps={{ style: sendComponentStyles.textInputStyleForNumber }}
                      value={
                        (this.state.amount === null || this.state.amount === 0) ? null :
                          (this.state.unit === 'ETH' ? parseFloat(this.state.amount / (10 ** 18)) :
                            parseFloat(this.state.amount / (10 ** 8)))
                      }
                    />
                  </div>
                  <div style={{ width: '191px' }}>
                    <SimpleMenu token={this.setToken} isSend={true} isVPN={this.state.isVPNPayment} />
                  </div>
                </div>
              </Col>
            </Row>
            <Row style={sendComponentStyles.amountDiv}>
              <div style={sendComponentStyles.row}>
                <div style={sendComponentStyles.gasDivCol}>
                  <div style={sendComponentStyles.gasTextFieldDiv}>
                    <div style={sendComponentStyles.row}>
                      <div>
                        <span style={sendComponentStyles.sendToAddress} >{lang[language].GasLimit}</span>
                      </div>
                      <div style={sendComponentStyles.questionMarkDiv}>
                        <CustomTooltips title={lang[language].GasFieldTool} />
                      </div>
                    </div>
                    <Input
                      type={"number"}
                      autoFocus={false}
                      disableUnderline={true}
                      fullWidth={true}
                      className={classes.gasTextField}
                      onChange={this.setGasLimit}
                      inputProps={{ style: sendComponentStyles.textInputStyleForNumber }}
                      value={this.state.gas}
                    />
                  </div>
                </div>
                <div style={sendComponentStyles.gasDivCol}>
                  <div style={sendComponentStyles.gasTextFieldDiv}>
                    <div style={sendComponentStyles.row}>
                      <div>
                        <span style={sendComponentStyles.sendToAddress} >{lang[language].GasPrice}</span>
                      </div>
                      <div style={sendComponentStyles.questionMarkDiv}>
                        <CustomTooltips title={lang[language].GasPriceTool} />
                      </div>
                      <div style={{ marginLeft: '30px' }}>
                        <span style={sendComponentStyles.gasWei}><span style={sendComponentStyles.gasValue}>{this.state.gwei}</span> GWEI</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Slider
                      defaultValue={this.state.gwei}
                      component='div'
                      className={classes.slider}
                      min={1.1}
                      max={100}
                      value={this.state.gwei}
                      classes={
                        {
                          track: classes.sliderbackground, thumb: classes.sliderbackground
                        }
                      }
                      step={1}
                      onChange={this.onChangeSlider} />
                  </div>
                </div>
              </div>
            </Row>
            <Row style={sendComponentStyles.amountDiv}>
              <div style={sendComponentStyles.gasTextFieldDiv}>
                <div style={sendComponentStyles.row}>
                  <div>
                    <span style={sendComponentStyles.sendToAddress} >{lang[language].Password}</span>
                  </div>
                  <div style={sendComponentStyles.questionMarkDiv}>
                    <CustomTooltips title={lang[language].PasswordTool} />
                  </div>
                </div>
              </div>
              <div style={sendComponentStyles.row}>
                <div style={sendComponentStyles.gasTextFieldDiv}>
                  <Input
                    type='password'
                    placeholder='Enter Keystore Password'
                    autoFocus={false}
                    disableUnderline={true}
                    fullWidth={true}
                    value={this.state.password}
                    onChange={this.setPassword}
                    className={classes.gasTextField}
                    inputProps={{ style: sendComponentStyles.textInputStyleForNumber }}
                  />
                </div>
                <div>
                  <div style={sendComponentStyles.sendDiv}>
                    <Button
                      autoFocus={false}
                      variant='flat'
                      component='span'
                      fullWidth={true}
                      className={!this.state.isDisabled ? classes.enableButton : classes.disableButton}
                      disabled={this.state.isDisabled}
                      style={{ color: '#fff', fontWeight: '600', fontSize: '20px', fontFamily: 'Montserrat,Medium' }}
                      onClick={this.handleOnclick}
                    >{this.state.label}</Button>
                  </div>
                </div>
              </div>
            </Row>
          </Grid>
        </div>
      </MuiThemeProvider >
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.setLanguage,
    local_address: state.getAccount,
    net: state.setTestNet,
    payVpn: state.getVPNDuePaymentDetails,
    initPaymentDetails: state.initPaymentDetails,
  }
}

function mapDispatchToActions(dispatch) {
  return bindActionCreators({
    transferAmount,
    payVPNUsage,
    setVPNDuePayment
  }, dispatch)
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToActions)(SendComponent));