import React from 'react';
import { MuiThemeProvider, Snackbar, Menu, MenuItem, RaisedButton, Slider, TextField, FlatButton, Dialog } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import DownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';
import TransIcon from 'material-ui/svg-icons/action/swap-horiz';
import RightArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { sendComponentStyles } from '../Assets/sendcomponent.style';
import SimpleMenu from './SharedComponents/SimpleMenu';

const muiTheme = getMuiTheme({
  slider: {
    selectionColor: '#595d8f',
    trackSize: 4,
    handleSize: 20
  }
});

export default class SendComponent extends React.Component {
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

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={sendComponentStyles.mainDiv}>
          <Grid style={{ width: '750px' }}>
            <Row>
              <Col>
                <span style={sendComponentStyles.sendToAddress} >SEND TO ADDRESS</span>
              </Col>
              <Col style={sendComponentStyles.questionMarkDiv}>
                <span style={sendComponentStyles.questionMark}>?</span>
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
                <span style={sendComponentStyles.sendToAddress} >AMOUNT</span>
              </Col>
              <Col style={sendComponentStyles.questionMarkDiv}>
                <span style={sendComponentStyles.questionMark}>?</span>
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
                  <div style={{width:'191px'}}>
                    <SimpleMenu />
                  </div>
                  <div style={{ marginLeft: '-60px', marginTop: '13px', position:'relative'}}>
                    <DownArrow style={{color:'#fff'}}/>
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
                      <span style={sendComponentStyles.sendToAddress} >Gas Limit</span>
                    </div>
                    <div style={sendComponentStyles.questionMarkDiv}>
                      <span style={sendComponentStyles.questionMark}>?</span>
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
                      <span style={sendComponentStyles.sendToAddress} >Gas Price</span>
                    </div>
                    <div style={sendComponentStyles.questionMarkDiv}>
                      <span style={sendComponentStyles.questionMark}>?</span>
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
                  <span style={sendComponentStyles.sendToAddress} >PASSWORD</span>
                </div>
                <div style={sendComponentStyles.questionMarkDiv}>
                  <span style={sendComponentStyles.questionMark}>?</span>
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
