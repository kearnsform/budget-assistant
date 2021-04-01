const AccountReportBuilder = require('./AccountReportBuilder');
const CategoryReportBuilder = require('./CategoryReportBuilder');
const categoryDao = require('../../db/CategoryDao');

class ReportFactory {
    constructor(groupings, query, filter) {
        this.groupings = groupings;
        this.config = new ReportConfig(query);
        this.filter = filter;
    }

    async build() {
        let reportBuilder = {};
        if (this.config.groupingColumn === 'category') {
            const categories = (await categoryDao.getCategories()).map(ct => { return { name: ct.name, type: ct.type, active: ct.active } });
            reportBuilder = new CategoryReportBuilder(categories);
        } else {
            reportBuilder = new AccountReportBuilder();
        }
        await reportBuilder.addDefaultEntries(this.filter.categories);
        reportBuilder.addAmounts(this.groupings);
        if (this.config.includeBudget) {
            await reportBuilder.addBudgetColumn(this.getMonthsSpan());
        }
        if (this.config.includeTotal) {
            reportBuilder.addTotalRow();
        }
        if (this.config.includeBudget && this.config.includeTotal) {
            reportBuilder.addBudgetTotal();
        }
        if (this.config.includeBudget && this.config.alert) {
            reportBuilder.addAlerts();
        }

        return reportBuilder.getReport();

    }

    getMonthsSpan() {
        var months = 1;
        months += (this.filter.endDate.getFullYear() - this.filter.startDate.getFullYear()) * 12;
        months -= this.filter.startDate.getMonth();
        months += this.filter.endDate.getMonth();
        return months <= 0 ? 0 : months;
    }
}

class ReportConfig {
    constructor(query) {
        this.groupingColumn = query.groupingColumn;
        this.includeTotal = query.includeTotal === 'true';
        this.includeBudget = query.includeBudget === 'true';
        this.alert = query.alert === 'true';
    }
}

module.exports = ReportFactory;