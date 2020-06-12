const express = require('express');
const accountRouter = require('./routes/accountRoutes');
const categoryRouter = require('./routes/categoryRoutes');

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/accounts', accountRouter);
app.use('/api/categories', categoryRouter);

module.exports = app;