const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    pw: process.env.PW,
    salt: process.env.SALT,
    mongoPW: process.env.MONGO_PW,
    mongoUser: process.env.MONGO_USER,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET
};