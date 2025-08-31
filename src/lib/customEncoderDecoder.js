
import { ObjectId } from 'bson';
import Decimal from 'decimal.js';
import DateOnly from './DateOnly';
import IPEntity from './IPEntity';


export function customDecoder(key, value) {
  if (value && typeof value === "object" && value.__type__) {
    switch (value.__type__) {
      case 'date':
        // revive to a DateOnly instance
        return new DateOnly(value.year, value.month, value.day);

      case 'datetime':
        return new Date(
          value.year,
          value.month - 1,
          value.day,
          value.hour,
          value.minute,
          value.second,
          value.microsecond / 1000
        );

      case 'objectid':
        return new ObjectId(value.value);

      case 'decimal':
        return new Decimal(value.value);

      case 'bytes':
        return Uint8Array.from(value.value);

      case 'relativedelta':
        return {
          years:  value.years,
          months: value.months,
          days:   value.days,
        };

      case 'IPEntity':
        return new IPEntity(value.value, {
          name:   value._name,
          vlanid: value.vlan,
          tos:    value.tos
        });

      default:
        return value;
    }
  }
  return value;
}


export function customEncoder(value) {
  // 1) DateOnly → date-only JSON
  if (value instanceof DateOnly) {
    return value; // its toJSON() gives the correct __type__: 'date'
  }

  // 2) Date → full datetime JSON
  if (value instanceof Date) {
    return {
      __type__: 'datetime',
      year:        value.getFullYear(),
      month:       value.getMonth() + 1,
      day:         value.getDate(),
      hour:        value.getHours(),
      minute:      value.getMinutes(),
      second:      value.getSeconds(),
      microsecond: value.getMilliseconds() * 1000,
    };
  }

  // 7) IPEntity 
  if (value instanceof IPEntity) {
    return value.toJSON();
  }

  // 4) ObjectId
  if (ObjectId && value instanceof ObjectId) {
    return { __type__: 'objectid', value: value.toHexString() };
  }

  // 5) Decimal
  if (Decimal && Decimal.isDecimal(value)) {
    return { __type__: 'decimal', value: value.toString() };
  }

  // 6) Bytes
  if (value instanceof Uint8Array) {
    return { __type__: 'bytes', value: Array.from(value) };
  }

  // 7) Relativedelta-like
  if (
    value &&
    typeof value === 'object' &&
    ('years' in value || 'months' in value || 'days' in value)
  ) {
    return {
      __type__: 'relativedelta',
      years:   value.years   || 0,
      months:  value.months  || 0,
      days:    value.days    || 0,
    };
  }

  if (Array.isArray(value)) {
    return value.map(customEncoder);
  }

  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = customEncoder(v);
    }
    return out;
  }

  // Fallback — let JSON.stringify handle it
  return value;
}
