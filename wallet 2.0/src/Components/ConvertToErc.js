import React, { Component } from 'react';
import { TextField } from 'material-ui';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import RightArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { convertToErcStyles } from './../Assets/convertToErc.styles.js';
import { swixRate, swix } from '../Actions/swix.details';
import { getPrivateKeyWithoutCallback } from '../Utils/Keystore';
import { decimals, nodeAddress } from '../Constants/swix.constant';
import { transferAmount } from '../Actions/send.action';
import { tokenTransaction, ethTransaction, getGasCost } from './../Utils/Ethereum';
import PositionedSnackbar from './SharedComponents/simpleSnackbar';
import { TX_SUCCESS } from '../Constants/sendcomponent.types';
const shell = window.require('electron').shell;


let lang = require('./../Constants/language');

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

class ConvertToErc extends Component {
	constructor(props) {
		super(props);
		this.state = {
			swapAmount: 0,
			tokens: [],
			tokenBalances: {},
			convertPass: '',
			converting: false,
			open: false,
			snackMessage: '',
			checkTxStatus: 'https://rinkeby.etherscan.io/tx/',
			url: false,
			txHash: ''
		}
	}

	valueChange = (event, value) => {
		let { token } = this.props;
		this.setState({ swapAmount: value });
		let myValue = (10 ** token.decimals) * value
		this.props.swixRate(token.symbol, 'SENT', myValue.noExponents())
	}
	componentDidMount() {
		console.log('erc20 did mount', this.props.token)
	}

	componentWillUnmount() {
		this.props.swixRate(this.props.token.symbol, 'SENT', 0)
	}

	openInExternalBrowser(url) {
		console.log('in open external browser', url);
		shell.openExternal(url);
		this.setState({ txHash: '' });
	};

	handleSnackClose = () => {
		this.setState({ open: false, txHash: '', url: false });
	};


	onClickConvert = () => {
		let self = this;

		this.setState({ converting: true })

		let data = {
			'destination_address': this.props.local_address,
			'from_symbol': this.props.token.symbol,
			'to_symbol': 'SENT',
			'delay_in_seconds': 30,
			'client_address': this.props.local_address,
			'node_address': nodeAddress,
			'refund_address': this.props.local_address
		}

		this.props.swix(data).then((response) => {
			console.log('respsne', response)
			getPrivateKeyWithoutCallback(self.state.convertPass, function (err, privateKey) {
				if (err) {
					console.log('private key error', err.message);
					self.setState({ converting: false, open: true, snackMessage: err.message })
				} else {
					if (response.payload.success) {

						let address = response.payload.address;
						getGasCost(self.props.local_address, address, decimals[self.props.token.symbol] * self.state.swapAmount, self.state.token, function (gas) {
							let gwei = 20 * 1e9;
							if (self.props.token.symbol === 'ETH') {
								ethTransaction(self.props.local_address, address, decimals[self.props.token.symbol] * self.state.swapAmount, gwei, gas, privateKey, function (err, result) {
									if (err) {
										console.log('Error', err)
										self.setState({ converting: false });
									} else {
										transferAmount(self.props.net ? 'rinkeby' : 'main', result).then((response) => {
											console.log(response)
											if (response.type === TX_SUCCESS) {
												self.setState({ converting: false, swapAmount: '', convertPass: '', open: true, snackMessage: 'Transaction Success.', url: true, txHash: response.payload });
											} else {
												self.setState({ converting: false, swapAmount: '', convertPass: '', open: true, snackMessage: 'Transaction Failure.' });
											}
										})
									}
								});
							} else {
								console.log('in else parent')
								tokenTransaction(self.props.local_address, address, decimals[self.props.token.symbol] * self.state.swapAmount, gwei, gas, privateKey, function (err, result) {
									console.log('in callback', err, result)
									if (err) {
										console.log('Error', err)
										self.setState({ converting: false })
									} else {
										console.log('in else')
										transferAmount(self.props.net ? 'rinkeby' : 'main', result).then((response) => {
											console.log(response)
											if (response.type === TX_SUCCESS) {
												self.setState({ converting: false, swapAmount: '', convertPass: '', open: true, snackMessage: 'Transaction Success.', url: true, txHash: response.payload });
											} else {
												self.setState({ converting: false, swapAmount: '', convertPass: '', open: true, snackMessage: 'Transaction Failure.' });
											}
										})
									}
									//   }
								});
							}
						});
					} else {
						console.log('Error in fetching account');
					}
				}
			});
		});

	}


	render() {
		var language = this.props.lang;
		console.log('in render', this.props.expectedValue.value)
		return (
			<div>
				<div style={convertToErcStyles.b_f_f}>
					<p style={convertToErcStyles.heading}>{lang[language].ExchangeERC}</p>
				</div>
				<div style={convertToErcStyles.b_m_t}>
					<p style={convertToErcStyles.t_a_p_30}>
						<Row>
							<Col xsOffset={3} xs={1}>
								<img src={this.props.token.logo_url} alt="logo" style={convertToErcStyles.h_w_70} />
							</Col>
							<Col xsOffset={1} xs={1}>
								<RightArrow style={convertToErcStyles.h_w_f_70} />
							</Col>
							<Col xs={4}>
								<img src={'../src/Images/logo.svg'} alt="logo" style={convertToErcStyles.h_w_70} />
							</Col>
						</Row>
					</p>
				</div>
				<div style={convertToErcStyles.compareDiv}>
					<p style={convertToErcStyles.compareP}>{this.state.swapAmount} {this.props.token.symbol} = {this.props.expectedValue.value === 0 ? this.props.expectedValue.value : (this.props.expectedValue.value / Math.pow(10, 8)).toFixed(8)} SENT's</p>
				</div>
				<div style={convertToErcStyles.f_f_p}>
					<p style={convertToErcStyles.convertHead}>{lang[language].Convert}</p>
					<Row style={convertToErcStyles.w_m_t}>
						<Col xsOffset={2} xs={4}>
							<TextField
								type="number"
								underlineShow={false} fullWidth={true}
								inputStyle={convertToErcStyles.textInputStyle}
								style={convertToErcStyles.textField}
								underlineShow={false} fullWidth={true}
								onChange={this.valueChange.bind(this)}
								value={this.state.swapAmount}
							/>
						</Col>
						<Col xs={4}>
							<div align={'center'} style={convertToErcStyles.tokenSym}
							>{this.props.token.symbol}
							</div>
						</Col>
					</Row>
					<p style={convertToErcStyles.smallBal1}>
						{lang[language].SentTokens}: {this.state.tokenBalances[this.props.token.symbol]} {this.props.token.symbol}</p>
					<p style={convertToErcStyles.to}>{lang[language].To}</p>
					<Row style={convertToErcStyles.w_m_t}>
						<Col xsOffset={2} xs={8}>
							<div style={convertToErcStyles.b_p}>
								<p style={convertToErcStyles.bal}>
									<span style={convertToErcStyles.f_w}>
										{Number(this.props.expectedValue.value / Math.pow(10, 8)).toFixed(8)}
									</span>
									<span style={convertToErcStyles.sentTokens}> {lang[language].SentTokens}</span>
								</p>
							</div>
						</Col>
					</Row>
				</div>
				<div style={convertToErcStyles.b_c_p}>
					<Row>
						<Col xsOffset={1} xs={5}>
							<TextField
								type="password"
								hintText={lang[language].Password}
								hintStyle={convertToErcStyles.pwdHint}
								onChange={(event, password) => this.setState({ convertPass: password })}
								value={this.state.convertPass}
								underlineShow={false} fullWidth={true}
								inputStyle={convertToErcStyles.textInputStyle}
								style={convertToErcStyles.pwd}
							/>
						</Col>
						<Col xs={5}>
							<Button
								disabled={this.state.converting}
								onClick={this.onClickConvert}
								fullWidth={true}
								style={this.state.converting ?
									convertToErcStyles.b1 :
									convertToErcStyles.b2}
							>
								<span style={convertToErcStyles.labelStyle}
								>{this.state.converting ? lang[language].Converting : lang[language].Convert}</span>
							</Button>
						</Col>
					</Row>
				</div>
				<PositionedSnackbar open={this.state.open} message={this.state.snackMessage}
					language={this.props.lang} close={this.handleSnackClose} url={this.state.url}
					txUrl={`${this.state.checkTxStatus}${this.state.txHash}`}
					checkStatus={() => { this.openInExternalBrowser(`${this.state.checkTxStatus}${this.state.txHash}`) }} />
			</div>

		)
	}
}

function mapStateToProps(state) {
	return {
		lang: state.setLanguage,
		getSentValueRes: state.getSentValue,
		expectedValue: state.swixRateInState,
		local_address: state.getAccount
	}
}

function mapDispatchToActions(dispatch) {
	return bindActionCreators({
		swixRate,
		swix
	}, dispatch)
}


export default connect(mapStateToProps, mapDispatchToActions)(ConvertToErc);