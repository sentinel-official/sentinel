import React, { Component } from 'react';
import { getEthTransactionHistory, getSentTransactionHistory, isOnline, sendError, getSwapTransactionStatus } from '../Actions/AccountActions';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import _ from 'lodash';
import { RaisedButton, IconButton, Snackbar } from 'material-ui';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import EtherTransaction from './EtherTransaction';
import SentTransaction from './SentTransaction';
let zfill = require('zfill');
var lang = require('./language');
var StatusInterval = null;
var showDivCount = 0;

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ethData: [],
      sentData: [],
      isGetStatusCalled: false,
      isLoading: true,
      ethActive: false,
      openSnack: false,
      snackMessage: '',
      pageNumber: 1,
      nextDisabled: false,
      isInitial: true,
      showDiv: false,
      txStatus: 'Pending'
    }
  }

  renderProgress() {
    const { refresh } = styles;
    return (
      <RefreshIndicator
        size={50}
        left={420}
        top={150}
        loadingolor="#532d91"
        status="loading"
        style={refresh}
      />
    )
  }

  componentDidCatch(error, info) {
    sendError(error);
  }

  getEthHistory(page) {
    this.setState({ isLoading: true, nextDisabled: false });
    let that = this;
    getEthTransactionHistory(this.props.local_address, page, (err, history) => {
      if (err) {
        that.setState({ isLoading: false, nextDisabled: true })
      }
      else {
        that.setState({ ethData: _.sortBy(history, o => o.timeStamp).reverse(), pageNumber: page, isLoading: false })
      }
    })
  }

  getStatus = () => {
    let self = this;
    getSwapTransactionStatus(this.props.swapHash, function (err, result) {
      if (err) {
        self.setState({ showDiv: false });
      }
      else if (result['status'] === 1) {
        if (showDivCount === 0) {
          showDivCount++;
          self.setState({ txStatus: 'Success', showDiv: true })
        }
        if (showDivCount === 1) {
          self.props.removeSwapHash();
          self.setState({ showDiv: false, pageNumber: 1 })
          self.getEthHistory(1);
          self.getSentHistory();
        }
      }
      else if (result['status'] === 0) {
        self.setState({ txStatus: 'Pending', showDiv: true })
      }
      else {
        if (showDivCount === 0) {
          showDivCount++;
          self.setState({ txStatus: 'Error' })
        }
        if (showDivCount === 1) {
          self.props.removeSwapHash();
          self.setState({ showDiv: false, pageNumber: 1 })
          self.getEthHistory(1);
          self.getSentHistory();
        }
      }
    })
  }

  getSentHistory() {
    this.setState({ isLoading: true });
    let that = this;
    getSentTransactionHistory('0x' + zfill(this.props.local_address.substring(2), 64), (err, history) => {
      if (err) {
        that.setState({ isLoading: false })
      }
      else {
        that.setState({ sentData: _.sortBy(history, o => o.timeStamp).reverse(), isLoading: false })
      }
    })
  }

  snackRequestClose = () => {
    this.setState({
      openSnack: false
    });
  };

  handleRefresh() {
    if (isOnline()) {
      if (this.state.ethActive)
        this.getEthHistory(1);
      else
        this.getSentHistory();
    }
    else {
      this.setState({ openSnack: true, snackMessage: 'Check your Internet Connection' })
    }
  }

  render() {
    let self = this;
    if (this.state.isInitial && this.props.local_address !== "") {
      this.getEthHistory(this.state.pageNumber);
      this.getSentHistory();
      this.setState({ isInitial: false });
    }
    if (!this.state.isGetStatusCalled && this.props.swapHash) {
      setInterval(function () {
        self.getStatus();
      }, 2000);

      this.setState({ isGetStatusCalled: true });
    }
    let language = this.props.lang;
    let ethOutput = <EtherTransaction
      data={this.state.ethData} isTest={this.props.isTest} local_address={this.props.local_address} lang={this.props.lang} hasExtraDiv={this.state.showDiv} />
    let sentOutput = <SentTransaction
      data={this.state.sentData} isTest={this.props.isTest} local_address={this.props.local_address} hasExtraDiv={this.state.showDiv}
      lang={this.props.lang} currentHash={this.props.currentHash} removeHash={this.props.removeHash} getHistory={this.getSentHistory.bind(this)} />
    return (
      <div style={{ margin: '1% 3%' }}>
        {this.state.ethActive ?
          <span style={styles.transactionsHeading}>{lang[language].EthTransactions}</span> :
          <span style={styles.transactionsHeading}>{lang[language].SentTransactions}</span>}
        <span style={{ marginLeft: this.props.lang === 'en' ? '65%' : '60%' }}>
          <IconButton style={{ position: 'absolute', marginLeft: -50, marginTop: -8 }}>
            <Refresh onClick={this.handleRefresh.bind(this)} />
          </IconButton>
          <RaisedButton
            label="SENT"
            buttonStyle={this.state.ethActive ? {} : styles.activeButtonColor}
            onClick={() => { this.setState({ ethActive: false }) }}
          />
          <RaisedButton
            label="ETH"
            buttonStyle={this.state.ethActive ? styles.activeButtonColor : {}}
            onClick={() => { this.setState({ ethActive: true }) }}
          />
        </span>
        {this.state.isLoading === true ? this.renderProgress() :
          <div >
            {this.state.showDiv && !this.props.isTest ? <div style={styles.wholeDiv}>
              <span>Swap Transaction {this.props.swapHash} Status: <span style={{ fontWeight: 'bold' }}>{this.state.txStatus}</span></span>
            </div> : null}
            {this.state.ethActive ?
              <div>
                {ethOutput}
                <div style={{ float: 'right' }}>
                  <RaisedButton
                    label={lang[language].Back}
                    onClick={() => { this.getEthHistory(this.state.pageNumber - 1) }}
                    disabled={this.state.pageNumber === 1 ? true : false}
                  />
                  <RaisedButton
                    label={lang[language].Next}
                    disabled={this.state.nextDisabled}
                    onClick={() => { this.getEthHistory(this.state.pageNumber + 1) }}
                  />
                </div>
              </div>
              :
              <div>
                {sentOutput}
              </div>}
          </div>
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
  refresh: {
    display: 'inline-block',
    position: 'relative',
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  transactionsHeading: {
    fontSize: 16,
    fontWeight: 600
  },
  activeButtonColor: {
    backgroundColor: 'grey'
  },
  wholeDiv: {
    fontSize: 14,
    marginTop: '2%',
    marginBottom: '2%',
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.66)'
  }
}

export default History;