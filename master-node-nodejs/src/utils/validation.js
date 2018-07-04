import validator from 'input-validator'

const validate = (inputObject, schemaObj) => {
  try {
    validator(inputObject, schemaObj);
    return { isValid: true };
  } catch (e) {
    return { isValid: false, message: e.message[0]['message'] };
  }
}

export default {
  validate
}