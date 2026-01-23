import validator from 'validator';

const checkEmail = (email : string) : boolean => {
    return validator.isEmail(email);
}

const checkUsername = (username : string) : boolean => {
    return validator.isLength(username, { min: 6 });
}

const checkPassword = (password : string) : boolean => {
    return validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
}

module.exports = { checkEmail, checkPassword, checkUsername }