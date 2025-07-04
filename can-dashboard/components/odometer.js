"use client"

import React from "react"
import AnimatedCounter from "./animated-counter"

export default function Odometer({ value, max, unit, color }) {
  // Calculate the rotation angle for the needle based on value and max
  const angle = Math.min(180, (value / max) * 180) // 0 to 180 degrees

  return (
    <div style={{ width: "150px", height: "80px", position: "relative", margin: "0 auto" }}>
      <svg
        viewBox="0 0 150 80"
        width="150"
        height="80"
        style={{ display: "block", margin: "0 auto" }}
      >
        {/* Semi-circle gauge background */}
        <path
          d="M 10 70 A 65 65 0 0 1 140 70"
          fill="none"
          stroke="#eee"
          strokeWidth="10"
        />
        {/* Colored arc representing the value */}
        <path
          d="M 10 70 A 65 65 0 0 1 140 70"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${(value / max) * 204} 204`}
          strokeLinecap="round"
        />
        {/* Needle */}
        <line
          x1="75"
          y1="70"
          x2={75 + 65 * Math.cos(Math.PI - (angle * Math.PI) / 180)}
          y2={70 - 65 * Math.sin(Math.PI - (angle * Math.PI) / 180)}
          stroke="#333"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ transition: "all 0.5s ease" }}
        />
        {/* Center circle */}
        <circle cx="75" cy="70" r="6" fill="#333" />
      </svg>
      {/* Numeric value with animated counter */}
      {/*
      <div
        style={{
          position: "absolute",
          width: "100%",
          top: "10px",
          textAlign: "center",
          fontWeight: "700",
          fontSize: "1.5rem",
          color: color,
          userSelect: "none",
        }}
      >
        <AnimatedCounter value={value} /> <span style={{ fontSize: "1rem" }}>{unit}</span>
      </div>
      */}
    </div>
  )
}
