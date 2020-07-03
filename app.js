const express = require('express');
const cors = require('cors');
const accountRouter = require('./routes/accountRoutes');
const categoryRouter = require('./routes/categoryRoutes');

const app = express();

app.use(express.json());

app.use(cors());
app.use(express.static(`${__dirname}/public`));

app.use('/api/accounts', accountRouter);
app.use('/api/categories', categoryRouter);

module.exports = app;
