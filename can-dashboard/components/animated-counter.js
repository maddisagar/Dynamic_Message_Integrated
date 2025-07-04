"use client"

import { useEffect, useState } from "react"

export default function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = parseInt(value, 10)
    if (start === end) return

    let totalDuration = 1000
    let incrementTime = 50
    let steps = Math.ceil(totalDuration / incrementTime)
    let increment = (end - start) / steps
    let currentCount = start
    const timer = setInterval(() => {
      currentCount += increment
      if (currentCount >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(currentCount))
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [value])

  return <span>{count}</span>
}
