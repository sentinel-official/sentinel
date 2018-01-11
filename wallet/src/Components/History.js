import React, {Component} from 'react';
import style from 'material-ui/svg-icons/image/style';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getTransactionHistory} from '../Actions/AccountActions';
import { setTimeout } from 'timers';
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
      isLoading: true

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
        that.setState({data: history, isLoading: false})
      }
    })
  }

  openInExternalBrowser(url) {
    shell.openExternal(url);
  };

  render() {

    let output;
    let that = this;
    if (!this.state.isGetHistoryCalled) {
      setInterval(function () {

        that.getHistory();
      }, 10000);

      this.setState({isGetHistoryCalled: true});
    }

    let data = this.state.data;

    output = data.map((history) => {
      return (
        <div style={styles.wholeDiv}>
          {history.from_addr == that.state.account_addr
            ? <div>
                <div>
                  <span style={{
                    color: 'red',
                    fontWeight: 'bold'
                  }}>OUT
                  </span>
                  <span>{history.date}</span>
                </div>
                <div>
                  <span style={{
                    fontWeight: 'bold'
                  }}>To :
                  </span>
                  <a
                    onClick={() => {
                    this.openInExternalBrowser(`https://etherscan.io/address/${history.to_addr}`)
                  }}>{history.to_addr}</a>
                  <CopyToClipboard text={history.to_addrs}>
                    <img src={'../src/Images/download.jpeg'} style={styles.clipBoard}/>
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
                <span>{history.date}</span>
              </div>
              <div>
                <span style={{
                    fontWeight: 'bold'
                  }}>
                  From:
                </span>
                <a
                  onClick={() => {
                  this.openInExternalBrowser(`https://etherscan.io/address/${history.from_addr}`)
                }}>{history.from_addr}</a>
                <CopyToClipboard text={history.from_addr}>
                  <img src={'../src/Images/download.jpeg'} style={styles.clipBoard}/>
                </CopyToClipboard>
              </div>
            </div>
}
          <pre style={{ marginTop: 0, fontFamily: 'Poppins' }}>
                        <span style={{ fontWeight: 'bold' }}>Amount : </span><span>{history.amount} </span>
                        <span>{history.unit}s</span>  |
                    <span style={{ fontWeight: 'bold' }}> Status : </span><span>{history.status}</span>  |
                    <span style={{ fontWeight: 'bold' }}> Tx : </span>
                        <a style={styles.anchorStyle} onClick={
                            () => {
                                this.openInExternalBrowser(`https://etherscan.io/tx/${history.tx_hash}`)
                            }}>{history.tx_hash}</a></pre>
                </div>
      )
    })
    return (
      <div style={{
        margin: '5%'
      }}>
        {this.state.isLoading === true ? this.renderProgress() : output}
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
    position: 'absolute',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
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