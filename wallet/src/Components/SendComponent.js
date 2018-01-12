import React, { Component } from 'react';
import { MuiThemeProvider, DropDownMenu, MenuItem, FlatButton, TextField } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { transferAmount, getAccount } from '../Actions/AccountActions';
import { purple500 } from 'material-ui/styles/colors';


let shell = window
  .require('electron')
  .shell;

class SendComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keystore: '',
      to_address: '',
      amount: '',
      gas: '',
      data: '',
      priv_key: '',
      file: '',
      unit: 'ETH',
      tx_addr: null,
      password: '',
      isDisabled: true,
      sending: null
    };
  }

  openInExternalBrowser(url) {
    shell.openExternal(url);
    this.setState({ tx_addr: null })
  };

  onClickSend = () => {
    this.setState({
      sending: true
    })
    let body = {
      from_addr: this.props.local_address,
      to_addr: this.state.to_address,
      amount: this.state.amount,
      unit: this.state.unit,
      keystore: this.state.keystore,
      password: this.state.password,
      session_id: null,

    }
    let that = this;
    transferAmount(body, function (err, tx_addr) {
      if (err) console.log(err, "Error");
      else {
        that.setState({
          tx_addr: tx_addr,
          to_address: '',
          amount: '',
          gas: '',
          data: '',
          unit: 'ETH',
          password: '',
          sending: false
        })
      }
    });
  }

  renderLink() {
    return (
      <div>
        Your Transaction is Placed Successfully. Check Status <a onClick={() => {
          this.openInExternalBrowser(`https://etherscan.io/tx/${this.state.tx_addr}`)
        }} style={{ color: '#1d400' }}>Here</a>
      </div>
    )
  }

  clearTaxAdd = () => {

  }

  handleChange = (event, index, unit) => this.setState({ unit });
  render() {
    return (
      <MuiThemeProvider>
        <div style={{
          minHeight: 450,
          backgroundColor: '#c3deea',
          margin: 15
        }}>
          <Grid>
            <Row style={{ marginBottom: 15, paddingTop: 20 }}>
              <Col xs={3}>
                <span>To:</span>
              </Col>
              <Col xs={9}>
                <TextField
                  style={{ backgroundColor: '#FAFAFA', height: 30 }}
                  underlineShow={false} fullWidth={true}
                  onChange={(event, to_address) => this.setState({ to_address: to_address, isDisabled: false })}
                  value={this.state.to_address}
                />
              </Col>
            </Row>
            <Row style={{ marginBottom: 15 }}>
              <Col xs={3}>
                <span>Amount:</span>
              </Col>
              <Col xs={5}>
                <TextField type="number" style={{ backgroundColor: '#FAFAFA', height: 30 }} underlineShow={false} fullWidth={true} onChange={(event, amount) => this.setState({ amount })} value={this.state.amount} />
              </Col>
              <Col xs={4}>
                <DropDownMenu
                  autoWidth={true}
                  iconStyle={{
                    top: -6
                  }}
                  labelStyle={{
                    height: 30,
                    lineHeight: '30px',
                    fontWeight: '600',
                    color: purple500
                  }}
                  // selectedMenuItemStyle={{
                  //   lineHeight: '30px',
                  //   fontWeight: '700',
                  //   color: purple500,
                  //   paddingRight: -4,
                  //   height: 50
                  // }}
                  style={{
                    backgroundColor: '#FAFAFA',
                    height: 30,
                    width: '90%'
                  }}
                  value={this.state.unit}
                  onChange={this.handleChange.bind(this)}
                >
                  <MenuItem
                    value="ETH"
                    primaryText="ETH"
                  />
                  <MenuItem
                    value="SENT"
                    primaryText="SENT"
                  />
                </DropDownMenu>
              </Col>
            </Row>
            <Row style={{ marginBottom: 15 }}>
              <Col xs={3}>
                <span>Gas</span>
              </Col>
              <Col xs={9}>
                <TextField type="number" style={{ backgroundColor: '#FAFAFA', height: 30 }} underlineShow={false} fullWidth={true} onChange={(event, gas) => this.setState({ gas })} value={this.state.gas} />
              </Col>
            </Row>
            <Row style={{ marginBottom: 15 }}>
              <Col xs={3}>
                <span>Data: </span>
              </Col>
              <Col xs={9}>
                <TextField multiLine={true} rowsMax={3} rows={2} style={{ backgroundColor: '#FAFAFA', height: 30 }} underlineShow={false} fullWidth={true} onChange={(event, data) => this.setState({ data })} value={this.state.data} />
              </Col>
            </Row>
            <Row style={{ marginBottom: 15 }}>
              <Col xs={3}>
                <span>Password: </span>
              </Col>
              <Col xs={9}>
                <TextField type="password" style={{ backgroundColor: '#FAFAFA', height: 30 }} underlineShow={false} fullWidth={true} onChange={(event, password) => this.setState({ password })} value={this.state.password} />
              </Col>
            </Row>
          </Grid>
          <div>
            <FlatButton disabled={this.state.to_address === '' ? true : false} onClick={this.onClickSend.bind(this)} label={this.state.sending === null || this.state.sending === false ? "Send" : "Sending..."}
              style={
                this.state.isDisabled === true ? { backgroundColor: '#bdbdbd', marginLeft: 20 }
                  :
                  { backgroundColor: '#f05e09', marginLeft: 20 }
              }
              labelStyle={{ paddingLeft: 10, paddingRight: 10, fontWeight: '600', color: '#FAFAFA' }}
            />
          </div>
          {this.state.tx_addr == null ? '' : this.renderLink()}
        </div>
        <div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default SendComponent;
