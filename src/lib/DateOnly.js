
export default class DateOnly {
  constructor(year, month, day) {
    // Store internally as a JS Date at midnight local
    this._d = new Date(year, month - 1, day);
  }

  toDate() {
    return this._d;
  }

  // JSON.stringify will call this, so we emit our date-only marker
  toJSON() {
    return {
      __type__: 'date',
      year:  this._d.getFullYear(),
      month: this._d.getMonth() + 1,
      day:   this._d.getDate(),
    };
  }
}