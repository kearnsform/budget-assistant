const ReportBuilder = require('./ReportBuilder');

class AccountReportBuilder extends ReportBuilder {

    async addDefaultEntries(accounts) {
        this.report.entries.push({ key: 1, amount: 0 });
    }

}

module.exports = AccountReportBuilder;