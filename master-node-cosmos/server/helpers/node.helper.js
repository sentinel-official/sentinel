let cosmos = require('../../cosmos');


let generateToken = () => {
  let ALPHA_NUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  let token = '';
  for (let i = 0; i < 16; ++i)
    token += ALPHA_NUM.charAt(Math.floor(Math.random() * ALPHA_NUM.length));
  return token;
};

let getNodeDetails = (txHash, cb) => {
  cosmos.call('verifyHash', {
    hash: txHash
  }, (error, result) => {
    console.log(error, result);
    if (error) cb(error);
    else {
      let data = Buffer.from(result.result.data, 'base64');
      data = JSON.parse(data.toString()).value;
      result = {
        accountAddress: data.From,
        IP: data.Ip,
        pricePerGB: parseFloat(data.PricePerGb),
        encMethod: data.EncMethod,
        description: data.description,
        moniker: data.moniker,
        location: {
          latitude: parseFloat(data.Location.Latitude) / Math.pow(10, 6),
          longitude: parseFloat(data.Location.Longitude) / Math.pow(10, 6),
          city: data.Location.City,
          country: data.Location.Country
        },
        netSpeed: {
          download: parseFloat(data.NetSpeed.DownloadSpeed),
          upload: parseFloat(data.NetSpeed.UploadSpeed)
        },
        nodeType: data.NodeType,
        version: data.Version
      };
      cb(null, result);
    }
  });
};

module.exports = {
  generateToken,
  getNodeDetails
};