"use client"

import React from "react"

export default function CompactThermometer({ value, max, width = 40, height = 120, color = "#ef4444" }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const tubeHeight = height - width
  const fillHeight = (percentage / 100) * tubeHeight

  return (
    <div style={{ width: width + 20, height: height, userSelect: "none" }}>
      <svg width={width + 20} height={height} viewBox={`0 0 ${width + 20} ${height}`}>
        {/* Bulb */}
        <circle
          cx={width / 2 + 10}
          cy={height - width / 2}
          r={width / 2}
          fill="#eee"
          stroke="#333"
          strokeWidth="2"
        />
        {/* Tube outline */}
        <rect
          x={10}
          y={0}
          width={width}
          height={tubeHeight}
          rx={width / 2}
          ry={width / 2}
          fill="none"
          stroke="#333"
          strokeWidth="2"
        />
        {/* Fill */}
        <rect
          x={10}
          y={tubeHeight - fillHeight}
          width={width}
          height={fillHeight}
          rx={width / 2}
          ry={width / 2}
          fill={color}
        />
      </svg>
    </div>
  )
}
