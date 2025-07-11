"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

const Chart = ({ data, metric, metrics, height = 200, overlay = false, darkMode = true }) => {
  const svgRef = useRef()

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove() // Clear previous chart

    if (!data || data.length === 0) {
      svg
        .append("text")
        .attr("x", "50%")
        .attr("y", "50%")
        .attr("text-anchor", "middle")
        .text("No data available")
        .style("fill", darkMode ? "white" : "black")
        .style("font-size", "1rem")
      return
    }

    const margin = { top: 20, right: 30, bottom: 30, left: 40 }
    const width = svgRef.current.offsetWidth - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    const parseTime = d3.isoParse

    let filteredData = data.map((item) => ({
      ...item,
      timestamp: parseTime(item.timestamp),
    }))

    // Filter out data points with invalid timestamps
    filteredData = filteredData.filter((d) => d.timestamp !== null && !isNaN(d.timestamp))

    // If no valid data after filtering, show message and return
    if (filteredData.length === 0) {
      svg
        .append("text")
        .attr("x", "50%")
        .attr("y", "50%")
        .attr("text-anchor", "middle")
        .text("No valid data available")
        .style("fill", darkMode ? "white" : "black")
        .style("font-size", "1rem")
      return
    }

    // Calculate x domain safely
    let xDomain = d3.extent(filteredData, (d) => d.timestamp)
    if (!xDomain[0] || !xDomain[1] || isNaN(xDomain[0]) || isNaN(xDomain[1])) {
      // Provide fallback domain to prevent NaN
      const now = new Date()
      xDomain = [new Date(now.getTime() - 1000 * 60 * 60), now] // last 1 hour
    }

    const x = d3
      .scaleTime()
      .domain(xDomain)
      .range([0, width])

    const y = d3.scaleLinear().range([chartHeight, 0])

    let yAxisLabel = ""

    if (overlay) {
      // Overlay chart with multiple metrics
      const allValues = []
      metrics.forEach((m) => {
        allValues.push(...filteredData.map((d) => d[m.category]?.[m.key]).filter((value) => typeof value === "number"))
        if (yAxisLabel === "") {
          yAxisLabel = m.unit
        }
      })
      // Filter out invalid values before calculating min and max for overlay
      const allValuesFiltered = allValues.filter((v) => typeof v === "number" && !isNaN(v))
      const minOverlay = allValuesFiltered.length > 0 ? d3.min(allValuesFiltered) : 0
      const maxOverlay = allValuesFiltered.length > 0 ? d3.max(allValuesFiltered) : 1

      y.domain([minOverlay * 0.9, maxOverlay * 1.1])

      metrics.forEach((m) => {
        const line = d3
          .line()
          .x((d) => x(d.timestamp))
          .y((d) => {
            const value = d[m.category]?.[m.key]
            return typeof value === "number" ? y(value) : null
          })
          .defined((d) => {
            const value = d[m.category]?.[m.key]
            return typeof value === "number" && d.timestamp !== null && !isNaN(d.timestamp)
          })

        g.append("path")
          .datum(filteredData)
          .attr("fill", "none")
          .attr("stroke", m.color)
          .attr("stroke-width", 1.5)
          .attr("d", line)
      })
    } else if (metric) {
      // Single metric chart
      // Filter out invalid values before calculating min and max
      const values = filteredData
        .map((d) => d[metric.category]?.[metric.key])
        .filter((v) => typeof v === "number" && !isNaN(v))

      const minValue = values.length > 0 ? d3.min(values) : 0
      const maxValue = values.length > 0 ? d3.max(values) : 1

      y.domain([minValue * 0.9, maxValue * 1.1])
      yAxisLabel = metric.unit

      const line = d3
        .line()
        .x((d) => x(d.timestamp))
        .y((d) => {
          const value = d[metric.category]?.[metric.key]
          return typeof value === "number" ? y(value) : null
        })
          .defined((d) => {
            const value = d[metric.category]?.[metric.key]
            return typeof value === "number" && d.timestamp !== null && !isNaN(d.timestamp)
          })

      g.append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", metric.color)
        .attr("stroke-width", 1.5)
        .attr("d", line)
    }

    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)")
      .style("fill", darkMode ? "white" : "black")

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", darkMode ? "white" : "black")

    // Y axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left / 2)
      .attr("x", 0 - chartHeight / 2 - margin.top)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yAxisLabel)
      .style("fill", darkMode ? "white" : "black")
  }, [data, metric, metrics, height, overlay, darkMode])

  return <svg ref={svgRef} width="100%" height={height}></svg>
}

export default Chart
