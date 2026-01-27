import bcrypt from 'bcryptjs'
const saltRounds = 10;

export const hashPassword = async (password : string) : Promise<string> => {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (err) {
        console.error('Error hashing password:', err);
        throw err;
    }
}