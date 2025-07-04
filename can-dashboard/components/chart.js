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

    const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ")

    const filteredData = data.map((item) => ({
      ...item,
      timestamp: parseTime(item.timestamp),
    }))

    const x = d3
      .scaleTime()
      .domain(d3.extent(filteredData, (d) => d.timestamp))
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
      y.domain([d3.min(allValues, (v) => v) * 0.9, d3.max(allValues, (v) => v) * 1.1])

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
            return typeof value === "number"
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
      y.domain([
        d3.min(filteredData, (d) =>
          d[metric.category]?.[metric.key] !== undefined ? d[metric.category]?.[metric.key] : null,
        ) * 0.9,
        d3.max(filteredData, (d) =>
          d[metric.category]?.[metric.key] !== undefined ? d[metric.category]?.[metric.key] : null,
        ) * 1.1,
      ])
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
          return typeof value === "number"
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
