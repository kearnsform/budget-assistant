const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');
const AllowedUser = require('../models/alloweduser');

module.exports.renderRegisterUserForm = (req, res) => {
    res.render('users/register');
}

let allowedUsersLoaded = false;
let allowedUsers = [];

async function getAllowedUsers() {
    if (!allowedUsersLoaded) {
        allowedUsers = (await AllowedUser.find({})).map(user => { return user.email });
        allowedUsersLoaded = true;
    }
    return allowedUsers;
}

module.exports.registerUser = async(req, res, next) => {
    try {
        const { email, username, password } = req.body;
        if (process.env.RESTRICT_USERS === 'true' && !(await getAllowedUsers()).includes(email)) {
            throw new ExpressError(`User ${email} does not have permission.`, 403);
        }
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/transactions');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/users/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
}