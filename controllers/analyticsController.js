const Transaction = require('../models/transactionModel');
const Account = require('../models/accountModel');
const AppError = require('../utils/appError');
const handleAsyncError = require('../utils/handleAsyncError');

//GET analytics/balance
exports.getBalance = handleAsyncError(async (req, res, next) => {
    const balanceData = await Account.aggregate([
        {
            $group: {
                _id: null,
                total: {$sum: '$sum'}
            }
        }
    ]);
    const balance = balanceData[0] ? balanceData[0].total : 0;
    res.status(200).json(balance);
});

//GET analitycs/accounts-debits/:year/:month
exports.getAccountsDebits = handleAsyncError(async (req, res, next) => {
    const year = +req.params.year;
    const month = +req.params.month;
    const lastMonthDay = (new Date(year, month + 1, 0)).getDate();

    const accountsDebitsData = await Transaction.aggregate([
        {
            $match: {
                type: {$eq: 'debit'},
                date: {
                    $gte: new Date(Date.UTC(year, month, 1)),
                    $lte: new Date(Date.UTC(year, month, lastMonthDay)),
                },
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
    const accountsDebits = accountsDebitsData.map(item => {
        return {
            account: item.account[0],
            transactions: item.transactions
        }
    });
    
    res.status(200).json(accountsDebits);
});

//GET analytics/month-expenses/:year/:month
exports.getMonthlyExpenses = handleAsyncError(async (req, res, next) => {
    const year = +req.params.year;
    const month = +req.params.month;
    const lastMonthDay = (new Date(year, month + 1, 0)).getDate();

    const monthlyExpensesData = await Transaction.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(Date.UTC(year, month, 1)),
                    $lte: new Date(Date.UTC(year, month, lastMonthDay)),
                },
                category: {$ne:null}
            }
        },
        {
            $group: {
                 _id: '$category',
                sum: { $sum: '$sum'},
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

    const monthlyExpenses = {
        total: monthlyExpensesData.reduce((accumulator, currentValue) => accumulator + currentValue.sum, 0),
        expenses: monthlyExpensesData.map(item => {
            return {
                name: item.category[0].name,
                value: item.sum,
                colour: item.category[0].colour,
            }
        })
    };
    res.status(200).json(monthlyExpenses);
});