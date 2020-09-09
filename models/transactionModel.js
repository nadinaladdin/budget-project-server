const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    sum: {
        type: Number,
        required: [true, 'A transaction must have a sum'],
        // validate: function(val) {
        //     if (this.type === 'credit') {

        //     }
        // }
    },
    type: {
        type: String,
        enum: {
            values: ['credit', 'debit'],
            message: 'Type is either: credit, debit'
        },
        default: 'credit'
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    },
    account: {
        type: mongoose.Schema.ObjectId,
        ref: 'Account',
        required: [true, 'A transaction must have a category']
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}
);

transactionSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'category',
        select: 'name colour'
    }).populate({
        path: 'account',
        select: 'name'
    });
    next();
});

// // DOCUMANT MIDDLEWARE: runs before .save() command and .create() 
// transactionSchema.pre('save', function(next) {
//     console.log(this);
//     next();
// });

// transactionSchema.post('save', function(doc, next) {
//     next();
// });

// //QUERY MIDDLEWARE
// transactionSchema.pre(/^find/, function(next) {
//     next();
// });

// transactionSchema.post(/^find/, function(docs, next) {
//     next();
// })

// //AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//     next();
// });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;