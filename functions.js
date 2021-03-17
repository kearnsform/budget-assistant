function getYear(date) {
    return 1900 + date.getYear();
}

function getMonth(date) {
    let month = date.getMonth() + 1;
    month = "0" + month.toString();
    return month.slice(-2);
}

function getDay(date) {
    let day = date.getDate() + 1;
    day = "0" + day.toString();
    return day.slice(-2);
}

function parseDate(date) {
    if (date === null || date === undefined || isNaN(date)) {
        return '';
    } else {
        const year = getYear(date);
        const month = getMonth(date);
        const day = getDay(date);
        return `${year}-${month}-${day}`;
    }
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

exports.parseDate = parseDate;
exports.addDays = addDays;