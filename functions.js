function parseDate(date) {
    if (date === null || date === '' || date === undefined || isNaN(date)) {
        return '';
    } else {
        const year = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'UTC' }).format(date);
        const month = new Intl.DateTimeFormat('en', { month: '2-digit', timeZone: 'UTC' }).format(date);
        const day = new Intl.DateTimeFormat('en', { day: '2-digit', timeZone: 'UTC' }).format(date);
        return `${year}-${month}-${day}`;
    }
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

Date.prototype.minusMonths = function(n) {
    this.setMonth(this.getMonth() - n);
    return this;
}

Date.prototype.firstOfMonth = function() {
    this.setDate(1);
    return this;
}


exports.parseDate = parseDate;
exports.addDays = addDays;