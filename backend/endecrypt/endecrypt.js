const jcv = require('json-cipher-value');
const crypto = require('crypto');
const { pw, salt } = require('../config');
const secret = crypto.scryptSync(pw, salt, 32);
const endecrypt = jcv(secret);

exports.endecrypt = (obj, bool) => {
    return bool ? endecrypt.decrypt(obj) : endecrypt.encrypt(obj);
};
