const ReportBuilder = require('./ReportBuilder');
const Account = require('../../models/account');

class AccountReportBuilder extends ReportBuilder {

    async addDefaultEntries(accounts) {
        const accts = await Account.find({});
        for (let account of accts) {
            this.report.entries.push({ key: account.name, amount: 0 });
        }
    }

}

module.exports = AccountReportBuilder;