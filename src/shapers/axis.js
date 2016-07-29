import { last, isNotDefined, dateFormat } from '../utils'
const defaultProps = {
  shapeRendering: "crispEdges",
  outerTickSize: 6,
  fill: "none",
  stroke: "#000000",
  strokeWidth: 1,
  opacity: 1,
  ticks: [3],
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
function d3_scaleExtent(domain) {
  var start = domain[0], stop = domain[domain.length - 1]
  return start < stop ? [start, stop] : [stop, start]
}

function d3_scaleRange(scale) {
  return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range())
}


function tickTransform_svg_axisX(scale, tick) {
  return [~~(0.5 + scale(tick)), 0];
}

function tickTransform_svg_axisY(scale, tick) {
  return [0, ~~(0.5 + scale(tick))];
}

function getTicks(props, scale, plotData) {
  props = Object.assign({}, defaultProps, props)
  let { orient, innerTickSize, tickFormat, tickPadding, fontSize } = props
  let { ticks: tickArguments, tickValues, transform, extent, gridExtent } = props
  let isXAxis = (orient === "bottom" || orient === "top")

  let ticks = scale.ticks(tickArguments)

  let dataContexts = []
  let dIdxs = plotData.map(d => d.idx)

  ticks.forEach(t => {
    if (isXAxis && Number.isInteger(t)) {
      let dIdx = dIdxs.indexOf(t)
      if (dIdx > -1) {
        dataContexts.push(plotData[dIdx])
      }
    } else {
      dataContexts.push(t)
    }
  })
  let sign = orient === "top" || orient === "left" ? -1 : 1
  let tickSpacing = Math.max(innerTickSize, 0) + tickPadding

  let tickTransform, x, y, x2, y2, dy, canvas_dy, textBaseline, textAlign
  let grids = []
  if (orient === "bottom" || orient === "top") {
    tickTransform = tickTransform_svg_axisX
    x2 = 0
    y2 = sign * innerTickSize
    x = 0
    y = sign * tickSpacing
    dy = sign < 0 ? "0em" : ".71em"
    canvas_dy = sign < 0 ? 0 : (fontSize * .71)
    textAlign = "center"
    textBaseline = "top"

  } else {
    tickTransform = tickTransform_svg_axisY
    x2 = sign * innerTickSize
    y2 = 0
    x = sign * tickSpacing
    y = 0
    dy = ".32em"
    canvas_dy = fontSize / 2
    textAlign = sign < 0 ? "end" : "start"
    textBaseline = "alphabetic"
  }
  dataContexts = dataContexts.map(d => {
    if (isXAxis) {
      return {
        value: tickFormat(new Date(d.strtime)),
        origin: tickTransform(scale, d.idx)
      }
    } else {
      return {
        value: tickFormat(d),
        origin: tickTransform(scale, d)
      }
    }
  })


  dataContexts.forEach(t => {
    let { origin } = t
    let [ x, y ] = origin
    let [ start, end ] = gridExtent
    if (isXAxis) {
      grids.push({ x1: x, x2: x, y1: start, y2: end })
    } else {
      grids.push({ y1: y, y2: y, x1: start, x2: end })
    }
  })

  return {
    labels: dataContexts,
    grids,
    dy,
    canvas_dy,
    x,
    y,
    x2,
    y2,
    textAlign,
    textBaseline,
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
  x1 = x1
  y1 = y1
  start = start
  end = end
  let x2, y2
  if (orient === "bottom" || orient === "top") {
    y2 = y1
    x2 = end
  } else {
    x2 = x1
    y2 = start
  }
  return { x1, y1, x2, y2 }
}

export default function (props, scale, plotData = []) {
  let ticks = getTicks(props, scale, plotData)
  let domain = getDomain(props)
  return { ticks, domain }
}
