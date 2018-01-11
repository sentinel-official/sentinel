import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';

const Header = (props) => {
  console.log('hello', props)
  return (
    <div style={{height: 70, backgroundColor: '#532d91'}}>
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
                  }}>SENTINEL - DASHOBAORD</span>
                </Col>
                <Col>
                  <span style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#FAFAFA'
                  }}>
                  <span style={{fontSize: 10}}>{props.local_address}</span>
                    <CopyToClipboard text={props.local_address} >
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
                  <span>SENT: {props.balance.sents}</span>
                </Col>
                <Col style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#FAFAFA'
                  }}>
                  <span>ETH: {props.balance.eths}</span>
                </Col>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    </div>
  )
}


const styles = {
  clipBoard: {
    height: 20, 
    width: 20, 
    cursor: 'pointer'
  }
}
export default Header;