export const xAxis = {
  enabled: true,
  height: 20,
}

export const yAxis = {
  enabled: true,
  width: 50,
}

export const canvas = {
  padding: { top: 0, left: 0, right: 0, bottom: 0 },
}

export const fieldsForSeries = {
  main: ['open', 'high', 'low', 'close'],
  compare: ['open', 'high', 'low', 'close'],
  volume: 'volume',
  overlay: 'close',
  indicator: 'close',
  default: 'close'
}

export const paramsForSeries = {
  ema: { timeperiod: 20 },
  sma: { timeperiod: 20 },
  bbands: { timeperiod: 20, nbdevup: 2, nbdevdn: 2 },
  kama: { timeperiod: 10, fastestperiod: 2, slowestperiod: 30 },
  macd: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
  line: { input: 'close' },
}
