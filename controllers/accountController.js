const Account = require('../models/accountModel');
const AppError = require('../utils/appError');
const handleAsyncError = require('../utils/handleAsyncError');

exports.getAllAccounts = handleAsyncError(async (req, res, next) => {
    const accounts = await Account.find();
    res.status(200).json(accounts);
});

exports.getAccount = handleAsyncError(async (req, res, next) => {
    const account = await Account.findById(+req.params.id);

    if (!account) {
        return next(new AppError('No account found with this ID', 404));
    }

    res.status(200).json(account);
});

exports.createAccount = handleAsyncError(async (req, res, next) => {
    const newAccount = await Account.create(req.body);
    res.status(201).json(newAccount);
});

exports.updateAccount = handleAsyncError(async (req, res, next) => {
    const accountToUpdate = await Account.findByIdAndUpdate(
        +req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    if (!accountToUpdate) {
        return next(new AppError('No account found with this ID', 404));
    }

    res.status(200).json(accountToUpdate);
});

exports.deleteAccount = handleAsyncError(async (req, res, next) => {
    const accountToDelete = await Account.findByIdAndDelete(+req.params.id);

    if (!accountToDelete) {
        return next(new AppError('No account found with this ID', 404));
    }

    res.status(204).json();
});
