const Account = require('../models/accountModel');
const Transaction = require('../models/transactionModel');
const AppError = require('../utils/appError');
const handleAsyncError = require('../utils/handleAsyncError');

exports.getAllTransactions = handleAsyncError(async (req, res, next) => {
    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 100;
    const skip = (page - 1) * limit;

    if (req.query.page) {
        const numTransactions = await Transaction.countDocuments();
        if (skip >= numTransactions) {
            throw new Error('This page does not exist');
        }
    }

    const transactions = await Transaction.find().sort('-date').skip(skip).limit(limit);

    res.status(200).json(transactions);
});

exports.getTransaction = handleAsyncError(async (req, res, next) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        return next(new AppError('No transaction found with this ID', 404));
    }

    res.status(200).json(transaction);
});


exports.createTransaction = handleAsyncError(async (req, res, next) => {
    const newTransaction = await Transaction.create(req.body);
    const account = await Account.findById(newTransaction.account);
    const newSum = account.sum + (newTransaction.sum * (newTransaction.type === 'credit' ? -1 : 1));
    await Account.findByIdAndUpdate(newTransaction.account, {sum: newSum},
        {
            runValidators: true
        });
    res.status(201).json(newTransaction);
});

exports.updateTransaction = handleAsyncError(async (req, res, next) => {
    const transactionToUpdate = await Transaction.findByIdAndUpdate(
        req.params.id,
        req.body, 
        {
            new: true,
            runValidators: true
        }
    );

    if (!transactionToUpdate) {
        return next(new AppError('No transaction found with this ID', 404));
    }

    res.status(200).json(transactionToUpdate);
});

exports.deleteTransaction = handleAsyncError(async (req, res, next) => {
    const transactionToDelete = await Transaction.findByIdAndDelete(req.params.id);

    if (!transactionToDelete) {
        return next(new AppError('No transaction found with this ID', 404));
    }

    res.status(204).json();
});