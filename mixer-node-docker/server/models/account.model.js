let mongoose = require('mongoose');


let accountSchema = new mongoose.Schema({
  address: String,
  privateKey: String,
  generatedOn: Number,
  expiryOn: Number,
  isValid: Boolean
}, {
    strict: true,
    versionKey: false
  });

module.exports = {
  accountModel: mongoose.model('Account', accountSchema)
};
