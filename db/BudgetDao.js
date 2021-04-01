const BudgetItem = require('../models/budgetItem');
const categoryDao = require('../db/CategoryDao');

async function getBudget() {
    const budget = {};
    const budgetItems = await BudgetItem.find({});
    const categories = (await categoryDao.getCategories());
    const incomeCategories = categories.filter(category => category.type === 'income').map((category) => { return category.name });
    const expenseCategories = categories.filter(category => category.type === 'expense').map((category) => { return category.name });
    budget.income = budgetItems.filter(item => incomeCategories.includes(item.category));
    budget.expenses = budgetItems.filter(item => expenseCategories.includes(item.category));
    const totalIncome = budget.income.reduce((acc, t) => { acc += t.amount; return acc; }, 0);
    const totalExpense = budget.expenses.reduce((acc, t) => { acc += t.amount; return acc; }, 0);
    budget.total = totalIncome - totalExpense;
    budget.lookup = function(category) {
        const entry = budget.expenses.concat(budget.income).find((entry) => entry.category === category);
        if (entry) {
            return { category: entry.category, amount: entry.amount };
        } else {
            return undefined;
        }
    }

    return budget;
}

exports.getBudget = getBudget;