import React, { Component } from 'react';
import { Row, Col } from 'react-flexbox-grid';
import CopyToClipboard from 'react-copy-to-clipboard';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux';
import { tokenTransaction, ethTransaction, getGasCost } from './../Utils/Ethereum';
import { styles } from './../Assets/pivx.styles';
import Input from '@material-ui/core/Input';
import SimpleMenu from './SharedComponents/SimpleMenu';
import { withStyles } from '@material-ui/core/styles';
import { coinType, decimals, nodeAddress } from '../Constants/swix.constant';
import { swixRate, swix } from '../Actions/swix.details';
import { getPrivateKeyWithoutCallback } from '../Utils/Keystore';
import { transferAmount } from '../Actions/send.action';
import PositionedSnackbar from './SharedComponents/simpleSnackbar';
import { TX_SUCCESS } from '../Constants/sendcomponent.types';
const shell   = window.require('electron').shell;


const styles1 = theme => ({
	textStyle: {
		backgroundColor: '#d4dae2',
		height: 42,
		marginTop: 5
	},
	textStyleSwap: {
		backgroundColor: '#d4dae2',
		height: 42,
		marginTop: 12,
		marginBottom: '10px'
	},
	disabledButtonStyle: {
		backgroundColor: '#bdbdbd',
		height: 48,
		lineHeight: '48px',
	},
	enabledButtonStyle: {
		"&:hover": {
			backgroundColor: '#2f3245'
		},
		backgroundColor: '#2F3245',
		height: 48,
		lineHeight: '48px'
	},
	inputStyle1: { fontSize: 16, bottom: 11, paddingLeft: 10 },
	inputStyle2: { backgroundColor: '#d4dae2', height: 42, marginTop: 15, marginBottom: 10 },
	textInStyleLast: { height: 45, backgroundColor: '#d4dae2', paddingLeft: 10, marginTop: '3px' },
	textInStyle: { backgroundColor: '#d4dae2', height: 42, marginTop: 15, marginBottom: 10, paddingLeft: 10 },
	label: { marginTop: '-8px' }

});

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

let lang = require('./../Constants/language');
class Pivx extends Component {
	constructor(props) {
		super(props);
		this.state = {
			from: 'PIVX',
			to: 'ETH',
			isSwap: false,
			showAddress: false,
			pivxAddress: '',
			refundAddress: 'DAYcbVBhgzWeCQ4Bmmhw9xWDhGFFcsdbDb',
			isPivx: true,
			swapAmount: 0,
			address: this.props.local_address,
			isValidAddress: false,
			label: 'SWAP',
			open: false,
			snackMessage: '',
			checkTxStatus: 'https://rinkeby.etherscan.io/tx/',
			url: false,
			txHash: ''
		}
	}

	enableButton = () => {
		console.log('in enable')

		if (this.state.isPivx) {
			if (this.state.from !== '' && this.state.to !== '' && this.state.swapAmount !== '' && this.state.address !== '' && this.state.refundAddress !== '') {
				console.log('in enable make false')
				this.setState({ isSwap: true })
			} else {
				this.setState({ isSwap: false })
			}
		} else {
			if (this.state.from !== '' && this.state.to !== '' && this.state.swapAmount !== '' && this.state.address !== '' && this.state.password !== '') {
				console.log('in enable make false')
				this.setState({ isSwap: true })
			} else {
				this.setState({ isSwap: false })
			}
		}

	}

	callEnable = () => {
		setTimeout(() => {
			this.enableButton();
		}, 50);
	}
	setFromTo = (from, to) => {

		if (from === 'PIVX') {
			this.setState({ isPivx: true });
		} else {
			this.setState({ isPivx: false });
		}

		this.setState({
			from: from,
			to: to
		})

		this.callEnable();
	}

	componentWillUnmount() {
		this.props.swixRate(this.state.from, this.state.to, 0)
	}

	setRefundAddress = (event) => {
		let address = event.target.value
		if (this.state.isPivx) {
			let pivxRegex = new RegExp('D[a-km-zA-HJ-NP-z1-9]{25,34}');
			if (pivxRegex.test(address)) {
				this.setState({ refundAddress: address, isValidRefundAddress: true })
			} else {
				this.setState({ isValidRefundAddress: false })
			}
		} else {
			this.setState({ refundAddress: this.props.local_address })
		}
		this.callEnable();
	}

	getExpectedValue = (event) => {
		let { from, to } = this.state;
		let value = event.target.value;
		this.setState({ swapAmount: value });
		let myValue = decimals[from] * value;
		this.props.swixRate(from, to, myValue.noExponents());

		this.callEnable();
	}

	setAddress = (event) => {
		let address = event.target.value;
		let pivxRegex = new RegExp('D[a-km-zA-HJ-NP-z1-9]{25,34}');
		let ethRegex = new RegExp('0[xX][0-9a-fA-F]{40}$');
		if (pivxRegex.test(address) && coinType[this.state.to] === 'bitcoin') {
			this.setState({ address: address })
		} else if (ethRegex.test(address) && coinType[this.state.to] === 'ethereum') {
			this.setState({ address: address })
		} else {
			this.setState({ isValidAddress: false })
		}
		this.callEnable();
	}

	setPassword = (event) => {
		this.setState({ password: event.target.value });

		this.callEnable();
	}


	onClickSwap = () => {

		let self = this;

		this.setState({ label: 'SWAPING', isSwap: false })

		let data = {
			'destination_address': this.state.address,
			'from_symbol': this.state.from,
			'to_symbol': this.state.to,
			'delay_in_seconds': 60,
			'client_address': this.props.local_address,
			'node_address': nodeAddress,
			'refund_address': this.state.isPivx ? this.state.refundAddress : this.props.local_address
		}

		this.props.swix(data).then((response) => {
			
			if (coinType[this.state.from] === 'ethereum') {
				getPrivateKeyWithoutCallback(this.state.password, function (err, privateKey) {
					if (err) {
						console.log(err.message);
						self.setState({ label: 'SWAP', isSwap: false, open: true, snackMessage: err.message })
					} else {
						if (response.payload.success) {

							let address = response.payload.address;
							getGasCost(self.props.local_address, address, decimals[self.state.from] * self.state.swapAmount, self.state.token, function (gas) {
								let gwei = 20 * 1e9;
								if (self.state.token === 'ETH') {
									ethTransaction(self.props.local_address, address, decimals[self.state.from] * self.state.swapAmount, gwei, gas, privateKey, function (err, result) {
										if (err) {
											console.log('Error', err)
											self.setState({ label: 'SWAP', isSwap: false });
										} else {
											transferAmount(self.props.net ? 'rinkeby' : 'main', result).then((response) => {
												console.log(response)
												if (response.type === TX_SUCCESS) {
													self.setState({ label: 'SWAP', isSwap: false, address: '', swapAmount: '', password: '', open: true, snackMessage: 'Transaction Success.', url: true, txHash: response.payload });
												} else {
													self.setState({ label: 'SWAP', isSwap: false, address: '', swapAmount: '', password: '', open: true, snackMessage: 'Transaction Failure.' });
												}
											})
										}
									});
								} else {
									console.log('in else parent')
									tokenTransaction(self.props.local_address, address, decimals[self.state.from] * self.state.swapAmount, gwei, gas, privateKey, function (err, result) {
										console.log('in callback', err, result)
										if (err) {
											console.log('Error', err)
											self.setState({ label: 'SWAP', isSwap: false })
										} else {
											console.log('in else')
											transferAmount(self.props.net ? 'rinkeby' : 'main', result).then((response) => { console.log(response)
												if (response.type === TX_SUCCESS) {
													self.setState({ label: 'SWAP', isSwap: false, address: '', swapAmount: '', password: '', open: true, snackMessage: 'Transaction Success.', url: true, txHash: response.payload });
												} else {
													self.setState({ label: 'SWAP', isSwap: false, address: '', swapAmount: '', password: '', open: true, snackMessage: 'Transaction Failure.' });
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

			} else {
				if(response.payload.success)
				{
					this.setState({showAddress:true,pivxAddress:response.payload.address})
				} else {
					this.setState({showAddress:false,pivxAddress:''})
				}
			}
		});

	}

	render() {

		console.log('state', this.state)

		let { classes } = this.props;

		return <div>
			<div>
				<div>
					<div style={{ marginBottom: 10, display: 'inline-flex' }}>
						<span style={{ fontWeight: 'bold', color: '#253245', fontFamily: 'Montserrat,Medium', width: 260 }}>Swap on PIVX Tokens</span>
						<SimpleMenu isSend={false} setSwap={this.setFromTo} rate={() => {
							setTimeout(() => {
								if (coinType[this.state.from] === 'ethereum') {
									this.setState({ label: 'SWAP', isSwap: false })
								}
								let myValue = decimals[this.state.from] * this.state.swapAmount;
								this.props.swixRate(this.state.from, this.state.to, myValue)
							}, 50);
						}} />

					</div>
					<hr />
					<span style={{ fontWeight: 'bold', color: '#253245', fontFamily: 'Montserrat,Medium', width: 260, letterSpacing: '1px' }}>Total {this.state.from} tokens to be swapped</span>
					<Input
						type="number"
						disableUnderline={true} fullWidth={true}
						inputProps={{ style: styles.textInputStyle }}
						className={classes.textStyle}
						onChange={this.getExpectedValue}
						value={this.state.swapAmount}
					/>
					{this.state.isPivx ? <div style={{ marginTop: '10px' }}>
						<span style={{ fontWeight: 'bold', color: '#253245', fontFamily: 'Montserrat,Medium', width: 260, letterSpacing: '1px' }}>Enter {this.state.from} refund Address</span>
						<Input
							type="text"
							placeholder='Enter refund address'
							disableUnderline={true} fullWidth={true}
							inputProps={{ style: styles.textInputStyle }}
							className={classes.textStyle}
							onChange={this.setRefundAddress}
							value={this.state.refundAddress}
						/>
					</div> : <div></div>}
				</div>
				<div style={{ backgroundColor: '#4e5565', fontFamily: 'Poppins', marginTop: 10, marginBottom: 10 }}>
					<p style={{ fontSize: 16, color: 'white', padding: 10, letterSpacing: 1, textAlign: 'center' }}><span style={{ fontWeight: 'bold' }}>Expected {this.props.expectedValue.value === 0 ? this.props.expectedValue.value : Number(this.props.expectedValue.value / decimals[this.state.to]).toFixed(8)}</span>
						<span style={{ fontSize: 16, color: 'white', letterSpacing: 1 }}> {this.state.to} Tokens</span>
					</p>
				</div>
				{coinType[this.state.to] === 'ethereum' ? <div>
					<span style={styles.formHeading}>{this.state.to + ' Address'}</span>
					<Input
						type='text'
						placeholder="Example: 0x93186402811baa5b188a14122C11B41dA0099844"
						// hintStyle={{ bottom: 8, paddingLeft: 10, letterSpacing: 2 }}
						className={classes.textStyleSwap}
						disableUnderline={true} fullWidth={true}
						inputProps={{ style: styles.textInputStyle }}
						onChange={this.setAddress}
						value={this.state.address}
					/>
					<Button variant={'flat'}
						autoFocus={false}
						style={styles.buttonLabelStyle}
						disabled={!this.state.isSwap}
						fullWidth={true}
						onClick={this.onClickSwap}
						className={
							this.state.isSwap ?
								classes.enabledButtonStyle : classes.disabledButtonStyle
						}
						classes={{ label: classes.label }}
					>{this.state.label}</Button>
				</div> : <div>
						<span style={styles.formHeading}>PIVX Address</span>
						<Input
							placeholder="Enter pivx address"
							className={classes.textInStyle}
							disableUnderline={true} fullWidth={true}
							inputProps={{ style: styles.textInputStyle }}
							value={this.state.address}
							onChange={this.setAddress}
						/>
						<Row>
							<Col xs={6}>
								<Input
									type="password"
									placeholder="KEYSTORE PASSWORD"
									disableUnderline={true} fullWidth={true}
									inputProps={{ style: styles.textInputStyle }}
									className={classes.textInStyleLast}
									onChange={this.setPassword}
									value={this.state.password}
								/>
							</Col>
							<Col xs={6}>
								<Button variant={'flat'}
									autoFocus={false}
									disabled={!this.state.isSwap}
									onClick={this.onClickSwap}
									fullWidth={true}
									className={
										this.state.isSwap ?
											classes.enabledButtonStyle : classes.disabledButtonStyle
									}
									style={{ height: 45, color: 'white' }}
									classes={{ label: classes.label }}
								>{this.state.label}</Button>
							</Col>
						</Row>
					</div>}
			</div>
			{this.state.showAddress ?
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
				:
				<div>

				</div>
			}
			<PositionedSnackbar open={this.state.open} message={this.state.snackMessage} close={this.handleSnackClose} url={this.state.url} checkStatus={() => { this.openInExternalBrowser(`${this.state.checkTxStatus}${this.state.txHash}`) }} />
		</div>
	}
}

function mapStateToProps(state) {
	return {
		lang: state.setLanguage,
		getSentValueRes: state.getSentValue,
		local_address: state.getAccount,
		expectedValue: state.swixRateInState,
		net: state.setTestNet
	}
}

function mapDispatchToActions(dispatch) {
	return bindActionCreators({
		swixRate,
		swix
	}, dispatch)
}


export default withStyles(styles1)(connect(mapStateToProps, mapDispatchToActions)(Pivx));