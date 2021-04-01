const categoryDao = require('../db/CategoryDao');

class TransactionArray {
    constructor(array) {
        this.transactions = array;
    }

    get() {
        return this.transactions;
    }

    async groupBy(groupingColumn) {
        const categories = await categoryDao.getCategories();
        let grouping = this.transactions.reduce((acc, t) => {
            let entry = acc.find(({ key }) => key === t[groupingColumn]);
            if (entry === undefined) {
                entry = { key: t[groupingColumn], amount: 0 };
                acc.push(entry);
            }
            const type = categories.find(ct => ct.name === t.category).type;
            entry.amount += (type === 'income' ? t.amount : -t.amount);
            return acc;
        }, []);
        return grouping;
    }

    total() {
        return this.transactions.reduce((acc, t) => { acc += t.amount; return acc; }, 0);
    }
}

module.exports = TransactionArray;