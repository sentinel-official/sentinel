import validator from 'input-validator'

export const validate = (inputObject, schemaObj) => {
  try {
    validator(inputObject, schemaObj);
    return { isValid: true };
  } catch (e) {
    return { isValid: false, message: e.message[0]['message'] };
  }
}