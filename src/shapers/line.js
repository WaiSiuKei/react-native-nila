export default function line(plotData, accessor, xScale, yScale) {
  let points = plotData
    .filter(d => accessor(d) !== null)
    .map(d => {
      let v = accessor(d)
      return {
        x: xScale(d.idx),
        y: yScale(v)
      }
    })

  return { points, stroke: "#4682B4" }
}
