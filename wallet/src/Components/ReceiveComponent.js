import React, { Component } from 'react';
import { QRCode } from 'react-qr-svg';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Snackbar } from 'material-ui';
import ReactTooltip from 'react-tooltip';

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
                marginLeft: 370,
                marginTop: 70,
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
                marginLeft: 290
              }}>
                <label style={{
                  color: '#31b0d5',
                  fontWeight: 'bold'
                }}>{this.props.local_address} <CopyToClipboard text={this.props.local_address}
                  onCopy={() => this.setState({
                    snackMessage: 'Copied to Clipboard Successfully',
                    openSnack: true
                  })} >
                    <img
                      src={'../src/Images/download.jpeg'}
                      data-tip data-for="copyImage"
                      style={{
                        height: 18,
                        width: 18,
                        cursor: 'pointer'
                      }}
                    />
                  </CopyToClipboard></label>
                <ReactTooltip id="copyImage" place="bottom">
                  <span>Copy</span>
                </ReactTooltip>
              </div>
            </Col>
          </Row>
        </Grid>
        <Snackbar
          open={this.state.openSnack}
          message={this.state.snackMessage}
          autoHideDuration={2000}
          onRequestClose={this.snackRequestClose}
          style={{ marginBottom: '2%'}}
        />
      </div>
    )
  }
}

export default ReceiveComponent;