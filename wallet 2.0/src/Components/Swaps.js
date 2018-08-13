import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    getAvailableTokens, getTokenBalance,
    getSentValue
} from '../Actions/swaps.action';
import { Dialog } from 'material-ui';
import { getAccount } from '../Actions/receive.action';
import { Row, Col } from 'react-flexbox-grid';
import ReactTooltip from 'react-tooltip';
import Button from '@material-ui/core/Button';
import { getETHBalance, getSentBalance } from '../Actions/header.action';
import { setLanguage, setComponent } from './../Actions/authentication.action';
import { swapsStyles as styles } from './../Assets/swaps.styles';
import ConvertToErc from './ConvertToErc';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Pivx from './Pivx';
let lang = require('./../Constants/language');

class Swaps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokens: [],
            balance: {},
            selectedToken: 'ETH',
            tokenBalances: {},
            currentSentValue: 1,
            isGetBalanceCalled: false,
            local_address: '',
            pivxTokenDetails: [],
            ethBalance: 'Loading',
            sentBalance: 'Loading',
        }
    }

    componentWillMount() {
        this.getTokensList()
    }

    vpnPayment = (sessionData) => {
        this.setState({
            to_addr: sessionData.account_addr,
            amount: sessionData.amount,
            unit: 'SENT',
            value: 'send',
            sessionId: sessionData.id,
            isPropReceive: true
        })
    }

    componentDidMount = () => {
        let that = this;

        getAccount((err, account_addr) => {
            if (err) { }
            else {
                that.setState({
                    local_address: account_addr
                })
            }
        });
    }

    getBalancesTokens = () => {
        let self = this;
        self.state.tokens.map((token) => {
            self.getUnitBalance(token);
        })
    }

    getUnitBalance = (token) => {
        if (token.symbol === 'ETH') {
            let obj = this.state.tokenBalances;
            obj[token.symbol] = this.state.ethBalance !== 'Loading' ? this.state.ethBalance ? this.state.ethBalance.toFixed(8) : 0 : 'Loading';
            this.setState({ tokenBalances: obj });
        }
        else {
            let self = this
            getTokenBalance(token.address, self.state.local_address, token.decimals, function (err, tokenBalance) {
                if (err) { }
                else {
                    let obj = self.state.tokenBalances;
                    obj[token.symbol] = tokenBalance;
                    self.setState({ tokenBalances: obj });
                }
            })
        }
    }

    getTokensList = () => {
        let self = this;
        this.props.getAvailableTokens()
            .then(() => {
                let tokensList = this.props.getAvailableTokensRes.filter(
                    (token) => token.symbol !== 'SENT' && token.symbol !== 'PIVX');
                let pivxToken = this.props.getAvailableTokensRes.filter((token) => token.symbol === 'PIVX');
                self.setState({ tokens: tokensList, pivxTokenDetails: pivxToken })
                tokensList.map((token) => {
                    self.getUnitBalance(token);
                })
            })
    }

    handleClose = () => {
        this.setState({ showTransScreen: false });
    };

    getUserEthBalance() {
        let that = this;
        that.props.getEthBalance(this.state.local_address, that.props.isTest)
            .then(() => {
                that.setState({ ethBalance: that.props.getEthBalanceRes })
            })
    }

    getUserSentBalance() {
        let that = this;
        that.props.getSentBalance(that.state.local_address, that.props.isTest)
            .then(() => {
                that.setState({ sentBalance: that.props.getSentBalanceRes })
            })
    }


    render() {
        let self = this;

        if (!this.state.isGetBalanceCalled) {
            setInterval(function () {
                self.getUserEthBalance();
                self.getUserSentBalance();
                self.getBalancesTokens();
            }, 2000);

            this.setState({
                balance: {
                    eths: this.state.ethBalance,
                    sents: this.state.sentBalance
                }, isGetBalanceCalled: true
            });
        }

        let language = this.props.lang;

        return (
            <div>
                <Row>
                    <Col xs={6}>
                        <div style={styles.tokenStyle2}>
                            <Row>
                                <Col xs={4}>
                                    <img src={'../src/Images/logo.svg'} alt="logo" style={styles.sentImg} />
                                </Col>
                                <Col xs={8}>
                                    <b>
                                        <p style={styles.otherBalanceBalc} data-tip data-for="sentsBal">
                                            {this.props.getSentBalanceRes && this.props.getSentBalanceRes !== 'Loading' ?
                                                this.props.getSentBalanceRes.toFixed(8) : 0}
                                        </p>
                                    </b>
                                    <p style={styles.sentinel}>Sentinel [SENT]</p>
                                </Col>
                                <ReactTooltip id="sentsBal" place="bottom">
                                    <span>{this.props.getSentBalanceRes && this.props.getSentBalanceRes !== 'Loading' ?
                                        this.props.getSentBalanceRes.toFixed(8) : 'Loading'}</span>
                                </ReactTooltip>
                            </Row>
                        </div>
                    </Col>
                    {this.state.tokens.length !== 0 ?
                        this.state.tokens.map((token, index) =>
                            <Col xs={6}>
                                <Row>
                                    <Button style={index % 2 == 0 ?
                                        styles.tokenStyle
                                        : styles.tokenStyle2}
                                        onClick={() => {
                                            this.setState({ showTransScreen: true, selectedToken: token });
                                        }}>
                                        <Col xs={4}>
                                            <img src={token.logo_url ? token.logo_url : '../src/Images/default.png'}
                                                alt="logo" style={styles.otherBalanceLogo} />
                                        </Col>
                                        <Col xs={8}>
                                            <b>
                                                <p style={styles.otherBalanceBalc}>
                                                    {this.state.tokenBalances[token.symbol] > 0 ?
                                                        this.state.tokenBalances[token.symbol] :
                                                        0}
                                                </p>
                                            </b>
                                            <p style={styles.otherBalanceText}>{token.name} [{token.symbol}]</p>
                                        </Col>
                                    </Button>
                                </Row>
                            </Col>
                        )
                        :
                        <div><br />
                            <p style={styles.no_tokens_msg}>
                                No Tokens Found
                                          </p>
                        </div>
                    }{this.state.pivxTokenDetails.length !== 0 ?
                        this.state.pivxTokenDetails.map((token) =>
                            <Col xs={6}>
                                <div style={styles.tokenStyle1}>
                                    <Row style={{
                                        cursor: this.props.isTest ?
                                            'not-allowed' :
                                            'pointer', backgroundColor: '#badee4', paddingTop: 5
                                    }}
                                        onClick={() => {
                                            if (!this.props.isTest)
                                                this.setState({
                                                    showTransPivxScreen: true,
                                                    showAddress: false,
                                                    isPivxSend: false
                                                });
                                        }}>
                                        <Col xs={4}>
                                            <img src={token.logo_url ? token.logo_url : '../src/Images/default.png'}
                                                alt="logo" style={styles.otherBalanceLogo} />
                                        </Col>
                                        <Col xs={8}>
                                            <p style={styles.f_w_b}>{token.name} [{token.symbol}]</p>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        )
                        : null}
                </Row>
                {this.state.showTransScreen ? <MuiThemeProvider>
                    <Dialog
                        contentStyle={{ width: 700 }}
                        bodyStyle={{ padding: 0 }}
                        open={this.state.showTransScreen}
                        onRequestClose={this.handleClose}
                    >
                        <ConvertToErc token={this.state.selectedToken} />
                    </Dialog></MuiThemeProvider> : null}
                {this.state.showTransPivxScreen ? <MuiThemeProvider>
                    < Dialog
                        contentStyle={{ width: 700 }}
                        bodyStyle={{ padding: '5%' }}
                        open={this.state.showTransPivxScreen}
                        onRequestClose={this.handleTransClose}
                    >
                        <Pivx />
                    </Dialog></MuiThemeProvider> : null}
            </div>
        )
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setLanguage: setLanguage,
        setComponent: setComponent,
        getAvailableTokens: getAvailableTokens,
        getEthBalance: getETHBalance,
        getSentBalance: getSentBalance,
        getSentValue: getSentValue
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        setComponentResponse: state.setComponent,
        getAvailableTokensRes: state.getAvailableTokens,
        getEthBalanceRes: state.getEthBalance,
        getSentBalanceRes: state.getSentBalance,
        isTest: state.setTestNet,
        getSentValueRes: state.getSentValue
    }
}
export default connect(mapStateToProps, mapDispatchToActions)(Swaps);