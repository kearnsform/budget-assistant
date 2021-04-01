Date.prototype.minusMonths = function(n) {
    let origDate = this.getDate();
    this.setDate(15);
    this.setMonth(this.getMonth() - n);
    const month = this.getMonth();

    let dateToReturn = new Date(this.getYear() + 1900, month, 15);
    if (origDate === 31 || (month === 1 && origDate > 28)) {
        dateToReturn = dateToReturn.lastOfMonth();
    } else {
        dateToReturn.setDate(origDate);
    }
    return dateToReturn;
}

Date.prototype.minusYears = function(n) {
    this.setYear(1900 + this.getYear() - n);
    return this;
}

Date.prototype.firstOfMonth = function() {
    this.setDate(1);
    return this;
}

Date.prototype.firstOfYear = function() {
    this.setMonth(0);
    this.setDate(1);
    return this;
}

Date.prototype.lastOfYear = function() {
    this.setMonth(11);
    this.setDate(31);
    return this;
}

Date.prototype.lastOfMonth = function() {
    const month = this.getMonth() + 1;
    const year = this.getYear() + 1900;
    const isLeapYear = ((year % 4 === 0) && !((year % 100 === 0) && !(year % 400 === 0)));
    let date = 31;
    switch (month) {
        case 4:
        case 6:
        case 9:
        case 11:
            date = 30;
            break;
        case 2:
            if (isLeapYear) {
                date = 29;
            } else {
                date = 28;
            }
            break;
        default:
            //nothing
    }
    this.setDate(date);
    return this;
}

Date.prototype.toIso = function() {
    return new Date(this.toISOString().split('T')[0] + 'T00:00:00.000Z');
}