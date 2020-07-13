const Transaction = require('../models/transactionModel');
const Account = require('../models/accountModel');
const AppError = require('../utils/appError');
const handleAsyncError = require('../utils/handleAsyncError');

//GET analytics/balance
exports.getBalance = handleAsyncError(async (req, res, next) => {
    const balance = await Account.aggregate([
        {
            $group: {
                _id: null,
                total: {$sum: '$sum'}
            }
        }
    ]);
    res.status(200).json(balance);
});

//GET analitycs/accounts-debits
exports.getAccountsDebits = handleAsyncError(async (req, res, next) => {
    const accountsDebits = await Transaction.aggregate([
        {
            $match: {
                type: {$eq: 'debit'}
            }
        },
        {
            $group: {
                _id: '$account',
                transactions: { $push: {date: '$date', sum: '$sum'} }
            }
        },
        {
            $lookup: {
                from: 'accounts',
                localField: '_id',
                foreignField: '_id',
                as: 'account'
            }
        },
        {
            $project: {
                _id: 0
            }
        }
    ]);
    res.status(200).json(accountsDebits);
});

//GET analytics/month-expenses/:year/:month
exports.getMonthlyExpenses = handleAsyncError(async (req, res, next) => {
    const year = +req.params.year;
    const month = +req.params.month - 1;
    const lastMonthDay = (new Date(year, month + 1, 0)).getDate();

    const monthlyExpenses = await Transaction.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(Date.UTC(year, month, 1)),
                    $lte: new Date(Date.UTC(year, month, lastMonthDay)),
                }
            }
        },
        {
            $group: {
                 _id: '$category',
                total: { $sum: '$sum'}
            }
        },
        {
            $lookup: {
                from: 'categories',
                localField: '_id',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $project: {
                _id: 0
            }
        }
    ]);
    res.status(200).json(monthlyExpenses);
});