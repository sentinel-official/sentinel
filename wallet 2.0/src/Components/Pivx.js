import React, { Component } from 'react';
import { Input, Button } from '@material-ui/core';
import { Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { tokenTransaction, swapPivx, ethTransaction } from './../Actions/pivx.action';
import { swapRawTransaction } from './../Actions/convertErc.action';
import { getPrivateKey } from './../Actions/authentication.action';
import { styles } from './../Assets/pivx.styles';
import { swixRate } from './../Actions/swix.details';
import { withStyles } from '@material-ui/core/styles';
import SimpleMenu from './SharedComponents/SimpleMenu';
import { coinType } from '../Constants/swix.constant';
import { Input } from '@material-ui/core/Input';


const styles1 = theme => ({
    textStyle: {
        backgroundColor: '#d4dae2',
        height: 42,
        marginTop: 12
    },
    disabledButtonStyle: {
        backgroundColor: '#bdbdbd',
        height: 48,
        lineHeight: '48px',
        cursor: 'not-allowed'
    },
    enabledButtonStyle: {
        backgroundColor: '#595d8f',
        height: 48,
        lineHeight: '48px'
    },
    inputStyle1: { fontSize: 16, bottom: 11, paddingLeft: 10 },
    inputStyle2: { backgroundColor: '#d4dae2', height: 42, marginTop: 15, marginBottom: 10 }
});


let lang = require('./../Constants/language');
class Pivx extends Component {
    constructor(props) {
        super(props);
        this.state = {
            from:'PIVX',
            to:'ETH'
        }
    }

    setFromTo = (from,to)=>{
        this.setState({
            from:from,
            to:to
        })
    }


    render() {
        let { classes } = this.props;
        return <div>
            <div style={{ marginBottom: 10, display: 'inline-flex' }}>
                <span style={{ fontWeight: 'bold', color: '#253245', fontFamily: 'Montserrat,Medium', width: 260 }}>Swap on PIVX Tokens</span>
                <SimpleMenu isSend={false} setSwap={this.setFromTo} />
                <hr/>
            </div>
            <span style={{ fontWeight: 'bold', color: '#253245', fontFamily: 'Montserrat,Medium', width: 260, letterSpacing:'1px' }}>To {this.state.from} tokens to be swapped</span>
        </div>
    }
}
function mapStateToProps(state) {
    return {
        getSentValueRes: state.getSentValue,
        expectedValue: state.swixRateInState
    }
}

function mapDispatchToActions(dispatch) {
    return bindActionCreators({
        swixRate
    }, dispatch)
}

export default withStyles(styles1)(connect(mapStateToProps, mapDispatchToActions)(Pivx));


// getPivxCompareValue = (from, to, value, decimals) => {
    //     let self = this;
    //     self.props.getSentValue('PIVX', 'SENT', value, 8)
    //         .then(() => {
    //             console.log(self.props.getSentValueRes)
    //             self.setState({ currentSentValue: self.props.getSentValueRes });
    //         })
    // }

    // pivxValueChange = (event, value) => {
    //     if (this.state.isFromPivx) {
    //         this.setState({ pivxScreenAmount: value, showAddress: false });
    //         if (value !== '') this.getPivxCompareValue('PIVX', this.state.isEthIn ? 'ETH' : 'SENT', value, this.state.isEthIn ? 18 : 8);
    //     } else {
    //         this.setState({ pivxScreenAmount: value, showAddress: false });
    //         if (value !== '') {
    //             if (this.state.isEthIn) {
    //                 value = (value * (10 ** 18)).noExponents();
    //                 console.log("Value....", value)
    //                 this.getPivxCompareValue('ETH', 'PIVX', value, 0);
    //             }
    //             else {
    //                 value = (value * (10 ** 8)).noExponents();
    //                 this.getPivxCompareValue('SENT', 'PIVX', value, 0);
    //             }
    //         };
    //     }
    // }

    // pivxAddressChange = (event, to_addr) => {
    //     if (this.state.isFromPivx) {
    //         this.setState({ pivxScreenToAddr: to_addr })
    //         let trueAddress = to_addr.match(/^0x[a-zA-Z0-9]{40}$/)
    //         if (trueAddress !== null) {
    //             this.setState({ isPivxDisabled: false })
    //         }
    //         else {
    //             this.setState({ isPivxDisabled: true })
    //         }
    //     }
    //     else {
    //         this.setState({ pivxScreenToAddr: to_addr })
    //     }
    // }
    // handlePivxMenuChange = (event, index, value) => {
    //     if (value === 1 || value === 2) {
    //         this.setState({
    //             pivxOption: value, isFromPivx: true, isEthIn: value === 2, isPivxSend: false,
    //             pivxScreenToAddr: '', pivxScreenAmount: 0, pivxScreenExpctd: 0, isPivxDisabled: true
    //         });
    //     } else {
    //         this.setState({
    //             pivxOption: value, isFromPivx: false, isEthIn: value === 4, isPivxSend: false,
    //             pivxScreenToAddr: '', pivxScreenAmount: 0, pivxScreenExpctd: 0, isPivxDisabled: true
    //         });
    //     }
    // }

    // onClickPivxConvert = () => {
    //     let self = this;
    //     let to = this.state.isEthIn ? 'ETH' : 'SENT';
    //     this.setState({ isPivxSend: true })
    //     swapPivx(this.state.pivxScreenToAddr, 'PIVX', to, function (err, address) {
    //         if (err) { isPivxSend: false }
    //         else {
    //             self.setState({
    //                 pivxSendAddr: address, showAddress: true, isPivxSend: false,
    //                 pivxScreenToAddr: self.props.local_address, pivxScreenExpctd: 0, isPivxDisabled: false
    //             });
    //         }
    //     })
    // }
    // onClickPivxTrans = () => {
    //     let self = this;
    //     if (this.state.pivxScreenPwd === '') {
    //         this.setState({ snackOpen: true, snackMessage: lang[this.props.lang].PasswordEmpty })
    //     }
    //     else {
    //         this.setState({ isPivxSend: true });
    //         setTimeout(function () {
    //             getPrivateKey(self.state.pivxScreenPwd, self.props.lang, function (err, privateKey) {
    //                 if (err) {
    //                     self.setState({
    //                         snackOpen: true,
    //                         snackMessage: err.message,
    //                         isPivxSend: false
    //                     })
    //                 }
    //                 else {
    //                     let from_addr = self.props.local_address;
    //                     let amount = self.state.pivxScreenAmount;
    //                     let gas_price = 20 * (10 ** 9)
    //                     let ether_address = (self.state.tokens.find(o => o.symbol === 'ETH'))['address'];
    //                     if (self.state.isEthIn) {
    //                         ethTransaction(from_addr, ether_address, amount, gas_price, 100000, privateKey, true, function (data) {
    //                             swapRawTransaction(data, self.state.pivxScreenToAddr, 'ETH', 'PIVX', function (err, txHash) {
    //                                 if (err) {
    //                                     self.setState({
    //                                         snackOpen: true,
    //                                         snackMessage: err.message,
    //                                         isPivxSend: false
    //                                     })
    //                                 }
    //                                 else {
    //                                     self.props.getCurrentSwapHash(txHash);
    //                                     self.setState({
    //                                         pivxScreenPwd: '',
    //                                         openSnack: true,
    //                                         tx_addr: txHash,
    //                                         isPivxSend: false
    //                                     })
    //                                 }
    //                             })
    //                         })
    //                     }
    //                     else {
    //                         tokenTransaction(from_addr, ether_address, amount * (10 ** 8), gas_price, 100000, privateKey, function (data) {
    //                             swapRawTransaction(data, self.state.pivxScreenToAddr, 'SENT', 'PIVX', function (err, txHash) {
    //                                 if (err) {
    //                                     self.setState({
    //                                         snackOpen: true,
    //                                         snackMessage: err.message,
    //                                         isPivxSend: false
    //                                     })
    //                                 }
    //                                 else {
    //                                     self.props.getCurrentSwapHash(txHash);
    //                                     self.setState({
    //                                         pivxScreenPwd: '',
    //                                         openSnack: true,
    //                                         tx_addr: txHash,
    //                                         isPivxSend: false
    //                                     })
    //                                 }
    //                             })
    //                         })
    //                     }
    //                 }
    //             })
    //         }, 500);
    //     }
    // }
