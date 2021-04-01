const Account = require('../models/account');

module.exports.renderNewForm = (req, res) => {
    res.render('accounts/new', {});
}

module.exports.createNewAccount = async(req, res) => {
    const account = new Account(req.body.account);
    await account.save();
    res.redirect('/setup');
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const account = await Account.findById(id);
    res.render('accounts/edit', { account });
}

module.exports.updateAccount = async(req, res) => {
    const { id } = req.params;
    await Account.findByIdAndUpdate(id, req.body.account, { runValidators: true, new: true });
    res.redirect('/setup');
}