import React, { Component } from 'react';
import style from 'material-ui/svg-icons/image/style';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getTransactionHistory } from '../Actions/AccountActions';
import { setTimeout } from 'timers';
import { Snackbar } from 'material-ui';
import RefreshIndicator from 'material-ui/RefreshIndicator';

let shell = window
  .require('electron')
  .shell;

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isGetHistoryCalled: false,
      isLoading: true,
      openSnack: false,
      snackMessage: ''
    }
  }

  renderProgress() {
    const { refresh } = styles;
    return (
      <RefreshIndicator
        size={50}
        left={200}
        top={200}
        loadingColor="#532d91"
        status="loading"
        style={refresh}
      />
    )
  }
  getHistory() {
    let that = this;
    getTransactionHistory(this.props.local_address, (err, history) => {
      if (err)
        console.log(err);
      else {
        that.setState({ data: history, isLoading: false })
      }
    })
  }

  openInExternalBrowser(url) {
    shell.openExternal(url);
  };
  snackRequestClose = () => {
    this.setState({
      openSnack: false,
    });
  };

  render() {

    let output;
    let that = this;
    if (!this.state.isGetHistoryCalled) {
      setInterval(function () {

        that.getHistory();
      }, 10000);

      this.setState({ isGetHistoryCalled: true });
    }

    let data = this.state.data;
    if (data.length == 0) {
      output = <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20%' }}>No Transactions yet</div>
    }
    else {
      output = data.map((history) => {
        return (
          <div style={styles.wholeDiv}>
            {history.from_addr == that.props.local_address
              ? <div>
                <div>
                  <span style={{
                    color: 'red',
                    fontWeight: 'bold'
                  }}>OUT
                  </span>
                  <span style={{ marginLeft:5 }}>{new Date(history.timestamp * 1000).toGMTString()}</span>
                </div>
                <div>
                  <span style={{
                    fontWeight: 'bold'
                  }}>To:
                  </span>
                  <a style={{ cursor: 'pointer', marginLeft: 5 }}
                    onClick={() => {
                      this.openInExternalBrowser(`https://etherscan.io/address/${history.to_addr}`)
                    }}>{history.to_addr}</a>
                  <CopyToClipboard text={history.to_addr}
                    onCopy={() => that.setState({
                      snackMessage: 'Copied to Clipboard Successfully',
                      openSnack: true
                    })} >
                    <img src={'../src/Images/download.jpeg'} style={styles.clipBoard} />
                  </CopyToClipboard>
                </div>
              </div>
              : <div>
                <div>
                  <span style={{
                    fontWeight: 'bold',
                    color: '#532d91'
                  }}>IN
                </span>
                  <span style={{ marginLeft: 5 }}>{new Date(history.timestamp * 1000).toGMTString()}</span>
                </div>
                <div>
                  <span style={{
                    fontWeight: 'bold'
                  }}>
                    From:
                </span>
                  <a style={{ cursor: 'pointer', marginLeft: 5 }}
                    onClick={() => {
                      this.openInExternalBrowser(`https://etherscan.io/address/${history.from_addr}`)
                    }}>{history.from_addr}</a>
                  <CopyToClipboard text={history.from_addr}
                    onCopy={() => that.setState({
                      snackMessage: 'Copied to Clipboard Successfully',
                      openSnack: true
                    })} >
                    <img src={'../src/Images/download.jpeg'} style={styles.clipBoard} />
                  </CopyToClipboard>
                </div>
              </div>
            }
            <pre style={{ marginTop: 0, fontFamily: 'Poppins', overflow: 'hidden' }}>
              <span style={{ fontWeight: 'bold' }}>Amount : </span><span>{history.amount} </span>
              <span>{history.unit}s</span>  |
                    <span style={{ fontWeight: 'bold' }}> Status : </span><span>Success</span>  |
                    <span style={{ fontWeight: 'bold' }}> Tx : </span>
              <a style={styles.anchorStyle} onClick={
                () => {
                  this.openInExternalBrowser(`https://etherscan.io/tx/${history.tx_hash}`)
                }}>{history.tx_hash}</a></pre>
          </div>
        )
      })
    }
    return (
      <div style={{
        margin: '5%'
      }}>
        {this.state.isLoading === true ? this.renderProgress() :
          <div style={{ height: 480, overflowY: 'auto', overflowX: 'hidden' }}>{output}</div>
        }
        <Snackbar
          open={this.state.openSnack}
          message={this.state.snackMessage}
          autoHideDuration={2000}
          onRequestClose={this.snackRequestClose}
          style={{ marginBottom: '2%' }}
        />
      </div>
    )
  }
}

const styles = {
  wholeDiv: {
    fontSize: 14,
    marginBottom: '5%',
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.66)'
  },
  anchorStyle: {
    width: 220,
    position: 'relative',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
  },
  clipBoard: {
    height: 20,
    width: 20,
    cursor: 'pointer'
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
    // justifyContent: 'center',
    // alignItems: 'center'
  },
}

export default History;