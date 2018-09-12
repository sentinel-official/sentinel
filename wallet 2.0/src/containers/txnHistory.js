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
let zfill = require('zfill');

class TxnHistory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isActive: false,
        }
    }

    componentWillMount = () => {
        this.testSentHistory();
    }

    testSentHistory = () => {
        this.setState({ isActive: false });
        let data = {
            account_addr: '0x' + zfill(this.props.getAccount.substring(2), 64),
            isTest: this.props.setTestNet
        };
        this.props.testSENTTxns(data)
        // .then(res => { console.log('res', res) })
        // .catch(err => { console.log('err', err) });

    };

    testEthHistory = () => {
        this.setState({ isActive: true });

        let data = {
            account_addr: this.props.getAccount,
            isTest: this.props.setTestNet
        };
        this.props.testETHTxns(data)
        // .then(res => { console.log('res', res) })
        // .catch(err => { console.log('err', err) });
    };

    onClickRefresh = () => {
        if (this.state.isActive)
            this.testEthHistory();
        else
            this.testSentHistory();
    }

    render() {
        let output;
        let { language } = this.props;
        if (this.state.isActive) {
            if (this.props.testETHHistory && this.props.testETHHistory.result.length > 0) {
                output = this.props.testETHHistory.result.map(data => {
                    // console.log(data, 'see this');
                    return (
                        <div style={historyStyles.data}>
                            <History ownWallet={this.props.getAccount} date={data.timeStamp} to={data.to}
                                gas={parseInt(data.gasPrice) / (10 ** 9)} from={data.from} unit={'ETHS'}
                                amount={parseInt(data.value) / (10 ** 18)} status={'Success'} tx={data.hash} />
                        </div>
                    )
                })
            } else {
                output = <div style={historyStyles.noTxYet}>No Transactions yet</div>
            }
        }
        if (!this.state.isActive) {
            if (this.props.testSENTHistory && this.props.testSENTHistory.result.length > 0) {
                output = this.props.testSENTHistory.result.map(sentData => {
                    return (
                        <div style={historyStyles.data}>
                            <History ownWallet={this.props.getAccount} date={sentData.timeStamp} unit={'SENTS'}
                                to={`0x${sentData.topics[2].substring(26)}`} from={`0x${sentData.topics[1].substring(26)}`}
                                gas={parseInt(sentData.gasPrice) / (10 ** 9)} amount={(parseInt(sentData.data) / (10 ** 9)).toFixed(3)}
                                status={'Success'} tx={sentData.transactionHash} />
                        </div>
                    )
                })
            } else {
                output = <div historyStyles={historyStyles.noTxYet}>No Transactions yet</div>
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
                                aria-label="Refresh"
                                onClick={this.onClickRefresh}>
                                <RefreshIcon style={historyStyles.outlineNone} />
                            </IconButton>
                        </div>
                        <div style={historyStyles.margin}>
                            <CustomButton color={'#FFFFFF'} label={'SENT'} active={this.state.isActive}
                                onClick={this.testSentHistory} />
                        </div>
                        <div style={historyStyles.margin}>
                            <CustomButton color={'#F2F2F2'} label={'ETH'} active={!this.state.isActive}
                                onClick={this.testEthHistory} />
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