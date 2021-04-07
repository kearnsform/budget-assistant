if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const path = require('path');
const methodOverride = require('method-override')
const express = require('express');
const favicon = require('serve-favicon')
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoDBStore = require("connect-mongo");
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/userRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const accountRoutes = require('./routes/accountRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const setupRoutes = require('./routes/setupRoutes');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(cookieParser());

//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))
    // To parse incoming JSON in POST request body:
app.use(express.json())
    // To 'fake' put/patch/delete requests:
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'));
app.use(mongoSanitize({
        replaceWith: '_'
    }))
    // Views folder and EJS setup:
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const secret = process.env.SECRET;
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});
store.on("error", function(e) {
    console.log("SESSION STORE ERROR", e)
})
const sessionConfig = {
    store,
    name: 'budget-session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://ajax.googleapis.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://cdnjs.cloudflare.com/",
];
const styleSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net/",
];
const connectSrcUrls = [];
const fontSrcUrls = [
    "https://cdn.jsdelivr.net/",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    console.log(req.session)
    res.locals.currentUser = req.user;
    next();
})

app.get("/", (req, res) => {
    res.render('home/index', {});
})
app.use('/users', userRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/reports', reportsRoutes);
app.use('/budget', budgetRoutes);
app.use('/accounts', accountRoutes);
app.use('/categories', categoriesRoutes);
app.use('/setup', setupRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    console.error(err);
    res.status(statusCode).render('error', { errorMessage: err.message })
})

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`ON PORT ${port}`)
})