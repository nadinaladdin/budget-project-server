const express = require('express');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

router
    .route('/month-expenses/:year/:month')
    .get(analyticsController.getMonthlyExpenses);

router
    .route('/balance')
    .get(analyticsController.getBalance);

router
    .route('/accounts-debits')
    .get(analyticsController.getAccountsDebits);

module.exports = router;