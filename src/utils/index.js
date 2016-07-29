import { default as dateFormater } from './dateFormat'
export const dateFormat = dateFormater
export const noop = () => null
export const identity = d => d
export const prop = key => d => d[key]

export function first(array, accessor) {
  if (accessor && array) {
    var value
    for (var i = 0; i < array.length; i++) {
      value = array[i]
      if (isDefined(accessor(value))) break
    }
    return value;
  }
  return array ? array[0] : undefined
}

export function isDefined(d) {
  return d !== null && typeof d != "undefined"
}

export function last(array, accessor) {
  if (accessor && array) {
    var value;
    for (var i = array.length - 1; i >= 0; i--) {
      value = array[i];
      if (isDefined(accessor(value))) break;
    }
    return value;
  }
  var length = array ? array.length : 0;
  return length ? array[length - 1] : undefined;
}

export function isNotDefined(d) {
  return !isDefined(d);
}

export function inSameInterval(a, b, interval = 'DAY') {
  var formatter = identity
  switch (interval) {
  case 'YEAR':
  {
    formatter = (d) => dateFormater(d, 'yyyy')
    break;
  }
  case 'MONTH':
  {
    formatter = (d) => dateFormater(d, 'yyyy-mm')
    break;
  }
  case 'DAY':
  {
    formatter = (d) => dateFormater(d, 'yyyy-mm-dd')
    break;
  }
  case 'HOUR':
  {
    formatter = (d) => dateFormater(d, 'yyyy-mm-dd HH')
    break;
  }
  case 'MINUTE':
  {
    formatter = (d) => dateFormater(d, 'yyyy-mm-dd HH:MM')
    break;
  }
  case 'SECOND':
  {
    formatter = (d) => dateFormater(d, 'yyyy-mm-dd HH:MM:ss')
    break;
  }
  default:
  {
    throw new Error(`Not an expected interval: ${interval}`)
  }
  }
  return formatter(a) === formatter(b)
}
