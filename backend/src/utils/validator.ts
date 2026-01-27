import validator from 'validator';

export const checkEmail = (email: string): boolean => {
    return validator.isEmail(email);
};

export const checkUsername = (username: string): boolean => {
    return (
        !username.trim().includes(' ') &&
        validator.isLength(username.trim(), { min: 6 })
    );
};

export const checkPassword = (password: string): boolean => {
    return validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    });
};