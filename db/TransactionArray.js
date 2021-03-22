class TransactionArray {
    constructor(array) {
        this.transactions = array;
    }

    get() {
        return this.transactions;
    }

    groupBy(groupingColumn) {
        let grouping = this.transactions.reduce((acc, t) => {
            let entry = acc.find(({ key }) => key === t[groupingColumn]);
            if (entry === undefined) {
                entry = { key: t[groupingColumn], amount: 0 };
                acc.push(entry);
            }
            entry.amount += t.amount;
            return acc;
        }, []);
        return grouping;
    }

    total() {
        return this.transactions.reduce((acc, t) => { acc += t.amount; return acc; }, 0);
    }
}

module.exports = TransactionArray;