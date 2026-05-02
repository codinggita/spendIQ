class DateHelpers {
  static getStartOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  static getEndOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  }

  static getMonthRange(monthsBack = 0) {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsBack);
    return {
      start: this.getStartOfMonth(date),
      end: this.getEndOfMonth(date)
    };
  }

  static formatDate(date) {
    return new Date(date).toISOString().split('T')[0];
  }
}

module.exports = DateHelpers;
