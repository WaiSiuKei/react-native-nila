import React, { PropTypes, Component } from "react"
import { G, Polyline, Line, Text } from 'react-native-svg'


export default function Axis({ticks, domain}) {
  const { grids, transform } = ticks
  return (
    <G>
      <Grid grids={grids}/>
      <AxisLine domain={domain}/>
      <AxisTicks {...ticks}/>
    </G>
  )
}

function AxisLine({domain}) {
  const { x1, x2, y1, y2 } = domain
  return (
    <Polyline
      points={`${x1},${y1} ${x2},${y2}`}
      fill="none"
      stroke={'#333333'}
      strokeWidth="1"/>
  )
}

function AxisTicks({  labels,
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
  fill,
  stroke }) {

  return (
    <G>
      {labels.map((tick, idx) => {
        let { origin, value } = tick
        return (
          <Tick key={idx}
                origin={origin}
                x={x}
                y={y}
                x2={x2}
                y2={y2}
                transform={transform}
                canvas_dy={canvas_dy}
                fontSize={fontSize}
                textAlign={textAlign}
                value={value}/>
        )
      })}
    </G>
  )
}

function Tick({origin, x, y, x2, y2, textAlign, fontSize, transform, value, bold, canvas_dy}) {
  return (
    <G>
      <Line
        x1={transform[0]+origin[0]}
        y1={transform[1]+origin[1]}
        x2={transform[0]+origin[0] + x2}
        y2={transform[1]+origin[1] + y2}
        stroke="black"
        strokeWidth="2"
        />
      <Text
        fill="purple"
        stroke="none"
        fontSize={fontSize}
        fontWeight="normal"
        x={transform[0]+origin[0] + x}
        y={transform[1]+origin[1] + y - canvas_dy}
        textAnchor={textAlign}
        >{value}</Text>
    </G>
  )
}

function Grid({grids}) {
  return (
    <G>{
      grids.map((g, i) => {
        let { x1, x2, y1, y2 } = g
        return (
          <Polyline
            key={i}
            points={`${x1},${y1} ${x2},${y2}`}
            fill="none"
            stroke="#BBB"
            strokeWidth="1"/>
        )
      })
    }
    </G>
  )
}
