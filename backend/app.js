const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const presentRoutes = require('./routes/present');
const userRoutes = require('./routes/user');
const path = require('path');
const { mongoPW, mongoUser, mongoUri } = require('./config');

const app = express();

mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPW}@${mongoUri}`, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
.then(() => {
    console.log('Connected to database!');
}).catch((error) => {
    console.log(error.message);
    console.log('Connection failed!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', express.static(path.join(__dirname, 'angular')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, User-Email');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        return res.status(200).json({});
    };
    next();
});

app.use('/api', presentRoutes);
app.use('/auth', userRoutes);
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "angular", "index.html"));
});

app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;