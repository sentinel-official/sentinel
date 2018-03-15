import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Snackbar } from 'material-ui';
import ReactTooltip from 'react-tooltip';
var config = require('../config');

let shell = window
    .require('electron')
    .shell;

let statusUrl;

class EtherTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSnack: false,
            snackMessage: ''
        }
    }

    openInExternalBrowser(url) {
        shell.openExternal(url);
    }

    getStatusUrl() {
        if (localStorage.getItem('config') === 'TEST')
            return config.test.statusUrl
        else return config.main.statusUrl
    }

    snackRequestClose = () => {
        this.setState({
            openSnack: false,
        });
    };
    render() {
        let output;
        let that = this;
        let data = this.props.data;
        let address = this.props.local_address;
        if (data.length === 0) {
            output = <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20%' }}>No Transactions yet</div>
        }
        else {
            output = data.map((history) => {
                return (
                    <div style={styles.wholeDiv}>
                        {(history.from).toLowerCase() === address.toLowerCase()
                            ? <div>
                                <div>
                                    <span style={{
                                        color: 'red',
                                        fontWeight: 'bold'
                                    }}>OUT
                  </span>
                                    <span style={{ marginLeft: 5 }}>{new Date(history.timeStamp * 1000).toGMTString()}</span>
                                </div>
                                <div>
                                    <span style={{
                                        fontWeight: 'bold'
                                    }}>To:
                  </span>
                                    <a style={{ cursor: 'pointer', marginLeft: 5 }}
                                        onClick={() => {
                                            statusUrl = this.getStatusUrl();
                                            this.openInExternalBrowser(`${statusUrl}/address/${history.to}`)
                                        }}>{history.to}</a>
                                    <CopyToClipboard text={history.to}
                                        onCopy={() => that.setState({
                                            snackMessage: 'Copied to Clipboard Successfully',
                                            openSnack: true
                                        })} >
                                        <img src={'../src/Images/download.jpeg'}
                                            alt="copy"
                                            data-tip data-for="copyImage"
                                            style={styles.clipBoard} />
                                    </CopyToClipboard>
                                    <span style={{
                                        fontWeight: 'bold'
                                    }}>
                                        Gas Price:
                </span>
                                    <span style={{ marginLeft: 5 }}>
                                        {parseInt(history.gasPrice) / (10 ** 9)} Gwei
                </span>
                                </div>
                            </div>
                            : <div>
                                <div>
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: '#532d91'
                                    }}>IN
                </span>
                                    <span style={{ marginLeft: 5 }}>{new Date(history.timeStamp * 1000).toGMTString()}</span>
                                </div>
                                <div>
                                    <span style={{
                                        fontWeight: 'bold'
                                    }}>
                                        From:
                </span>
                                    <a style={{ cursor: 'pointer', marginLeft: 5 }}
                                        onClick={() => {
                                            statusUrl = this.getStatusUrl();
                                            this.openInExternalBrowser(`${statusUrl}/address/${history.from}`)
                                        }}>{history.from}</a>
                                    <CopyToClipboard text={history.from}
                                        onCopy={() => that.setState({
                                            snackMessage: 'Copied to Clipboard Successfully',
                                            openSnack: true
                                        })} >
                                        <img src={'../src/Images/download.jpeg'}
                                            alt="copy"
                                            data-tip data-for="copyImage"
                                            style={styles.clipBoard} />
                                    </CopyToClipboard>
                                    <span style={{
                                        fontWeight: 'bold'
                                    }}>
                                        Gas Price:
                </span>
                                    <span style={{ marginLeft: 5 }}>
                                        {parseInt(history.gasPrice) / (10 ** 9)} Gwei
                </span>
                                </div>
                            </div>
                        }
                        <pre style={{ marginTop: 0, fontFamily: 'Poppins', overflow: 'hidden' }}>
                            <span style={{ fontWeight: 'bold' }}>Amount : </span><span>{parseInt(history.value) / (10 ** 18)} </span>
                            <span>ETHs</span>  |
                    <span style={{ fontWeight: 'bold' }}> Status : </span><span>{history.isError === '0' ? 'Success' : 'Error'}</span>  |
                    <span style={{ fontWeight: 'bold' }}> Tx : </span>
                            <a style={styles.anchorStyle} onClick={
                                () => {
                                    statusUrl = this.getStatusUrl();
                                    this.openInExternalBrowser(`${statusUrl}/tx/${history.hash}`)
                                }}>{history.hash}</a>
                            <CopyToClipboard text={history.transactionHash}
                                onCopy={() => that.setState({
                                    snackMessage: 'Copied to Clipboard Successfully',
                                    openSnack: true
                                })} >
                                <img src={'../src/Images/download.jpeg'}
                                    alt="copy"
                                    data-tip data-for="copyImage"
                                    style={styles.clipBoard} />
                            </CopyToClipboard>
                            <ReactTooltip id="copyImage" place="bottom">
                                <span>Copy</span>
                            </ReactTooltip>
                        </pre>
                    </div>
                )
            })
        }
        return (
            <div style={this.props.isTest ? styles.testOutputDiv : styles.outputDiv}>
                {output}
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
    outputDiv: {
        height: 400,
        overflowY: 'auto',
        marginTop: '2%',
        overflowX: 'hidden'
    },
    testOutputDiv: {
        height: 370,
        overflowY: 'auto',
        marginTop: '2%',
        overflowX: 'hidden'
    }
}

export default EtherTransaction;