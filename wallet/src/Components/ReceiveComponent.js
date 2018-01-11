import React, { Component } from 'react';
import { QRCode } from 'react-qr-svg';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Snackbar } from 'material-ui';

let qrcode;
class ReceiveComponent extends Component {

  constructor(props) {
    super(props);

      this.state = {
        openSnack: false,
        snackMessage: ''
      }
  }
  
  snackRequestClose = () => {
    this.setState({
      openSnack: false,
    });
  };


  render() {
    return (
      <div>
        <Grid style={{
          // display: 'flex',
          // alignItems: 'center',
          // justifyContent: 'center'
        }}>
          <Row>
            <Col>
                <div style={{
                  marginLeft: 100,
                  marginTop: 20,
                  marginBottom: 30,
                  }}>
                 <QRCode
                  bgColor="#FFFFFF"
                  level="Q"
                  style={{ width: 256 }}
                  value={this.props.local_address}
                  fgColor="#000000"
                  />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
                  <div style={{
                    marginLeft: 50
                  }}>
                  <label style={{
                    color: '#532d91',
                    fontWeight: 'bold'
                  }}>{this.props.local_address}<CopyToClipboard text={this.props.local_address}
                  onCopy={() => this.setState({
                    snackMessage: 'Copied to Clipboard Successfully',
                    openSnack: true
                  })} >
                  <img
                    src={'../src/Images/download.jpeg'}
                    style={{
                      height: 20,
                      width: 20,
                      cursor: 'pointer'
                    }}
                  />
                </CopyToClipboard></label>
                  </div>
            </Col>
          </Row>
        </Grid>
        <Snackbar
                  open={this.state.openSnack}
                  message={this.state.snackMessage}
                  autoHideDuration={2000}
                  onRequestClose={this.snackRequestClose}
                  style={{ marginBottom: '2%',width:'80%' }}
                />
      </div>
    )
  }
}

export default ReceiveComponent;