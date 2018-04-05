import React, { Component } from 'react';
import { getEthTransactionHistory, getSentTransactionHistory, isOnline } from '../Actions/AccountActions';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import _ from 'lodash';
import { RaisedButton, IconButton, Snackbar } from 'material-ui';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import EtherTransaction from './EtherTransaction';
import SentTransaction from './SentTransaction';
let zfill = require('zfill');
var lang = require('./language');

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ethData: [],
      sentData: [],
      isGetHistoryCalled: false,
      isLoading: true,
      ethActive: true,
      openSnack: false,
      snackMessage: '',
      pageNumber: 1,
      nextDisabled: false,
      isInitial: true
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
    if (this.state.isInitial && this.props.local_address !== "") {
      this.getEthHistory(this.state.pageNumber);
      this.getSentHistory();
      this.setState({ isInitial: false });
    }
    let language = this.props.lang;
    let ethOutput = <EtherTransaction
      data={this.state.ethData} isTest={this.props.isTest} local_address={this.props.local_address} lang={this.props.lang} />
    let sentOutput = <SentTransaction
      data={this.state.sentData} isTest={this.props.isTest} local_address={this.props.local_address} lang={this.props.lang} />
    return (
      <div style={{ margin: '1% 3%' }}>
        {this.state.ethActive ?
          <span style={styles.transactionsHeading}>{lang[language].EthTransactions}</span> :
          <span style={styles.transactionsHeading}>{lang[language].SentTransactions}</span>}
        <span style={{ marginLeft: this.props.lang === 'en' ? '60%' : '58%' }}>
          <IconButton>
            <Refresh onClick={this.handleRefresh.bind(this)} />
          </IconButton>
          <RaisedButton
            label="ETH"
            buttonStyle={this.state.ethActive ? { backgroundColor: 'grey' } : {}}
            onClick={() => { this.setState({ ethActive: true }) }}
          />
          <RaisedButton
            label="SENT"
            buttonStyle={this.state.ethActive ? {} : { backgroundColor: 'grey' }}
            onClick={() => { this.setState({ ethActive: false }) }}
          />
        </span>
        {this.state.isLoading === true ? this.renderProgress() :
          <div >
            {this.state.ethActive ?
              <div>
                {ethOutput}
                <div style={{ float: 'right' }}>
                  <RaisedButton
                    label="Back"
                    onClick={() => { this.getEthHistory(this.state.pageNumber - 1) }}
                    disabled={this.state.pageNumber === 1 ? true : false}
                  />
                  <RaisedButton
                    label="Next"
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
  }
}

export default History;