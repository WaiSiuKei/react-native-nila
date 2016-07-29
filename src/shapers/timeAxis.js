import { last, isNotDefined, dateFormat } from '../utils'

const defaultProps = {
  shapeRendering: "crispEdges",
  outerTickSize: 6,
  fill: "none",
  stroke: "#000000",
  strokeWidth: 1,
  opacity: 1,
  ticks: [5],
  tickFormat: (d) =>dateFormat(d, 'HH:MM:ss'),
  innerTickSize: 5,
  tickPadding: 6,
  tickStroke: "#000",
  tickStrokeOpacity: 1,
  showDomain: true,
  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
  fontSize: 12,
  showGrid: false,
  showTicks: true,
}

const intervalToReplace = {
  'HOUR': ['DAY', 'MONTH', 'YEAR'],
  'DAY': ['MONTH', 'YEAR'],
  'MINUTE': ['HOUR', 'DAY', 'MONTH', 'YEAR']
}

const chineseMonths = {
  '01': '一',
  '02': '二',
  '03': '三',
  '04': '四',
  '05': '五',
  '06': '六',
  '07': '七',
  '08': '八',
  '09': '九',
  '10': '十',
  '11': '十一',
  '12': '十二',
}

const tickFormats = {
  'HOUR':  (d) =>dateFormat(d, 'HH:MM'),
  'DAY': (d) =>dateFormat(d, 'd'),
  'MONTH': (d) => dateFormat(d, 'mmm'),
  'MINUTE': (d) =>dateFormat(d, 'HH:MM'),
  'YEAR': (d) =>dateFormat(d, 'yyyy'),
}

function d3_scaleExtent(domain) {
  var start = domain[0], stop = domain[domain.length - 1]
  return start < stop ? [start, stop] : [stop, start]
}

function d3_scaleRange(scale) {
  return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range())
}

function tickTransform_svg_axisX(scale, tick) {
  return [scale(tick), 0];
}

function markMilestone(candinates, arr, interval) {
  if (!candinates) return []
  let len = candinates.length
  if (!len) return []
  if (len < 3) {
    return candinates
  }
  else {
    let res = []
    res.push(candinates[0])
    for (let i = 2; i < len; i++) {
      let mid = candinates[i - 1]
      let right = candinates[i]
      let { milestone: l,arrayIndex:li  } = res[res.length - 1]
      let { milestone: m } = mid
      let { milestone: r, arrayIndex:ri } = right
      if (l || m || r) {
        res.push(mid)
      } else {
        let replace
        for (let j = li; j < ri; j++) {
          let d = arr[j]
          let { milestone } = d
          if (milestone && intervalToReplace[interval].indexOf(milestone) > -1) {
            if (!replace)replace = d
            else {
              let prevM = intervalToReplace[interval].indexOf(replace.milestone)
              let thisM = intervalToReplace[interval].indexOf(milestone)
              if (thisM > prevM)replace = d
            }
          }
        }
        if (replace)res.push(replace)
        else res.push(mid)
      }
    }
    res.push(candinates[len - 1])
    return res
  }
}


function getTicks(props, scale, plotData) {
  props = Object.assign({}, defaultProps, props)
  let { orient, innerTickSize, tickFormat, tickPadding, fontSize, interval } = props
  let { ticks: tickArguments, tickValues, transform, extent, gridExtent } = props

  let ticks = scale.ticks(tickArguments)

  let candinates = []
  let dIdxs = plotData.map(d => d.idx)

  ticks.forEach(t => {
    if (Number.isInteger(t)) {
      let i = dIdxs.indexOf(t)
      if (i > -1) {
        candinates.push({ ...plotData[i], arrayIndex: i })
      }
    }
  })

  candinates = markMilestone(candinates, plotData, interval)

  let sign = orient === "top" || orient === "left" ? -1 : 1
  let tickSpacing = Math.max(innerTickSize, 0) + tickPadding

  let tickTransform, x, y, x2, y2, dy, canvas_dy, textBaseline, textAlign
  let grids = []
  tickTransform = tickTransform_svg_axisX
  x2 = 0
  y2 = sign * innerTickSize
  x = 0
  y = sign * tickSpacing
  dy = sign < 0 ? "0em" : ".71em"
  canvas_dy = 0
  textBaseline = "bottom"
  textAlign = 'middle'

  candinates = candinates.map(d => {
    let { milestone } = d
    return {
      value: tickFormats[(milestone || interval)](new Date(d.strtime)),
      origin: tickTransform(scale, d.idx),
      bold: !!milestone,
    }
  })


  candinates.forEach(t => {
    let { origin } = t
    let [ x, y ] = origin
    let [ start, end ] = gridExtent
    grids.push({ x1: x, x2: x, y1: start, y2: end })
  })

  return {
    labels: candinates,
    grids,
    dy,
    canvas_dy,
    x,
    y,
    x2,
    y2,
    textBaseline,
    textAlign,
    fontSize,
    transform,
    stroke: '#555555',
    fill: '#555555',
  }
}

function getDomain(props) {
  props = Object.assign({}, defaultProps, props)
  var { transform, extent, orient } = props
  let [x1, y1] = transform
  let [start, end] = extent
  let x2, y2
  x1 = x1
  y1 = y1
  x2 = end
  y2 = y1
  return { x1, y1, x2, y2 }
}

export default function (props, scale, plotData = []) {
  let ticks = getTicks(props, scale, plotData)
  let domain = getDomain(props)
  return { ticks, domain }
}
