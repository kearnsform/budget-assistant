const path = require('path');
const methodOverride = require('method-override')
const { v4: uuid } = require('uuid'); //For generating ID's
const express = require('express');
const app = express();
const functions = require('./functions.js');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Transaction = require('./models/transaction');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { transactionSchema } = require('./schemas.js');
const transactionDao = require('./db/TransactionDao');
const TransactionFilter = require('./db/TransactionFilter');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))
    // To parse incoming JSON in POST request body:
app.use(express.json())
    // To 'fake' put/patch/delete requests:
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'));
// Views folder and EJS setup:
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


const validateTransaction = (req, res, next) => {
    const { error } = transactionSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

mongoose.connect('mongodb://localhost:27017/budgetData', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const categories = ['Groceries & Supplies', 'Travel', 'Home', 'Auto'];

app.get('/reports', async(req, res) => {
    const groupingColumn = req.query.groupingColumn;
    let groupings = [];
    if (groupingColumn) {
        const transactions = await transactionDao.getTransactions(new TransactionFilter(req));
        groupings = transactions.groupBy(groupingColumn);
        groupings.push({ key: 'Total', amount: transactions.total() });
    }
    res.render('reports/index', { groupings, reportName: req.query.reportName, groupingColumn: functions.capitalizeFirst(groupingColumn) });
})

app.get('/transactions', catchAsync(async(req, res) => {
    const filter = new TransactionFilter(req);
    const expiration = new Date(Date.now() + (60 * 60 * 1000)); // filter expires after 1 hour
    res.cookie('filter', filter, { expires: expiration, httpOnly: true });
    const transactions = await transactionDao.getTransactions(filter);
    res.render('transactions/index', { helpers: functions, transactions: transactions.get(), filter: filter, categories });
}))

app.get('/transactions/new', (req, res) => {
    res.render('transactions/new', { categories });
})

app.post('/transactions', validateTransaction, catchAsync(async(req, res) => {
    const newTransaction = new Transaction(req.body.transaction);
    await newTransaction.save();
    res.redirect('/transactions');
}))

app.get('/transactions/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    res.render('transactions/edit', { helpers: functions, transaction, categories });
}))

app.patch('/transactions/:id', validateTransaction, catchAsync(async(req, res) => {
    const { id } = req.params;
    await Transaction.findByIdAndUpdate(id, req.body.transaction, { runValidators: true, new: true });
    res.redirect('/transactions')
}))

app.delete('/transactions/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.redirect('/transactions');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("ON PORT 3000!")
})