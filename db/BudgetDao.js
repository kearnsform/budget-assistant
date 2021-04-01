const BudgetItem = require('../models/budgetItem');
const categoryDao = require('../db/CategoryDao');

async function getBudget() {
    const budget = {};

    const categories = (await categoryDao.getCategories())
        .map(ct => { return { name: ct.name, type: ct.type, active: ct.active } });

    const budgetItems = (await BudgetItem.find({}))
        .map(bi => { return { id: bi.id, category: categories.find(ct => ct.name === bi.category), amount: bi.amount } });

    budget.income = budgetItems.filter(item => item.category.type === 'income');
    budget.expenses = budgetItems.filter(item => item.category.type === 'expense');
    const totalIncome = budget.income.reduce((acc, t) => { acc += t.amount; return acc; }, 0);
    const totalExpense = budget.expenses.reduce((acc, t) => { acc += t.amount; return acc; }, 0);
    budget.total = totalIncome - totalExpense;
    budget.lookup = function(categoryName) {
        return budget.expenses.concat(budget.income).find((item) => item.category.name === categoryName);
    }

    return budget;
}

exports.getBudget = getBudget;