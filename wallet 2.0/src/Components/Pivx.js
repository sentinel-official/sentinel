import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux';
import { tokenTransaction, swapPivx, ethTransaction } from './../Actions/pivx.action';
import { swapRawTransaction } from './../Actions/convertErc.action';
import { getPrivateKey } from './../Actions/authentication.action';
import { styles } from './../Assets/pivx.styles';
import Input from '@material-ui/core/Input';
import SimpleMenu from './SharedComponents/SimpleMenu';

let lang = require('./../Constants/language');
class Pivx extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddress: '',
            pivxOption: '',
            isFromPivx: '',
            pivxScreenAmount: '',
            isEthIn: '',
            isPivxDisabled: '',
            pivxScreenToAddr: '',
            isPivxSend: '',
            pivxScreenAmount: '',
            pivxSendAddr: '',
            pivxScreenPwd: '',
            from: 'PIVX',
            to: 'ETH'
        }
    }


    getPivxCompareValue = (from, to, value, decimals) => {
        let self = this;
        self.props.getSentValue('PIVX', 'SENT', value, 8)
            .then(() => {
                console.log(self.props.getSentValueRes)
                self.setState({ currentSentValue: self.props.getSentValueRes });
            })
    }

    pivxValueChange = (event, value) => {
        if (this.state.isFromPivx) {
            this.setState({ pivxScreenAmount: value, showAddress: false });
            if (value !== '') this.getPivxCompareValue('PIVX', this.state.isEthIn ? 'ETH' : 'SENT', value, this.state.isEthIn ? 18 : 8);
        } else {
            this.setState({ pivxScreenAmount: value, showAddress: false });
            if (value !== '') {
                if (this.state.isEthIn) {
                    value = (value * (10 ** 18)).noExponents();
                    console.log("Value....", value)
                    this.getPivxCompareValue('ETH', 'PIVX', value, 0);
                }
                else {
                    value = (value * (10 ** 8)).noExponents();
                    this.getPivxCompareValue('SENT', 'PIVX', value, 0);
                }
            };
        }
    }

    pivxAddressChange = (event, to_addr) => {
        if (this.state.isFromPivx) {
            this.setState({ pivxScreenToAddr: to_addr })
            let trueAddress = to_addr.match(/^0x[a-zA-Z0-9]{40}$/)
            if (trueAddress !== null) {
                this.setState({ isPivxDisabled: false })
            }
            else {
                this.setState({ isPivxDisabled: true })
            }
        }
        else {
            this.setState({ pivxScreenToAddr: to_addr })
        }
    }
    handlePivxMenuChange = (event, index, value) => {
        if (value === 1 || value === 2)
            this.setState({
                pivxOption: value, isFromPivx: true, isEthIn: value === 2, isPivxSend: false,
                pivxScreenToAddr: '', pivxScreenAmount: 0, pivxScreenExpctd: 0, isPivxDisabled: true
            });
        else
            this.setState({
                pivxOption: value, isFromPivx: false, isEthIn: value === 4, isPivxSend: false,
                pivxScreenToAddr: '', pivxScreenAmount: 0, pivxScreenExpctd: 0, isPivxDisabled: true
            });
    }

    onClickPivxConvert = () => {
        let self = this;
        let to = this.state.isEthIn ? 'ETH' : 'SENT';
        this.setState({ isPivxSend: true })
        swapPivx(this.state.pivxScreenToAddr, 'PIVX', to, function (err, address) {
            if (err) { isPivxSend: false }
            else {
                self.setState({
                    pivxSendAddr: address, showAddress: true, isPivxSend: false,
                    pivxScreenToAddr: self.props.local_address, pivxScreenExpctd: 0, isPivxDisabled: false
                });
            }
        })
    }
    onClickPivxTrans = () => {
        let self = this;
        if (this.state.pivxScreenPwd === '') {
            this.setState({ snackOpen: true, snackMessage: lang[this.props.lang].PasswordEmpty })
        }
        else {
            this.setState({ isPivxSend: true });
            setTimeout(function () {
                getPrivateKey(self.state.pivxScreenPwd, self.props.lang, function (err, privateKey) {
                    if (err) {
                        self.setState({
                            snackOpen: true,
                            snackMessage: err.message,
                            isPivxSend: false
                        })
                    }
                    else {
                        let from_addr = self.props.local_address;
                        let amount = self.state.pivxScreenAmount;
                        let gas_price = 20 * (10 ** 9)
                        let ether_address = (self.state.tokens.find(o => o.symbol === 'ETH'))['address'];
                        if (self.state.isEthIn) {
                            ethTransaction(from_addr, ether_address, amount, gas_price, 100000, privateKey, true, function (data) {
                                swapRawTransaction(data, self.state.pivxScreenToAddr, 'ETH', 'PIVX', function (err, txHash) {
                                    if (err) {
                                        self.setState({
                                            snackOpen: true,
                                            snackMessage: err.message,
                                            isPivxSend: false
                                        })
                                    }
                                    else {
                                        self.props.getCurrentSwapHash(txHash);
                                        self.setState({
                                            pivxScreenPwd: '',
                                            openSnack: true,
                                            tx_addr: txHash,
                                            isPivxSend: false
                                        })
                                    }
                                })
                            })
                        }
                        else {
                            tokenTransaction(from_addr, ether_address, amount * (10 ** 8), gas_price, 100000, privateKey, function (data) {
                                swapRawTransaction(data, self.state.pivxScreenToAddr, 'SENT', 'PIVX', function (err, txHash) {
                                    if (err) {
                                        self.setState({
                                            snackOpen: true,
                                            snackMessage: err.message,
                                            isPivxSend: false
                                        })
                                    }
                                    else {
                                        self.props.getCurrentSwapHash(txHash);
                                        self.setState({
                                            pivxScreenPwd: '',
                                            openSnack: true,
                                            tx_addr: txHash,
                                            isPivxSend: false
                                        })
                                    }
                                })
                            })
                        }
                    }
                })
            }, 500);
        }
    }
    setFromTo = (from, to) => {
        this.setState({
            from: from,
            to: to
        })
    }


    render() {

        return <div>
            <div style={{ marginBottom: 10, display: this.state.showAddress ? 'none' : 'inline' }}>
                <div>
                    <div style={{ marginBottom: 10, display: 'inline-flex' }}>
                        <span style={{ fontWeight: 'bold', color: '#253245', fontFamily: 'Montserrat,Medium', width: 260 }}>Swap on PIVX Tokens</span>
                        <SimpleMenu isSend={false} setSwap={this.setFromTo} />
                        <hr />
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#253245', fontFamily: 'Montserrat,Medium', width: 260, letterSpacing: '1px' }}>To {this.state.from} tokens to be swapped</span>
                </div>
                <hr />
            </div>
            {this.state.isFromPivx ?
                (!this.state.showAddress ?
                    <div>
                        <span style={styles.formHeading}>Total PIVX Tokens to be swapped</span>
                        <Input
                            type="number"
                            underline={false} fullWidth={true}
                            inputStyle={styles.textInputStyle}
                            style={styles.textStyle}
                            onChange={this.pivxValueChange.bind(this)}
                            value={this.state.pivxScreenAmount}
                            underlineShow={false} fullWidth={true}
                        />
                        <div style={{ backgroundColor: '#4e5565', fontFamily: 'Poppins', marginTop: 10, marginBottom: 10 }}>
                            <p style={{ fontSize: 16, color: 'white', padding: 10, letterSpacing: 1, textAlign: 'center' }}><span style={{ fontWeight: 'bold' }}>Expected {this.state.pivxScreenExpctd}</span>
                                <span style={{ fontSize: 16, color: 'white', letterSpacing: 1 }}>{this.state.isEthIn ? ' ETH TOKENS' : ' SENT TOKENS'}</span>
                            </p>
                        </div>
                        <span style={styles.formHeading}>{this.state.isEthIn ? 'ETH Address' : 'SENT Address'}</span>
                        <Input
                            hintText="Example: 0x93186402811baa5b188a14122C11B41dA0099844"
                            hintStyle={{ bottom: 8, paddingLeft: 10, letterSpacing: 2 }}
                            style={styles.textStyleSwap}
                            underline={false} fullWidth={true}
                            onChange={this.pivxAddressChange.bind(this)}
                            value={this.state.pivxScreenToAddr}
                            inputStyle={styles.textInputStyle}
                        />
                        <Button variant={'contained'}
                            disabled={this.state.pivxScreenToAddr === '' || this.state.isPivxDisabled || this.state.isPivxSend ? true : false}
                            onClick={this.onClickPivxConvert.bind(this)}
                            labelStyle={styles.buttonLabelStyle}
                            fullWidth={true}
                            buttonStyle={
                                this.state.pivxScreenToAddr === '' || this.state.isPivxDisabled || this.state.isPivxSend ?
                                    styles.disabledButtonStyle : styles.enabledButtonStyle
                            }
                            style={{ height: 48 }}
                        >{this.state.isPivxSend ? 'Swapping' : 'Swap'}</Button>
                    </div>
                    :
                    <span style={{ fontWeight: 'bold' }}>Send {this.state.pivxScreenAmount} PIVX Tokens to <span style={{ color: 'green' }}>{this.state.pivxSendAddr}</span>
                        <CopyToClipboard text={this.state.pivxSendAddr}
                            onCopy={() => this.setState({
                                snackMessage: 'Copied to Clipboard Successfully',
                                snackOpen: true
                            })} >
                            <img
                                src={'../src/Images/download.jpeg'}
                                data-tip data-for="copyImage"
                                style={{
                                    height: 18,
                                    width: 18,
                                    cursor: 'pointer'
                                }}
                            />
                        </CopyToClipboard>
                        <ReactTooltip id="copyImage" place="bottom">
                            <span>Copy</span>
                        </ReactTooltip>
                    </span>
                ) :
                <div>
                    <span style={styles.formHeading}>{this.state.isEthIn ? 'Total ETH Tokens to be swapped' : 'Total SENT Tokens to be swapped'}</span>
                    <Input
                        type="number"
                        underline={false} fullWidth={true}
                        inputStyle={styles.textInputStyle}
                        style={styles.textStyle}
                        onChange={this.pivxValueChange.bind(this)}
                        value={this.state.pivxScreenAmount}
                        underlineShow={false} fullWidth={true}
                    />
                    <div style={{ backgroundColor: '#4e5565', fontFamily: 'Poppins', marginTop: 10, marginBottom: 10 }}>
                        <p style={{ fontSize: 16, color: 'white', padding: 10, letterSpacing: 1, textAlign: 'center' }}><span style={{ fontWeight: 'bold' }}>Expected {this.state.pivxScreenExpctd}</span>
                            <span style={{ fontSize: 16, color: 'white', letterSpacing: 1 }}> PIVX TOKENS</span>
                        </p>
                    </div>
                    <span style={styles.formHeading}>PIVX Address</span>
                    <Input
                        hintText="Enter pivx address"
                        hintStyle={{ bottom: 8, paddingLeft: 10, letterSpacing: 2 }}
                        style={styles.textInStyle}
                        underlineShow={false} fullWidth={true}
                        onChange={this.pivxAddressChange.bind(this)}
                        value={this.state.pivxScreenToAddr}
                        inputStyle={styles.textInputStyle}
                    />
                    <Row>
                        <Col xs={6}>
                            <Input
                                type="password"
                                hintText="KEYSTORE PASSWORD"
                                hintStyle={{ fontSize: 16, bottom: 11, paddingLeft: 10 }}
                                onChange={event => this.setState({ pivxScreenPwd: event.target.value })}
                                value={this.state.pivxScreenPwd}
                                underline={false} fullWidth={true}
                                inputStyle={styles.textInputStyle}
                                style={styles.textInStyleLast}
                            />
                        </Col>
                        <Col xs={6}>
                            <Button variant={'contained'}
                                disabled={this.state.pivxScreenToAddr === '' || this.state.isPivxSend ? true : false}
                                onClick={this.onClickPivxTrans.bind(this)}
                                labelStyle={styles.buttonLabelStyle}
                                fullWidth={true}
                                buttonStyle={
                                    this.state.pivxScreenToAddr === '' || this.state.isPivxSend ?
                                        styles.disabledButtonStyle : styles.enabledButtonStyle
                                }
                                style={{ height: 48 }}
                            >{this.state.isPivxSend ? 'Swapping' : 'Swap'}</Button>
                        </Col>
                    </Row>
                </div>
            }
        </div>
    }
}
function mapStateToProps(state) {
    return {
        getSentValueRes: state.getSentValue
    }
}
export default connect(mapStateToProps)(Pivx);