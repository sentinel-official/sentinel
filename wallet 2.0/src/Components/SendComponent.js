import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { withStyles } from '@material-ui/core/styles';
import { sendComponentStyles } from '../Assets/sendcomponent.style';
import SimpleMenu from './SharedComponents/SimpleMenu';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CustomTooltips from './SharedComponents/customTooltip';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import lang from '../Constants/language';
import { payVPNUsage, transferAmount } from '../Actions/send.action';
import { setVPNDuePayment } from '../Actions/vpnhistory.actions';
import { getGasCost, ethTransaction, tokenTransaction } from '../Utils/Ethereum';
import { getPrivateKeyWithoutCallback } from '../Utils/Keystore';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/lab/Slider';
import PositionedSnackbar from './SharedComponents/simpleSnackbar';
import { TX_SUCCESS } from '../Constants/sendcomponent.types';
const shell = window.require('electron').shell;

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
      token: 'SENT',
      password: '',
      gas: 21000,
      isDisabled: true,
      label: 'Send',
      isVPNPayment: false,
      sessionId: '',
      open: false,
      snackMessage: '',
      checkTxTestStatus: 'https://rinkeby.etherscan.io/tx/',
      checkTxMainStatus: 'https://etherscan.io/tx/',
      url: false,
      txHash: ''
    }
  }

  addressChange = (event) => {
    this.setState({ sendToAddress: event.target.value });
    let trueAddress = event.target.value.match(/^0x[a-zA-Z0-9]{40}$/);
    if (trueAddress !== null) {
      this.enableButton();
      if (this.state.amount !== '') {
        this.getGasLimit(this.state.amount, event.target.value, this.state.token)
      }
    }
  };

  enableButton = () => {
    let { token, amount, sendToAddress, password, gwei, gas } = this.state;
    if (token && amount && sendToAddress && password && gwei && gas) {
      this.setState({ isDisabled: false })
    } else {
      this.setState({ isDisabled: true })
    }
  };

  setToken = (token) => {

    let value;
    if (token === 'SENT') {
      value = this.state.amount * 10 ** 8;
    } else {
      value = this.state.amount * 10 ** 18
    }
    this.setState({ token });
    setgas();
    let that = this;
    function setgas() {
      setTimeout(() => {
        that.getGasLimit(value, that.state.sendToAddress, that.state.token);
        that.enableButton();
      }, 50);
    }
  };

  callEnable = () => {
    setTimeout(() => {
      this.enableButton();
    }, 50);
  };

  setPassword = (event) => {

    this.setState({ password: event.target.value });

    this.callEnable();
  };

  setGasLimit = (event) => {
    if (event.target.value.match("^[0-9]([0-9]+)?([0-9]*\.[0-9]+)?$") || event.target.value === '') {
      this.setState({ gas: event.target.value });
      this.callEnable();
    } else {
      this.setState({ gas: 21000 });
    }
  };

  openInExternalBrowser(url) {
    console.log('in open external browser', url);
    shell.openExternal(url);
    this.setState({ txHash: '' });
  };

  amountChange = (event) => {
    let amount = event.target.value;
    if (amount.match("^[0-9]([0-9]+)?([0-9]*\.[0-9]+)?$")) {
      let value;
      if (this.state.token === 'SENT') {
        value = amount * 10 ** 8;
      } else {
        value = amount * 10 ** 18
      }
      this.setState({ amount: amount });
      let trueAddress = this.state.sendToAddress.match(/^0x[a-fA-F0-9]{40}$/);
      if (trueAddress !== null) {
        this.getGasLimit(value, this.state.sendToAddress, this.state.token)
      }

      this.callEnable();
    } else {
      this.setState({ amount: '', isDisabled: true });
    }

  };

  handleSnackClose = () => {
    this.setState({ open: false, txHash: '', url: false });
  };

  getGasLimit = (amount, to, unit) => {
    var from = this.props.local_address;
    let that = this;
    getGasCost(from, to, amount, unit, function (gasLimit) {
      that.setState({ gas: gasLimit })
    })
  };

  handleOnclick = () => {
    const { gas, gwei, sendToAddress, amount, password } = this.state;
    let { payVpn, payVPNUsage, initPaymentDetails } = this.props;

    this.setState({ label: 'Sending', isDisabled: true });
    let self = this;

    setTimeout(() => {

      getPrivateKeyWithoutCallback(password, (err, privateKey) => {
        if (err) {
          console.log('password mismatch ', err.message.toString());
          self.setState({ label: 'Send', isDisabled: true, open: true, snackMessage: err.message.toString() })
        } else {
          if (self.state.token === 'ETH') {
            ethTransaction(self.props.local_address, sendToAddress, amount * 10 ** 18, gwei * 10 ** 9, gas, privateKey, (err, result) => {
              if (err) {
                console.log('Error', err);
                self.setState({ label: 'Send', isDisabled: true, open: true, snackMessage: err.message });
              } else {
                transferAmount(self.props.net ? 'rinkeby' : 'main', result).then((response) => {
                  console.log('eth tx complete', response);
                  if (response.type === TX_SUCCESS) {
                    self.setState({ label: 'Send', isDisabled: true, sendToAddress: '', amount: '', password: '', open: true, snackMessage: lang[this.props.language]['TransactionSuccess'], url: true, txHash: response.payload });
                  } else {
                    if (response.payload) {
                      let regError = (response.payload).replace(/\s/g, "");
                      self.setState({
                        label: 'Send', isDisabled: true, sendToAddress: '', amount: '', password: '', open: true,
                        snackMessage: lang[this.props.language][regError] ? lang[this.props.language][regError] : response.payload
                      });
                    } else {
                      self.setState({
                        label: 'Send', isDisabled: true, sendToAddress: '', amount: '', password: '', open: true,
                        snackMessage: lang[this.props.language]['TransactionFailed']
                      });
                    }
                  }
                })
              }
            });
          } else {
            tokenTransaction(self.props.local_address, sendToAddress, amount * 10 ** 8, gwei * 10 ** 9, gas, privateKey, (err, result) => {
              if (err) {
                console.log('Error', err);
                self.setState({ label: 'Send', isDisabled: true, open: true, snackMessage: err.message.toString() })
              } else {
                let type;
                if (initPaymentDetails !== null && initPaymentDetails.id === -1) {
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
                  };
                  payVPNUsage(data).then((response) => {
                    console.log('vpn payment', response);
                    if (response.type === TX_SUCCESS) {
                      self.setState({ label: 'Send', isDisabled: true, sendToAddress: '', amount: '', password: '', isVPNPayment: false, open: true, snackMessage: lang[this.props.language]['TransactionSuccess'], url: true, txHash: response.payload });
                    } else {
                      self.setState({
                        label: 'Send', isDisabled: true, sendToAddress: '', amount: '', password: '', open: true, isVPNPayment: false,
                        snackMessage: response.payload ? response.payload : lang[this.props.language]['TransactionFailed']
                      });
                    }
                  })
                } else {
                  transferAmount(self.props.net ? 'rinkeby' : 'main', result).then((response) => {
                    console.log(response)
                    if (response.type === TX_SUCCESS) {
                      self.setState({ label: 'Send', isDisabled: true, sendToAddress: '', amount: '', password: '', open: true, snackMessage: lang[this.props.language]['TransactionSuccess'], url: true, txHash: response.payload });
                    } else {
                      if (response.payload) {
                        let regError = (response.payload).replace(/\s/g, "");
                        self.setState({
                          label: 'Send', isDisabled: true, sendToAddress: '', amount: '', password: '', open: true,
                          snackMessage: lang[this.props.language][regError] ? lang[this.props.language][regError] : response.payload
                        });
                      } else {
                        self.setState({
                          label: 'Send', isDisabled: true, sendToAddress: '', amount: '', password: '', open: true,
                          snackMessage: lang[this.props.language]['TransactionFailed']
                        });
                      }
                    }
                  });
                  self.props.setVPNDuePayment(null);
                }
              }
            });
          }
        }
      });

    }, 50);
  };

  onChangeSlider = (event, value) => {
    this.setState({
      gwei: value
    })
  };


  componentWillMount() {
    let { payVpn, initPaymentDetails } = this.props;
    if (payVpn.isVPNPayment) {
      this.setState({
        sendToAddress: payVpn.data.account_addr,
        amount: payVpn.data.amount / (10 ** 8),
        token: 'SENT',
        isVPNPayment: true,
        sessionId: payVpn.data.id
      });
      this.getGasLimit(payVpn.data.amount, payVpn.data.account_addr, 'SENT')
    } else if (initPaymentDetails !== null) {
      console.log('in else if')
      this.setState({
        sendToAddress: initPaymentDetails.account_addr,
        amount: initPaymentDetails.amount,
        token: 'SENT',
        isVPNPayment: true,
        sessionId: null
      });
      this.getGasLimit(initPaymentDetails.amount, initPaymentDetails.account_addr, 'SENT')
    }
  }

  render() {
    const { language, classes } = this.props;


    return (

      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={sendComponentStyles.mainDiv}>
          <Grid style={{ width: '750px' }}>
            <Row>
              <Col>
                <span style={sendComponentStyles.sendToAddress} >{lang[language].AddressToSend}</span>
              </Col>
              <Col style={sendComponentStyles.questionMarkDiv}>
                <CustomTooltips title={lang[language].ToTooltip} />
              </Col>
            </Row>
            <Row style={sendComponentStyles.textFieldDiv}>
              <Input
                type={'text'}
                placeholder={`${lang[language].Example}: 0x6b6df9e25f7bf2e363ec1a52a7da4c4a64f3955f3`}
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
                          this.state.amount}
                    />
                  </div>
                  <div style={{ width: '200px' }}>
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
                      min={1}
                      max={150}
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
                    placeholder={lang[language].KeyPass}
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
                  <div style={this.state.isDisabled ? sendComponentStyles.sendDivDisabled : sendComponentStyles.sendDiv}>
                    <Button
                      autoFocus={false}
                      variant='flat'
                      component='span'
                      fullWidth={true}
                      className={!this.state.isDisabled ? classes.enableButton : classes.disableButton}
                      disabled={this.state.isDisabled}
                      style={{ color: '#fff', fontWeight: '600', fontSize: '20px', fontFamily: 'Montserrat,Medium' }}
                      onClick={this.handleOnclick}
                    >{lang[language][this.state.label]}</Button>
                  </div>
                </div>
              </div>
            </Row>
          </Grid>
          <PositionedSnackbar open={this.state.open} message={this.state.snackMessage}
            language={this.props.language}
            close={this.handleSnackClose} url={this.state.url}
            txUrl={this.props.isTest ? `${this.state.checkTxTestStatus}${this.state.txHash}` : `${this.state.checkTxMainStatus}${this.state.txHash}`}
            checkStatus={() => { this.openInExternalBrowser(`${this.state.checkTxStatus}${this.state.txHash}`) }} />
        </div>
      </MuiThemeProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.setLanguage,
    isTest: state.setTestNet,
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