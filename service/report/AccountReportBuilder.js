const ReportBuilder = require('./ReportBuilder');

class AccountReportBuilder extends ReportBuilder {

    async addDefaultEntries(accounts) {
        this.report.entries.push({ key: 'US Bank', amount: 0 });
    }

}

module.exports = AccountReportBuilder;