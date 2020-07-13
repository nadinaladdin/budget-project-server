const mongoose = require('mongoose');
const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const DB = process.env.DATABASE_CONNECTION_STRING;

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('DB connection succesful');
    });

const port = 3002;
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})