import DataProcessor from './DataProcessor'

import * as shapers  from './shapers'
import * as scale from './scale'

const yAxesWidth = 50
const xAxesHeight = 80

export default class ModelOperator {
  constructor({width, height}) {
    this.dataProcessor = new DataProcessor()
    this.init({ width, height })
  }

  init({width, height}) {
    this.updateDrawingSize({ width, height })
    this.updateYaxisSize()
    this.updateChartSize()
    this.updateXaxisSize()
  }

  getShape() {
    const { series, xAxis, yAxis } = this
    return { series, xAxis, yAxis }
  }

  updateDrawingSize({width, height}) {
    this.drawing = {
      width,
      height,
      boundLeft: 0,
      boundRight: width,
      boundTop: 0,
      boundBottom: height,
    }
  }

  processData(dataMap) {
    let dataList = this.dataProcessor.addIdxAndSort(dataMap)
    this.dataProcessor.addMilestone(dataList, 'DAY')
    this.data = dataList
  }

  processSeries(seriesList) {
    this.series = {}
    seriesList.forEach(s => {
      let { name } = s
      this.series[name] = s
    })
  }

  updateYaxisSize() {
    let { boundLeft, boundTop, boundBottom } = this.drawing
    let boundRight = boundLeft + yAxesWidth
    this.yAxis = {
      boundLeft,
      boundRight,
      boundTop,
      boundBottom,
      width: boundRight - boundLeft,
      height: boundBottom - boundTop
    }
  }

  updateChartSize() {
    let {boundLeft, boundTop, boundRight, boundBottom:bottom } = this.drawing
    let boundBottom = bottom - xAxesHeight
    this.chart = {
      boundLeft,
      boundRight,
      boundTop,
      boundBottom: bottom - xAxesHeight,
      width: boundRight - boundLeft,
      height: boundBottom - boundTop
    }
  }

  updateXaxisSize() {
    let {  boundLeft, boundRight, boundBottom } = this.drawing
    let boundTop = boundBottom - xAxesHeight
    this.xAxis = {
      boundLeft,
      boundRight,
      boundTop: boundBottom - xAxesHeight,
      boundBottom,
      width: boundRight - boundLeft,
      height: boundBottom - boundTop
    }
  }

  updateXscale() {
    const { boundLeft, boundRight } = this.xAxis
    let range, domain
    range = [boundLeft, boundRight]
    let mainDataLen = this.data.length
    domain = [-0.5, mainDataLen - 0.5]
    this.xScale = scale.linear().range(range).domain(domain)
  }

  updateYscale() {
    const { boundTop, boundBottom } = this.chart
    let min = null, max = null
    Object.keys(this.series)
      .forEach(name => {
        this.data.forEach(d => {
          if (d.hasOwnProperty(name) && Number.isFinite(d[name])) {
            let v = d[name]
            min = min === null ? v : Math.min(min, v)
            max = max === null ? v : Math.max(max, v)
          }
        })
      })
    this.yScale = scale.linear().range([boundBottom, boundTop]).domain([min, max])
  }

  updateShapeData() {
    Object
      .keys(this.series)
      .forEach(name => {
        let accessor = d => d[name]
        this.series[name].shape = shapers.line(this.data, accessor, this.xScale, this.yScale, this.unitWidth)
      })
    this.xAxis.shape = shapers.timeAxis({
      interval: 'DAY',
      orient: 'bottom',
      extent: [this.xAxis.boundLeft, this.xAxis.boundRight],
      gridExtent: [this.drawing.boundTop, this.xAxis.boundTop],
      transform: [this.xAxis.boundLeft, this.xAxis.boundTop]
    }, this.xScale, this.data)
    this.yAxis.shape = shapers.axis({
      orient: 'right',
      extent: [this.yAxis.boundBottom, this.yAxis.boundTop],
      gridExtent: [this.chart.boundLeft, this.chart.boundRight],
      transform: [this.yAxis.boundLeft, this.yAxis.boundTop],
      tickFormat: d => (d * 100).toFixed(d > 1000 ? 0 : 2) + '%',
    }, this.yScale)
  }
}
