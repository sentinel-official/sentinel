import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Snackbar } from 'material-ui';

class Header extends Component {
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
      <div style={{ height: 70, backgroundColor: '#532d91' }}>
        <div>
          <Grid>
            <Row>
              <Col xs={2}>
                <div>
                  <img src={'../src/Images/2.png'} />
                </div>
              </Col>
              <Col xs={7} style={{
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div>
                  <Col>
                    <span style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#FAFAFA'
                    }}>SENTINEL - DASHBOARD</span>
                  </Col>
                  <Col>
                    <span style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#FAFAFA'
                    }}>
                      <span style={{ fontSize: 10 }}>{this.props.local_address}</span>
                      <CopyToClipboard text={this.props.local_address}
                        onCopy={() => this.setState({
                          snackMessage: 'Copied to Clipboard Successfully',
                          openSnack: true
                        })} >
                        <img
                          src={'../src/Images/download.jpeg'}
                          style={styles.clipBoard}
                        />
                      </CopyToClipboard>
                    </span>
                  </Col>
                </div>
              </Col>
              <Col xs={3}>
                <div>
                  <Col style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#FAFAFA'
                  }}>
                    <span>SENT: {this.props.balance.sents}</span>
                  </Col>
                  <Col style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#FAFAFA'
                  }}>
                    <span>ETH: {this.props.balance.eths}</span>
                  </Col>
                </div>
                <Snackbar
                  open={this.state.openSnack}
                  message={this.state.snackMessage}
                  autoHideDuration={2000}
                  onRequestClose={this.snackRequestClose}
                  style={{ marginBottom: '2%' }}
                />
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    )
  }
}


const styles = {
  clipBoard: {
    height: 20,
    width: 20,
    cursor: 'pointer'
  }
}
export default Header;