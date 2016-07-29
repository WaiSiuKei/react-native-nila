import React, { Component } from 'react'
import { View } from 'react-native'
import Svg,{
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text,
  Use,
  Defs,
  Stop
  } from 'react-native-svg'

import Dimensions from 'Dimensions'


export const deviceW = Dimensions.get('window').width


import { perf, bench } from './data'
let config = { width: deviceW, height: 250 }
config.data = { perf, bench }
config.series = [{ name: 'perf' }, { name: 'bench' }]
import Chart from './Chart'

export default class Example extends Component {
  render() {
    return (
      <View style={{flex:1,flexDirection: 'column'}}>
        <Chart {...config}/>
      </View>
    )
  }
}
