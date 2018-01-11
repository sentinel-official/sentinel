import React, { Component } from 'react';
import { MuiThemeProvider, DropDownMenu, MenuItem, FlatButton, TextField } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { transferAmount, getAccount } from '../Actions/AccountActions';

class SendComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keystore: '',
      to_address: '',
      amount: 0,
      gas: '',
      data: '',
      priv_key: '',
      file: '',
      unit: 'ETH',
      tx_addr: null,
      password: ''
    };
  }

  componentDidMount() {
  }

  onClickSend = () => {
    let body = {
      from_addr: this.props.local_address,
      to_addr: this.state.to_address,
      amount: this.state.amount,
      unit: this.state.unit,
      keystore: this.state.keystore,
      password: this.state.password,
      session_id: null
    }
    let that = this;
    transferAmount(body, function(err, tx_addr) {
        if (err) console.log(err, "Error");
        else {
            that.setState({
              tx_addr: tx_addr
            })
        }
    });
}

renderLink() {
    return (
      <div>
        Your Transaction is Placed Successfully. Check Status <a style={{color: '#1d400'}} href={`https://etherscan.io/tx/${this.state.tx_addr}`}>Here</a>
      </div>
    )
}

  handleChange = (event, index, unit) => this.setState({unit});
  render() {
    console.log(this.state)
    return (
      <MuiThemeProvider>
        <div style={{
          minHeight: 450,
          backgroundColor: '#c3deea',
          margin: 15
          }}>
          <Grid>
            <Row style={{marginBottom: 15, paddingTop: 20}}>
              <Col xs={2}>
                <span>To:</span>
              </Col>
              <Col xs={9}>
            <TextField style={{backgroundColor: '#FAFAFA', height: 30}} underlineShow={false}  fullWidth={true} onChange={(event, to_address) => this.setState({to_address})} value={this.state.to_address} />
              </Col>
            </Row>
            <Row style={{marginBottom: 15}}>
              <Col xs={2}>
                <span>Amount:</span>
              </Col>
              <Col xs={7}>
            <TextField type="number" style={{backgroundColor: '#FAFAFA', height: 30}} underlineShow={false} fullWidth={true} onChange={(event, amount) => this.setState({amount})} value={this.state.amount} />
              </Col>
              <Col xs={3}>
                <DropDownMenu
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
            <Row style={{marginBottom: 15}}>
              <Col xs={2}>
                <span>Gas</span>
              </Col>
              <Col xs={9}>
            <TextField type="number" style={{backgroundColor: '#FAFAFA', height: 30}} underlineShow={false}  fullWidth={true} onChange={(event, gas) => this.setState({gas})} value={this.state.gas} />
              </Col>
            </Row>
            <Row style={{marginBottom: 15}}>
              <Col xs={2}>
                <span>Data: </span>
              </Col>
              <Col xs={9}>
            <TextField multiLine={true} rowsMax={3} rows={2} style={{backgroundColor: '#FAFAFA', height: 30}} underlineShow={false}  fullWidth={true} onChange={(event, data) => this.setState({data})} value={this.state.data} />
              </Col>
            </Row>
            <Row style={{marginBottom: 15}}>
              <Col xs={2}>
                <span>Password: </span>
              </Col>
              <Col xs={9}>
            <TextField type="password" style={{backgroundColor: '#FAFAFA', height: 30}} underlineShow={false}  fullWidth={true} onChange={(event, password) => this.setState({password})} value={this.state.password} />
              </Col>
            </Row>
            {/* <Row style={{marginBottom: 15, marginLeft: 15, marginRight: 15}}>
              <Col xs={12}>
            <TextField placeholder="Enter Private Key To Sign The Transaction" style={{backgroundColor: '#FAFAFA', height: 30}} underlineShow={false}  fullWidth={true} onChange={(event, keystore) => this.setState({keystore})} value={this.state.keystore} />
              </Col>
            </Row> */}
          </Grid>
          <div>
          <FlatButton onClick={this.onClickSend.bind(this)} label="Send" style={{backgroundColor: '#f05e09', marginLeft: 20}} labelStyle={{paddingLeft: 10, paddingRight: 10, fontWeight: '600', color: '#FAFAFA' }} />
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
