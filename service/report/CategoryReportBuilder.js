const budgetDao = require('../../db/BudgetDao');
const ReportBuilder = require('./ReportBuilder');
const functions = require('../../functions');

class CategoryReportBuilder extends ReportBuilder {

    async addDefaultEntries(categories) {
        let budgetItems = (await budgetDao.getBudget()).flatten();
        if (categories) {
            budgetItems = budgetItems.filter(ct => categories.includes(ct.category));
        }
        for (let ct of budgetItems) {
            this.report.entries.push({ key: ct.category, amount: 0, type: ct.type });
        }
    }

    async addBudgetColumn(monthsSpan) {
        const signedAmount = function(entry) {
            let multiplier = entry.type === 'expense' ? -1 : 1;
            return multiplier * (entry.amount || 0);
        }
        const budget = await budgetDao.getBudget();
        for (let entry of this.report.entries) {
            const budgetEntry = budget.lookup(entry.key);
            if (budgetEntry) {
                entry.budgetAmount = signedAmount(budgetEntry) * monthsSpan;
            }
        }
    }

    addBudgetTotal() {
        let totalBudgetAmount = this.report.entries.reduce((acc, e) => { acc += e.budgetAmount; return acc; }, 0);
        this.report.totalEntry.budgetAmount = functions.round(totalBudgetAmount);
    }

    addAlerts() {
        for (let entry of this.report.entries.concat(this.report.totalEntry)) {
            if (entry) {
                if (entry.amount < entry.budgetAmount) {
                    entry.alert = true;
                }
            }
        }
    }

}


module.exports = CategoryReportBuilder;