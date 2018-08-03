let { randomBytes } = require('crypto');
let keccak = require('keccak');
let { publicKeyCreate,
  publicKeyConvert } = require('secp256k1');


let generatePrivateKey = () => {
  return randomBytes(32);
};

let generatePublicKey = (privateKey, compressed) => {
  if (privateKey &&
    Buffer.isBuffer(privateKey) &&
    privateKey.length === 32) {
    return publicKeyCreate(privateKey, compressed);
  }
  return null;
};

let generateAddress = (publicKey) => {
  if (publicKey &&
    Buffer.isBuffer(publicKey) &&
    (publicKey.length === 33 || publicKey.length === 65)) {
    publicKey = publicKey.slice(1);
    return keccak('keccak256').update(publicKey).digest().slice(-20);
  }
  return null;
};

let convertPublicKey = (publicKey, compressed) => {
  if (publicKey &&
    Buffer.isBuffer(publicKey) &&
    (publicKey.length === 33 || publicKey.length === 65)) {
    return publicKeyConvert(publicKey, compressed);
  }
  return null;
};

module.exports = {
  convertPublicKey,
  generateAddress,
  generatePrivateKey,
  generatePublicKey
};