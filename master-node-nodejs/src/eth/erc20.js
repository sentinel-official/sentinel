import Tx from 'ethereumjs-tx'
import { Eth_manager } from './eth'
import { MAIN_TOKENS, RINKEBY_TOKENS } from '../config/tokens';

class ERC20_Manager {
  constructor(net, name, address, abi) {
    this.net = net;
    this.address = address;
    this.contract = net.web3.eth.contract(abi).at(address);
  }
  getBalance(accountAddr, cb) {
    this.contract.balanceOf(accountAddr, (err, balance) => {
      if (err)
        cb({ 'code': 201, 'error': err });
      else
        cb(err, balance);
    });
  }
  transferAmount(toAddr, amount, privateKey, nonce, cb) {
    let rawTx = {
      nonce: nonce,
      gasPrice: this.net.web3.toHex(10*1e9),
      gasLimit: this.net.web3.toHex(500000),
      to: this.address,
      value: '0x0',
      data: this.contract.transfer.getData(toAddr, amount)
    };
    let tx = new Tx(rawTx);
    tx.sign(Buffer.from(privateKey, 'hex'));
    let serializedTx = tx.serialize();
    this.net.web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), (err, txHash) => {
      cb(err, txHash);
    });
  }
}



let erc20_manager = {
  'main': {},
  'rinkeby': {}
}

let mainKeys = Object.keys(MAIN_TOKENS);
let rinkebyKeys = Object.keys(RINKEBY_TOKENS);

for (let i = 0; i < mainKeys.length; i++) {
  let token = MAIN_TOKENS[mainKeys[i]]
  erc20_manager['main'][mainKeys[i]] = new ERC20_Manager(Eth_manager['main'], token['name'], token['address'], token['abi'])
}

for (let i = 0; i < rinkebyKeys.length; i++) {
  let token = RINKEBY_TOKENS[rinkebyKeys[i]]
  erc20_manager['rinkeby'][rinkebyKeys[i]] = new ERC20_Manager(Eth_manager['rinkeby'], token['name'], token['address'], token['abi'])
}

export const ERC20Manager = erc20_manager;