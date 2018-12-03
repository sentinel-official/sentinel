import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, IconButton } from '@material-ui/core'
import RefreshIcon from '@material-ui/icons/Refresh'
import { bindActionCreators } from 'redux';
import { testSENTTxns, testETHTxns } from '../Actions/getHistoryAction'
import { label, buttonStyle, disabledButton } from '../Assets/commonStyles'
import History from "../Components/historyComponent";
import CustomButton from '../Components/customButton';
import { historyStyles } from '../Assets/txhistory.styles';
import lang from '../Constants/language';
import _ from 'lodash';
let zfill = require('zfill');

Number.prototype.noExponents = function () {
    var data = String(this).split(/[eE]/);
    if (data.length == 1) return data[0];

    var z = '', sign = this < 0 ? '-' : '',
        str = data[0].replace('.', ''),
        mag = Number(data[1]) + 1;

    if (mag < 0) {
        z = sign + '0.';
        while (mag++) z += '0';
        return z + str.replace(/^\-/, '');
    }
    mag -= str.length;
    while (mag--) z += '0';
    return str + z;
}

class TxnHistory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isActive: false,
            loading: true
        }
    }

    componentWillMount = () => {
        this.onClickRefresh(this.props.setTestNet);
    }

    testSentHistory = (isTest) => {
        this.setState({ isActive: false, loading: true });
        let data = {
            account_addr: '0x' + zfill(this.props.getAccount.substring(2), 64),
            isTest: isTest
        };
        this.props.testSENTTxns(data)
            .then(res => { this.setState({ loading: false }) })
        // .catch(err => { console.log('err', err) });

    };

    testEthHistory = (isTest) => {
        this.setState({ isActive: true, loading: true });

        let data = {
            account_addr: this.props.getAccount,
            isTest: isTest
        };
        this.props.testETHTxns(data)
            .then(res => { this.setState({ loading: false }) })
        // .then(res => { console.log('res', res) })
        // .catch(err => { console.log('err', err) });
    };

    onClickRefresh = (isTest) => {
        if (this.state.isActive)
            this.testEthHistory(isTest);
        else
            this.testSentHistory(isTest);
    }

    componentWillReceiveProps = (next) => {
        if (this.props.setTestNet != next.setTestNet) {
            this.onClickRefresh(next.setTestNet)
        }
    }

    render() {
        let output;
        let { language } = this.props;
        let isTest = this.props.setTestNet;
        if (this.state.loading) {
            output = <div style={historyStyles.noTxYet}>{lang[language].Loading}</div>
        }
        else if (this.state.isActive) {
            if (this.props.testETHHistory && this.props.testETHHistory.result.length > 0) {
                output = this.props.testETHHistory.result.map(data => {
                    // console.log(data, 'see this');
                    return (
                        <div style={historyStyles.data}>
                            <History ownWallet={this.props.getAccount} date={data.timeStamp} to={data.to}
                                gas={`${parseInt(data.gasPrice) / (10 ** 9) + lang[language].GWEI}`} from={data.from} unit={isTest ? lang[language].TestETHunit : lang[language].Eth}
                                amount={parseFloat(parseInt(data.value) / (10 ** 18).toFixed(8)).noExponents()} status={data.isError === '1' ? 'Failed' : 'Success'} tx={data.hash} />
                        </div>
                    )
                })
            } else {
                output = <div style={historyStyles.noTxYet}>{lang[language].NoEthTx}</div>
            }
        }
        else {
            if (this.props.testSENTHistory && this.props.testSENTHistory.result.length > 0) {
                let sentHistory = _.sortBy(this.props.testSENTHistory.result, o => o.timeStamp).reverse()
                output = sentHistory.map(sentData => {
                    return (
                        <div style={historyStyles.data}>
                            <History ownWallet={this.props.getAccount} date={sentData.timeStamp} unit={isTest ? lang[language].TestSENTunit : lang[language].Sent}
                                to={`0x${sentData.topics[2].substring(26)}`} from={`0x${sentData.topics[1].substring(26)}`}
                                gas={`${parseInt(sentData.gasPrice) / (10 ** 9) + lang[language].GWEI}`}
                                amount={parseFloat((parseInt(sentData.data) / (10 ** 8)).toFixed(8)).noExponents()}
                                status={'Success'} tx={sentData.transactionHash} />
                        </div>
                    )
                })
            } else {
                output = <div style={historyStyles.noTxYet}>{lang[language].NoSentTx}</div>
            }
        }
        return (
            <div style={historyStyles.wholeDiv} >
                <div style={historyStyles.secondDiv} >
                    <div>
                        <label style={label} >{!this.state.isActive ?
                            lang[language].SentTransactions : lang[language].EthTransactions}</label>
                    </div>
                    <div style={historyStyles.flex}>
                        <div style={historyStyles.margin}>
                            <IconButton
                                style={historyStyles.outlineNone}
                                aria-label={lang[language].Refresh}
                                onClick={() => { this.onClickRefresh(isTest) }}>
                                <RefreshIcon style={historyStyles.outlineNone} />
                            </IconButton>
                        </div>
                        <div style={historyStyles.margin}>
                            <CustomButton color={'#FFFFFF'} label={isTest ? lang[language].TestSENTunit : lang[language].Sent} active={this.state.isActive}
                                onClick={() => { this.testSentHistory(isTest) }} />
                        </div>
                        <div style={historyStyles.margin}>
                            <CustomButton color={'#F2F2F2'} label={isTest ? lang[language].TestETHunit : lang[language].Eth} active={!this.state.isActive}
                                onClick={() => { this.testEthHistory(isTest) }} />
                        </div>
                    </div>
                </div>
                <div style={historyStyles.historyContainer} >
                    {output}
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {

    return bindActionCreators({ testSENTTxns, testETHTxns }, dispatch)
};

const mapStateToProps = ({ testSENTHistory, testETHHistory, getAccount, setTestNet, setLanguage }) => {

    return { testSENTHistory, testETHHistory, getAccount, setTestNet, language: setLanguage }
};

export default connect(mapStateToProps, mapDispatchToProps)(TxnHistory);