import React, { PropTypes, Component } from "react"
import d3 from "d3"

import wrap from "./wrap"

class Line extends Component {
  static propTypes = {
    xScale: PropTypes.func.isRequired,
    yScale: PropTypes.func.isRequired,
    xAccessor: PropTypes.func.isRequired,
    yAccessor: PropTypes.func.isRequired,
    plotData: PropTypes.array.isRequired,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    fill: PropTypes.string,
  }

  static defaultProps = {
    fill: "none",
    stroke: "black",
    strokeWidth: 1,
    defined: d => !isNaN(d),
  }

  static getPath(props) {
    var { plotData, xScale, yScale, xAccessor, yAccessor, defined } = props

    var dataSeries = d3.svg.line()
      .defined(d => defined(yAccessor(d)))
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))
    return dataSeries(plotData)
  }

  render() {
    var { stroke, strokeWidth, fill } = this.props

    return <path d={Line.getPath(this.props)} stroke={stroke} strokeWidth={strokeWidth} fill={fill}/>
  }
}

export default wrap(Line)
