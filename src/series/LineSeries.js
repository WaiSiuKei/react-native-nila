import React, { PropTypes, Component } from "react"
import Line from "./Line"

import wrap from "./wrap"

class LineSeries extends Component {
  static propTypes = {
    strokeWidth: PropTypes.number,
  }

  static defaultProps = {
    stroke: "#4682B4",
    strokeWidth: 1,
  }

  render() {
    var { props } = this
    let { xScale, yScale, xAccessor, yAccessor, plotData, stroke, strokeWidth, type } = props
    return (
      <Line
        xScale={xScale}
        yScale={yScale}
        xAccessor={xAccessor} yAccessor={yAccessor}
        plotData={plotData}
        stroke={stroke} fill="none"
        strokeWidth={strokeWidth}/>
    )
  }
}

export default wrap(LineSeries)
