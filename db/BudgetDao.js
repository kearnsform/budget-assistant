const BudgetItem = require('../models/budgetItem');

async function getBudget() {
    const budget = {};
    const budgetItems = await BudgetItem.find({});
    budget.income = budgetItems.filter(item => item.type === 'income');
    budget.expenses = budgetItems.filter(item => item.type === 'expense');
    const totalIncome = budget.income.reduce((acc, t) => { acc += t.amount; return acc; }, 0);
    const totalExpense = budget.expenses.reduce((acc, t) => { acc += t.amount; return acc; }, 0);
    budget.total = totalIncome - totalExpense;
    return budget;
}

async function getCategories() {
    const items = await BudgetItem.find({});
    return items.reduce((acc, i) => { acc.push(i.category); return acc; }, []);
}

exports.getBudget = getBudget;
exports.getCategories = getCategories;