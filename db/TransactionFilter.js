require('../utils/DateExtensions.js');

class TransactionFilter {
    constructor(req) {
        let filterOptions = req.query.filter;
        if (!filterOptions) {
            filterOptions = req.cookies.filter;
        }
        if (!filterOptions) {
            filterOptions = { startDate: new Date().minusMonths(1).firstOfMonth() }; //default filter
        }

        if (filterOptions.accounts) {
            this.accounts = filterOptions.accounts;
        }

        if (filterOptions.startDate) {
            this.startDate = new Date(filterOptions.startDate); //new Date() because query parameters and cookies parse as strings
        } else if (filterOptions.periodCode === 'M' && filterOptions.periodStartValue) {
            this.startDate = new Date().minusMonths(filterOptions.periodStartValue).firstOfMonth();
        } else if (filterOptions.periodCode === 'Y' && filterOptions.periodStartValue) {
            this.startDate = new Date().minusYears(filterOptions.periodStartValue).firstOfYear();
        }

        if (filterOptions.endDate) {
            this.endDate = new Date(filterOptions.endDate);
        } else if (filterOptions.periodCode === 'M' && filterOptions.periodEndValue) {
            this.endDate = new Date().minusMonths(filterOptions.periodEndValue).lastOfMonth();
        } else if (filterOptions.periodCode === 'Y' && filterOptions.periodEndValue) {
            this.endDate = new Date().minusYears(filterOptions.periodEndValue).lastOfYear();
        }

        if (filterOptions.categories) {
            this.categories = filterOptions.categories;
        }

        if (filterOptions.notes) {
            this.notes = filterOptions.notes;
        }

    }

}

module.exports = TransactionFilter;