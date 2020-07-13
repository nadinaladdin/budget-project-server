const express = require('express');
const cors = require('cors');
const accountRouter = require('./routes/accountRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const analyticsRouter = require('./routes/analyticsRoutes');
const AppError = require('./utils/appError');

const app = express();

app.use(express.json());

app.use(cors());
app.use(express.static(`${__dirname}/public`));

app.use('/api/accounts', accountRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/transactions', transactionRouter);
app.use('/api/analytics', analyticsRouter);

app.all('*', (req, res, next) => {

    next(new AppError (`Can't find ${req.originalUrl} on this server`, 404));
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
});

module.exports = app;
