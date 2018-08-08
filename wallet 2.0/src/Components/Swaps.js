import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    getAvailableTokens, getTokenBalance,
    getSentValue
} from '../Actions/swaps.actions';
import { getAccount } from '../Actions/receive.action';
import { Grid, Row, Col } from 'react-flexbox-grid';
import TransIcon from 'material-ui/svg-icons/action/swap-horiz';
import ReactTooltip from 'react-tooltip';
import Button from '@material-ui/core/Button';
import { getEthBalance, getSentBalance } from './../Actions/swaps.actions';
import { setLanguage, setComponent } from './../Actions/authentication.action';
import { swapsStyles as styles } from './../Assets/swaps.styles';
import TransactionScreen from './TransactionScreen';
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
        this.getCompareValue(this.state.selectedToken);

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
                let tokensList = this.props.getAvailableTokensRes.filter((token) => token.symbol !== 'SENT');
                self.setState({ tokens: tokensList })
                tokensList.map((token) => {
                    self.getUnitBalance(token);
                })
            })
    }


    getCompareValue = (symbol) => {
        let token = this.state.tokens.find(obj => obj.symbol === symbol);
        if (token) {
            let self = this;
            let value = 10 ** token.decimals;
            getSentValue(token.address, value, function (err, swapValue) {
                if (err) { }
                else {
                    self.setState({ currentSentValue: swapValue });
                }
            })
        }
    }

    getUserEthBalance() {
        let that = this;
        this.props.getEthBalance(this.state.local_address)
        .then(() => {
                that.setState({ ethBalance: this.props.getEthBalanceRes})
        })
    }

    getUserSentBalance() {
        let that = this;
        this.props.getSentBalance(this.state.local_address)
        .then(() => {
                that.setState({ sentBalance: this.props.getSentBalanceRes})
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
                                    <img src={'../src/Images/logo.svg'} alt="logo" style={{ width: 50, height: 50, margin: '1% 10%' }} />
                                </Col>
                                <Col xs={8}>
                                    <b>
                                        <p style={styles.otherBalanceBalc} data-tip data-for="sentsBal">
                                            {this.state.sentBalance && this.state.sentBalance !== 'Loading' ? 
                                            this.state.sentBalance.toFixed(8) : 'Loading'}
                                        </p>
                                    </b>
                                    <p style={{ color: 'grey', marginTop: -15, letterSpacing: 2, wordBreak: 'break-all' }}>Sentinel [SENT]</p>
                                </Col>
                                <ReactTooltip id="sentsBal" place="bottom">
                                    <span>{this.state.sentBalance && this.state.sentBalance !== 'Loading' ? 
                                    this.state.sentBalance.toFixed(8) : 'Loading'}</span>
                                </ReactTooltip>
                            </Row>
                        </div>
                    </Col>
                    {this.state.tokens.length !== 0 ?
                        this.state.tokens.map((token, index) =>
                            <Col xs={6}>
                                <div style={index % 2 == 0 ?
                                    token.name === 'PIVX' ? styles.tokenStyle1 : styles.tokenStyle
                                    : styles.tokenStyle2}>
                                    <Row>
                                        <Col xs={4}>
                                            <img src={token.logo_url ? token.logo_url : '../src/Images/default.png'} alt="logo" style={styles.otherBalanceLogo} />
                                        </Col>
                                        <Col xs={8}>
                                            {token.name !== 'PIVX' ?
                                                <b>
                                                    <p style={styles.otherBalanceBalc}>
                                                        {this.state.tokenBalances[token.symbol] ? this.state.tokenBalances[token.symbol] : 0}
                                                    </p>
                                                </b>
                                                : null}
                                            <p style={token.name !== 'PIVX' ? styles.otherBalanceText : styles.f_w_b}>{token.name} [{token.symbol}]</p>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        )
                        :
                        <div><br />
                            <p style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginTop: '35%' }}>
                                No Tokens Found
                                          </p>
                        </div>
                    }
                </Row>
                <div style={styles.convertERCDiv}>
                    <Button
                        fullWidth={true}
                        disabled={this.props.isTest || this.state.tokens.length === 0}
                        onClick={() => {
                            this.setState({ showTransScreen: true });
                            this.getCompareValue(this.state.selectedToken);
                        }}
                        buttonStyle={this.props.isTest || this.state.tokens.length === 0 ?
                            styles.disabledButtonStyle : styles.enabledButtonStyle}
                        style={styles.convertERCButton}
                    >{lang[language].ConvertERC}
                    </Button>
                </div>
                {this.state.showTransScreen ? <TransactionScreen /> : null}
            </div>
        )
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        setLanguage: setLanguage,
        setComponent: setComponent,
        getAvailableTokens: getAvailableTokens,
        getEthBalance: getEthBalance,
        getSentBalance: getSentBalance
    }, dispatch)
}

function mapStateToProps(state) {
    return {
        lang: state.setLanguage,
        setComponentResponse: state.setComponent,
        getAvailableTokensRes: state.getAvailableTokens,
        getEthBalanceRes: state.getSwapEthBalance,
        getSentBalanceRes: state.getSwapSentBalance
    }
}
export default connect(mapStateToProps, mapDispatchToActions)(Swaps);