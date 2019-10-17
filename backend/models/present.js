const mongoose = require('mongoose');

const presentableSchema = mongoose.Schema({
    gmt: {type: String, required: true},
    mnd: {type: String, required: true},
    led: {
        _id: false,
        w1: {type: String},
        w2: {type: String, required: true},
        w3: {type: String, required: true},
        w4: {type: String, required: true},
        w5: {type: String}
    },
    opw: {
        _id: false,
        w1: {type: String},
        w2: {type: String, required: true},
        w3: {type: String, required: true},
        w4: {type: String, required: true},
        w5: {type: String}
    },
    totled: {type: String, required: true},
    totopw: {type: String, required: true},
    gemled: {type: String, required: true},
    gemopw: {type: String, required: true}
}, {minimize: false});

module.exports = mongoose.model('Presentable', presentableSchema);
