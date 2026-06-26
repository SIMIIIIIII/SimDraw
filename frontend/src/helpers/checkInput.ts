import validator from 'validator'

const checkInput = {
  isValidUsername: function (input: string) {
    if (input.length < 6) {
      return false;
    }
    if (input.split(' ').length > 1) {
      return false;
    }
    return true;
  },

  isValidPassword: function (input: string) {
    return validator.isStrongPassword(input, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });
  },

  isValidEmail: function (input: string) {
    return validator.isEmail(input);
  },
};

export default checkInput;