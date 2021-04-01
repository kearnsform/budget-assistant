const budgetDao = require('../../db/BudgetDao');
const ReportBuilder = require('./ReportBuilder');
const functions = require('../../functions');

class CategoryReportBuilder extends ReportBuilder {
    constructor(categories) {
        super();
        this.categories = categories;
    }

    async addDefaultEntries(selectedCategories) {
        let reportCategories = this.categories.filter(ct => ct.active === true);
        if (selectedCategories) {
            reportCategories = this.categories.filter(ct => selectedCategories.includes(ct.name));
        }
        for (let ct of reportCategories) {
            this.report.entries.push({ key: ct.name, amount: 0, type: ct.type, active: ct.active });
        }
    }

    async addBudgetColumn(monthsSpan) {
        const signedAmount = function(entry) {
            let multiplier = entry.category.type === 'expense' ? -1 : 1;
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
        let totalBudgetAmount = this.report.entries.reduce((acc, e) => { acc += (e.budgetAmount ? e.budgetAmount : 0); return acc; }, 0);
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