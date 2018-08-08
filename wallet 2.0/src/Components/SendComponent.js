import React from 'react';
import { MuiThemeProvider,Snackbar, Menu, MenuItem, RaisedButton, Slider, TextField, FlatButton, Dialog } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import DownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';
import TransIcon from 'material-ui/svg-icons/action/swap-horiz';
import RightArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { sendComponentStyles } from '../Assets/sendcomponent.style';
import SimpleMenu from './SharedComponents/SimpleMenu';
// import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CustomTooltips from './SharedComponents/customTooltip';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import lang  from '../Constants/language';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme({
  slider: {
    selectionColor: '#595d8f',
    trackSize: 4,
    handleSize: 20
  }
});

class SendComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 20
    }
  }

  onChangeSlider = (event, value) => {
    this.setState({
      sliderValue: value
    })
  }

  componentDidMount() {
    var ele = document.querySelectorAll(".jss85");
    ele[0].style.fontFamily = 'Montserrat, Medium';
    ele[0].style.fontWeight = 'bold';
  }

  render() {
    const { language } = this.props;

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
              <TextField
                autoFocus={false}
                underlineShow={false}
                hintText="Example: 0x6b6df9e25f7bf23343mfkr45"
                fullWidth={true}
                style={sendComponentStyles.textField}
                hintStyle={{ marginLeft: '1pc' }}
                inputStyle={{ marginLeft: '1pc' }}
              ></TextField>
            </Row>
            <Row style={sendComponentStyles.amountDiv}>
              <Col>
                <span style={sendComponentStyles.sendToAddress} >{lang[language].AmountTo}</span>
              </Col>
              <Col style={sendComponentStyles.questionMarkDiv}>
                <CustomTooltips title={lang[language].AmountTool1+'\n'+lang[language].AmountTool2} />
              </Col>
            </Row>
            <Row style={sendComponentStyles.amountDiv}>
              <Col style={sendComponentStyles.amountDivCol}>
                <div style={{ display: 'inline-flex' }}>
                  <div>
                    <TextField
                      autoFocus={false}
                      underlineShow={false}
                      fullWidth={true}
                      style={sendComponentStyles.textFieldAmount}
                      hintStyle={{ marginLeft: '1pc' }}
                      inputStyle={{ marginLeft: '1pc' }}
                    ></TextField>
                  </div>
                  <div style={{ width: '191px' }}>
                    <SimpleMenu />
                  </div>
                  <div style={{ marginLeft: '-60px', marginTop: '13px', position: 'relative' }}>
                    <DownArrow style={{ color: '#fff' }} />
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
                    <TextField
                      autoFocus={false}
                      underlineShow={false}
                      fullWidth={true}
                      style={sendComponentStyles.gasTextField}
                      inputStyle={{ marginLeft: '1pc' }}
                    ></TextField>
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
                        <span style={sendComponentStyles.gasWei}><span style={sendComponentStyles.gasValue}>{this.state.sliderValue}</span> gwei</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Slider
                      defaultValue={this.state.sliderValue}
                      disableFocusRipple={false}
                      style={sendComponentStyles.slider}
                      min={1.1}
                      max={100}
                      value={this.state.sliderValue}
                      onChange={this.onChangeSlider}></Slider>
                  </div>
                </div>
              </div>
            </Row>
            <Row>
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
                  <TextField
                    autoFocus={false}
                    underlineShow={false}
                    fullWidth={true}
                    style={sendComponentStyles.gasTextField}
                    inputStyle={{ marginLeft: '1pc' }}
                  >
                  </TextField>
                </div>
                <div>
                  <div style={sendComponentStyles.sendDiv}>
                    <FlatButton
                      label={'SEND'}
                      labelStyle={{ fontFamily: 'Montserrat, Medium', color: '#FFFFFF', fontSize: '20px' }}
                      fullWidth={true}
                      style={sendComponentStyles.button}
                    >
                    </FlatButton>
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
  }
}

// function mapDispatchToActions(dispatch) {
//   return bindActionCreators({
//       setTestNet,
//       getETHBalance,
//       getSentBalance,
//       setCurrentTab
//   }, dispatch)
// }

export default connect(mapStateToProps)(SendComponent);
