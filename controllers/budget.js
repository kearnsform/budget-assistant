const BudgetItem = require('../models/budgetItem');
const budgetDao = require('../db/BudgetDao');
const categoryDao = require('../db/CategoryDao');

module.exports.index = async(req, res) => {
    const budget = await budgetDao.getBudget();
    res.render('budget/index', { budget });
}

module.exports.renderNewForm = async(req, res) => {
    const categories = (await categoryDao.getCategories(true)).map((category) => { return category.name });
    res.render('budget/new', { categories });
}

module.exports.createNewBudgetItem = async(req, res) => {
    const budgetItem = new BudgetItem(req.body.budgetItem);
    await budgetItem.save();
    res.redirect('/budget');
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const budgetItem = await BudgetItem.findById(id);
    res.render('budget/edit', { budgetItem });
}

module.exports.updateBudgetItem = async(req, res) => {
    const { id } = req.params;
    await BudgetItem.findByIdAndUpdate(id, req.body.budgetItem, { runValidators: true, new: true });
    res.redirect('/budget');
}

module.exports.deleteBudgetItem = async(req, res) => {
    const { id } = req.params;
    await BudgetItem.findByIdAndDelete(id);
    res.redirect('/budget');
}