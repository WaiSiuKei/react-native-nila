import React, { PropTypes, Component } from "react"

export default function wrap(WrappedSeries) {
  class BaseCanvasSeries extends Component {
    static defaultProps = Object.assing({}, WrappedSeries.defaultProps, { clip: true })

    static propTypes = {
      chartConfig: PropTypes.object,
      clip: PropTypes.bool.isRequired,
    }
    static contextTypes = {
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      chartId: PropTypes.number.isRequired,
      // seriesId: PropTypes.number.isRequired,
      // stroke: PropTypes.string,
      // fill: PropTypes.string,
      chartConfig: PropTypes.object.isRequired,
      xScale: PropTypes.func.isRequired,
      // yScale: PropTypes.func.isRequired,
      xAccessor: PropTypes.func.isRequired,
      plotData: PropTypes.array.isRequired,
    }

    render() {
      var { clip, chartConfig } = this.props

      var style = clip ? { "clipPath": "url(#chart-area-clip)" } : null

      return (
        <g style={style}>
          <WrappedSeries ref="wrappedSeries"
                         yScale={chartConfig.yScale}
            {...this.props} />
        </g>
      )
    }
  }
  return BaseCanvasSeries
}
