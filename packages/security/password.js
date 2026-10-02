// تشفير كلمات المرور الآمن (Password Security Hashing)
const crypto = require('crypto');

class PasswordSecurity {
    static async hash(password) {
        if (!password || typeof password !== 'string' || password.length < 10) {
            throw new Error('كلمة المرور يجب ألا تقل عن 10 أحرف وتكون نصاً صالحاً');
        }

        const salt = crypto.randomBytes(16).toString('hex');
        return new Promise((resolve, reject) => {
            crypto.scrypt(password.normalize('NFKC'), salt, 64, { N: 16384, r: 8, p: 1 }, (err, derivedKey) => {
                if (err) return reject(err);
                resolve(`scrypt$${salt}$${derivedKey.toString('hex')}`);
            });
        });
    }

    static async verify(password, storedHash) {
        if (!storedHash || !storedHash.startsWith('scrypt$')) return false;
        const parts = storedHash.split('$');
        if (parts.length !== 3) return false;

        const salt = parts[1];
        const keyHex = parts[2];
        const keyBuffer = Buffer.from(keyHex, 'hex');

        return new Promise((resolve) => {
            crypto.scrypt(password.normalize('NFKC'), salt, 64, { N: 16384, r: 8, p: 1 }, (err, derivedKey) => {
                if (err) return resolve(false);
                if (derivedKey.length !== keyBuffer.length) return resolve(false);
                resolve(crypto.timingSafeEqual(derivedKey, keyBuffer));
            });
        });
    }
}

module.exports = PasswordSecurity;
