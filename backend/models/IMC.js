const mongoose = require('mongoose');

const IMCSchema = new mongoose.Schema({
    altura: {
        type: Number,
        required: true
    },
    peso: {
        type: Number,
        required: true
    },
    imc: {
        type: Number,
        required: true
    },
    data: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('IMC', IMCSchema);