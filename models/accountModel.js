const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A account must have a name'],
        trim: true
    },
    sum: {
        type: Number,
        default: 0
    }
    },
    {
        toJSON: { virtuals: true },
    }
);

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;