const path = require('path');
const methodOverride = require('method-override')
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const cookieParser = require('cookie-parser');

const transactionsRoutes = require('./routes/transactionsRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

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

mongoose.connect('mongodb://localhost:27017/budgetData', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

app.get("/", (req, res) => {
    res.render('home/index', {});
})
app.use('/transactions', transactionsRoutes);
app.use('/reports', reportsRoutes);
app.use('/budget', budgetRoutes);

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