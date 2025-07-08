"use client"

import { useState, useRef } from "react"
import { useData } from "./data-context"
import Chart from "./chart"
import CustomDropdown from "./custom-dropdown"

export default function GraphContainer({ mode, fullView = false, darkMode = true }) {
  const { history } = useData()
  const [selectedGraphs, setSelectedGraphs] = useState([])
  const [quadSelection, setQuadSelection] = useState(["DcBusVolt", "MtrSpd", "AcCurrMeaRms", "MtrTemp"])

  // Refs to hold canvas elements for PDF export
  const individualCanvasRefs = useRef([])
  const overlayCanvasRef = useRef(null)
  const quadCanvasRefs = useRef([])

  const allMetrics = [
    // Temperature metrics (0x616) - ALL 4 attributes
    { key: "CtlrTemp1", label: "Controller Temp 1", category: "temp616", color: "#3b82f6", unit: "°C" },
    { key: "CtlrTemp2", label: "Controller Temp 2", category: "temp616", color: "#1d4ed8", unit: "°C" },
    { key: "CtlrTemp", label: "Controller Temp Avg", category: "temp616", color: "#2563eb", unit: "°C" },
    { key: "MtrTemp", label: "Motor Temperature", category: "temp616", color: "#ef4444", unit: "°C" },

    // Measurement metrics (0x617) - ALL 5 attributes
    { key: "AcCurrMeaRms", label: "AC Current RMS", category: "measurement617", color: "#22c55e", unit: "A" },
    { key: "DcCurrEstd", label: "DC Current Est", category: "measurement617", color: "#16a34a", unit: "A" },
    { key: "DcBusVolt", label: "DC Bus Voltage", category: "measurement617", color: "#f59e0b", unit: "V" },
    { key: "MtrSpd", label: "Motor Speed", category: "measurement617", color: "#8b5cf6", unit: "RPM" },
    { key: "ThrotVolt", label: "Throttle Voltage", category: "measurement617", color: "#06b6d4", unit: "V" },

    // Status metrics (0x615) - Key boolean values as numeric for graphing
    { key: "LimpHomeMode", label: "Limp Home Mode", category: "status615", color: "#ef4444", unit: "" },
    { key: "EcoBoost", label: "Eco Mode", category: "status615", color: "#22c55e", unit: "" },
    { key: "RegenMode", label: "Regen Mode", category: "status615", color: "#8b5cf6", unit: "" },
    { key: "Forward", label: "Forward Gear", category: "status615", color: "#22c55e", unit: "" },
    { key: "Reverse", label: "Reverse Gear", category: "status615", color: "#f59e0b", unit: "" },
    { key: "Brake", label: "Brake Status", category: "status615", color: "#ef4444", unit: "" },
  ]

  const toggleGraphSelection = (metric) => {
    setSelectedGraphs((prev) => (prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]))
  }

  const updateQuadSelection = (index, metric) => {
    setQuadSelection((prev) => {
      const updated = [...prev]
      updated[index] = metric
      return updated
    })
  }

  if (mode === "individual" || fullView) {
    return (
      <div className="graph-container">
        <div className={`graphs-grid ${fullView ? "full-view" : ""}`}>
          {allMetrics.map((metric, index) => (
            <div key={metric.key} className="graph-card">
              <Chart
                data={history}
                metric={metric}
                height={fullView ? 300 : 170}
                darkMode={darkMode}
                ref={(el) => (individualCanvasRefs.current[index] = el?.canvasRef?.current)}
              />
            </div>
          ))}
        </div>

        <style jsx>{`
          .graph-container {
          margin-top: 0.5rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }

          .download-pdf-btn {
          }

          .download-pdf-btn:hover {
          }

          .graphs-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            max-width: 960px;
            margin: 0 auto;
          }

          .graphs-grid.full-view {
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
          }

          .graph-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 4px solid rgba(34, 197, 94, 0.2);
            border-radius: 16px;
            padding: 1rem;
            transition: all 0.3s ease;
          }

          .graph-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 35px rgba(34, 197, 94, 0.2);
            border-color: rgba(34, 197, 94, 0.4);
          }

          @media (max-width: 768px) {
            .graphs-grid {
              grid-template-columns: 1fr;
            }
            
            .graph-card {
              padding: 1rem;
            }
          }

          @media (max-width: 480px) {
            .graphs-grid {
              grid-template-columns: 1fr;
          gap: 0.5rem;
          }

            .graph-card {
              padding: 0.75rem;
            }
          }
        `}</style>
      </div>
    )
  }

  if (mode === "overlay") {
    return (
      <div className="overlay-container">
        <div className="metric-selector">
          <h4>Select metrics to overlay:</h4>
          <div className="metric-buttons">
            {allMetrics.map((metric) => (
              <button
                key={metric.key}
                className={`metric-btn ${selectedGraphs.includes(metric.key) ? "selected" : ""}`}
                onClick={() => toggleGraphSelection(metric.key)}
                style={{ "--metric-color": metric.color }}
              >
                {metric.label}
              </button>
            ))}
          </div>
        </div>

        {selectedGraphs.length > 0 && (
          <div className="overlay-chart">
            <Chart
              data={history}
              metrics={allMetrics.filter((m) => selectedGraphs.includes(m.key))}
              height={400}
              overlay={true}
              darkMode={darkMode}
              ref={overlayCanvasRef}
            />
          </div>
        )}

        <style jsx>{`
          .overlay-container {
          margin-top: 0.5rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }

          .download-pdf-btn {
            background-color: #22c55e;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            margin-bottom: 1rem;
            transition: background-color 0.3s ease;
          }

          .download-pdf-btn:hover {
            background-color: #16a34a;
          }

          .metric-selector {
            margin-bottom: 2rem;
          }

          .metric-selector h4 {
            margin-bottom: 1rem;
            color: #22c55e;
            font-size: 1.1rem;
          }

          .metric-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
            margin: 0.25rem 0;
          }

          .metric-btn {
            padding: 0.5rem 1rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            color: inherit;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            font-family: inherit;
          }

          .metric-btn:hover {
            background: rgba(var(--metric-color), 0.1);
            border-color: var(--metric-color);
          }

          .metric-btn.selected {
            background: var(--metric-color);
            color: white;
            border-color: var(--metric-color);
          }

          .overlay-chart {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: 16px;
            padding: 1.5rem;
          }

          @media (max-width: 768px) {
            .metric-buttons {
              gap: 0.25rem;
            }
            
            .metric-btn {
              padding: 0.4rem 0.8rem;
              font-size: 0.8rem;
            }
          }

          @media (max-width: 480px) {
            .metric-buttons {
              gap: 0.15rem;
            }

            .metric-btn {
              padding: 0.3rem 0.6rem;
              font-size: 0.75rem;
            }
          }
        `}</style>
      </div>
    )
  }

  if (mode === "quad") {
    return (
      <div className="quad-container">
        <div className="quad-selectors">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="quad-selector">
              <CustomDropdown
                options={allMetrics.map((metric) => ({ value: metric.key, label: metric.label }))}
                value={quadSelection[index]}
                onChange={(value) => updateQuadSelection(index, value)}
                label={`Graph ${index + 1}:`}
                darkMode={darkMode}
              />
            </div>
          ))}
        </div>

        <div className="quad-grid">
          {quadSelection.map((metricKey, index) => {
            const metric = allMetrics.find((m) => m.key === metricKey)
            return (
              <div key={index} className="quad-chart">
                <Chart
                  data={history}
                  metric={metric}
          height={120}
                  darkMode={darkMode}
                  ref={(el) => (quadCanvasRefs.current[index] = el?.canvasRef?.current)}
                />
              </div>
            )
          })}
        </div>

        <style jsx>{`
          .quad-container {
          margin-top: 0.5rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          max-height: 80vh;
          overflow-y: auto;
          }

          .download-pdf-btn {
            background-color: #22c55e;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            margin-bottom: 1rem;
            transition: background-color 0.3s ease;
          }

          .download-pdf-btn:hover {
            background-color: #16a34a;
          }

          .quad-selectors {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0.5rem;
            margin-bottom: 1rem;
          }

          .quad-selector {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .quad-selector label {
            font-weight: 600;
            color: #22c55e;
            font-size: 0.9rem;
          }

          .quad-selector select {
            padding: 0.25rem 0.5rem;
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            color: inherit;
            font-size: 0.9rem;
            font-family: inherit;
          }

          .quad-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          }

          .quad-chart {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: 16px;
            padding: 0.5rem;
          }

          @media (max-width: 768px) {
            .quad-grid {
              grid-template-columns: 1fr;
            }
            
            .quad-selectors {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          .quad-container {
            max-width: 100vw;
            overflow-x: hidden;
          }

          @media (max-width: 480px) {
            .quad-selectors {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    )
  }

  return null
}
