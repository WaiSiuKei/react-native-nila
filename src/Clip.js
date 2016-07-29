import React from 'react'
import { ClipPath, Rect } from 'react-native-svg'

export default function Clip({width, height, id}) {
  return (
    <ClipPath id={id}>
      <Rect x="0" y="0" width={width} height={height}/>
    </ClipPath>
  )
}
