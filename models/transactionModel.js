const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    sum: {
        type: Number,
        required: [true, 'A transaction must have a sum']
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;