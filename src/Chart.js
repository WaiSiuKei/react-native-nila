import React, { PropTypes, Component } from "react"
import Svg, { G, Defs, Polyline } from 'react-native-svg'
import ModelOperator from './ModelOperator'
import Clip from './Clip'
import { Axis } from './axes'

export default class Chart extends Component {
  static propTypes = {
    width: PropTypes.number/*.isRequired*/,
    height: PropTypes.number/*.isRequired*/,
    series: PropTypes.array/*.isRequired*/,
    data: PropTypes.object/*.isRequired*/,
  }

  constructor(props) {
    super(props)
    const { width, height } = this.props
    this.modelOperator = new ModelOperator({ width, height })
  }

  getShape() {
    const { height, width, series: seriesIn, data } = this.props
    this.modelOperator.processSeries(seriesIn)
    this.modelOperator.processData(data)
    this.modelOperator.updateXscale()
    this.modelOperator.updateYscale()
    this.modelOperator.updateShapeData()
    return this.modelOperator.getShape()
  }

  renderSeries(series) {
    let names = Object.keys(series)
    return names.map(n => {
      let { shape } = series[n]
      let { points, stroke } = shape
      let p = points.map(p =>`${p.x},${p.y}`).join(' ')
      return (
        <Polyline
          key={n}
          points={p}
          fill="none"
          stroke={stroke}
          strokeWidth="2"/>
      )
    })
  }

  render() {
    const { width, height } = this.props
    let { series, xAxis, yAxis } = this.getShape()
    return (
      <Svg width={width} height={height}>

        <G >
          {this.renderSeries(series)}
          <Axis {...xAxis.shape}/>
          <Axis {...yAxis.shape}/>
        </G>
      </Svg>
    )
  }
}
