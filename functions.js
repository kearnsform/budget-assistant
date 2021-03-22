function capitalizeFirst(str) {
    if (str === undefined || str.length < 1) {
        return str;
    }
    if (str.length < 2) {
        return str.charAt(0).toUpperCase();
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

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

exports.parseDate = parseDate;
exports.capitalizeFirst = capitalizeFirst;