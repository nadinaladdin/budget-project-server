const Account = require('../models/accountModel');

exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.find();
        res.status(200).json(accounts);
    } catch (err) {
        res.status(404).json(err);
    }
};

exports.getAccount = async (req, res) => {
    try {
        const account = await Account.findById(+req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                account
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

exports.createAccount = async (req, res) => {
    try {
        const newAccount = await Account.create(req.body);
        res.status(201).json(newAccount);
    } catch (err) {
        res.status(400).json(err)
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const accountToUpdate = await Account.findByIdAndUpdate(
            +req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        req.status(200).json({
            status: 'success',
            data: {
                accountToUpdate
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await Account.findByIdAndDelete(+req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};
