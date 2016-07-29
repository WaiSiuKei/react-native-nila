import {
  inSameInterval,
  } from './utils'

export default class DataProcessor {
  static intervals = ['MINUTE', 'HOUR', 'DAY', 'MONTH', 'YEAR']

  addMilestone(data, interval) {
    if (!Array.isArray(data))return []
    let len = data.length
    if (!len)return []
    let prevDate
    data.forEach(d => {
      let { strtime } = d
      let thisDate = new Date(strtime)
      if (prevDate) {
        if (!inSameInterval(thisDate, prevDate, 'YEAR')) {
          d.milestone = 'YEAR'
        } else if (!inSameInterval(thisDate, prevDate, 'MONTH')) {
          d.milestone = 'MONTH'
        }
        if (interval !== 'DAY') {
          if (!inSameInterval(thisDate, prevDate, 'DAY')) {
            d.milestone = 'DAY'
          }
        }
      }
      prevDate = thisDate
    })
    return data
  }

  addIdxAndSort(lists) {
    let postData = {}
    let symbols = Object.keys(lists)
    symbols.forEach((key) => {
      lists[key].forEach(q => {
        let time = (new Date(q[0])).toISOString()
        if (!(time in postData)) {
          postData[time] = {}
          symbols.forEach(s => {
            postData[time][s] = null
          })
        }
        postData[time][key] = q[1]
      })
    })

    let finalData = []
    Object
      .keys(postData)
      .sort((a, b) => {
        return Date.parse(a) - Date.parse(b)
      })
      .map((strtime, i) => {
        finalData.push({
          idx: i,
          strtime: strtime,
          ...postData[strtime]
        })
      })
    return finalData
  }
}


