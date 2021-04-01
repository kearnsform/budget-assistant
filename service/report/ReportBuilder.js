const functions = require('../../functions');

class ReportBuilder {
    constructor() {
        this.report = { entries: [] };
    }

    // abstract
    addDefaultEntries(keys) {}

    addAmounts(groupings) {
        for (let grouping of groupings) {
            const entry = this.report.entries.find(entry => { return entry.key === grouping.key });
            if (entry) {
                entry.amount = grouping.amount;
            } else {
                this.report.entries.push({ key: grouping.key, amount: grouping.amount, active: false });
            }
        }
    }

    // abstract
    addBudgetColumn(monthsSpan) {}


    addTotalRow() {
        const totalAmount = this.report.entries.reduce((acc, e) => { acc += e.amount; return acc; }, 0);
        const totalEntry = { key: 'Total', amount: functions.round(totalAmount) };
        this.report.totalEntry = totalEntry;
    }

    // abstract
    addBudgetTotal() {}

    // abstract
    addAlerts() {}

    getReport() {
        return this.report;
    }
}


module.exports = ReportBuilder;