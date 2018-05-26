let inputValidator = require('input-validator');


let validate = (input, schema) => {
  try {
    inputValidator(input, schema);
    return {
      isValid: true
    };
  } catch (error) {
    return {
      isValid: false,
      errors: error.message
    };
  }
};

module.exports = {
  validate: validate
};
