"use client"

import { useData } from "./data-context"
import { TrendingUp, TrendingDown, Minus, Gauge, Zap, Activity } from "lucide-react"
import Odometer from "./odometer"


export default function PerformanceMetrics() {
  const { currentData, history, alerts } = useData()

  if (!currentData.measurement617 || !currentData.temp616) return null

  const criticalCount = alerts.filter((alert) => alert.type === "critical").length
  const warningCount = alerts.filter((alert) => alert.type === "warning").length
  const infoCount = alerts.filter((alert) => alert.type === "info").length

  // Calculate healthy sensor ratio
  const sensorHealthKeys = Object.keys(currentData.status615).filter((key) =>
    key.startsWith("SnsrHealthStatus")
  )
  const totalSensors = sensorHealthKeys.length
  const healthySensors = sensorHealthKeys.filter((key) => currentData.status615[key]).length

  const calculateTrend = (key, category) => {
    if (history.length < 2) return 0

    const recent = history.slice(-5)
    const values = recent.map((item) => (item[category] ? item[category][key] : 0))

    if (values.length < 2) return 0

    const firstValue = values[0]
    const lastValue = values[values.length - 1]

    return ((lastValue - firstValue) / firstValue) * 100
  }

  const getEfficiencyScore = () => {
    const motorTemp = currentData.temp616.MtrTemp
    const voltage = currentData.measurement617.DcBusVolt
    const current = currentData.measurement617.AcCurrMeaRms
    const speed = currentData.measurement617.Mtrspd

    let score = 100

    // Temperature efficiency
    if (motorTemp > 60) score -= 20
    else if (motorTemp > 40) score -= 10

    // Voltage efficiency
    if (voltage < 300 || voltage > 400) score -= 15

    // Current efficiency
    if (current > 70) score -= 15

    // Speed efficiency
    if (speed > 2500) score -= 10

    return Math.max(0, score)
  }

  const getPowerConsumption = () => {
    const voltage = currentData.measurement617.DcBusVolt
    const current = currentData.measurement617.DcCurrEstd
    return (voltage * current) / 1000 // kW
  }

  const metrics = [
    {
      title: "Motor Speed",
      value: currentData.measurement617.Mtrspd,
      unit: "RPM",
      trend: calculateTrend("Mtrspd", "measurement617"),
      icon: Gauge,
      color: "#8b5cf6",
      max: 3000,
    },
    {
      title: "DC Bus Voltage",
      value: currentData.measurement617.DcBusVolt,
      unit: "V",
      trend: calculateTrend("DcBusVolt", "measurement617"),
      icon: Zap,
      color: "#FFD700",
      max: 500,
    },
    {
      title: "AC Current RMS",
      value: currentData.measurement617.AcCurrMeaRms,
      unit: "A",
      trend: calculateTrend("AcCurrMeaRms", "measurement617"),
      icon: Activity,
      color: "#22c550",
      max: 100,
    },
    {
      title: "Motor Temperature",
      value: currentData.temp616.MtrTemp,
      unit: "°C",
      trend: calculateTrend("MtrTemp", "temp616"),
      icon: Gauge,
      color: "#ef4444",
      max: 100,
    },
  ]

  const getTrendIcon = (trend) => {
    if (trend > 1) return TrendingUp
    if (trend < -1) return TrendingDown
    return Minus
  }

  const getTrendColor = (trend) => {
    if (trend > 1) return "#22c55e"
    if (trend < -1) return "#ef4444"
    return "#6b7280"
  }

  const efficiencyScore = getEfficiencyScore()
  const powerConsumption = getPowerConsumption()

  return (
    <div className="performance-metrics">
      <div className="metrics-header">
        <h3>Performance Metrics</h3>
        <div className="overall-stats">
          <div className="stat-item">
            <span className="stat-label">Efficiency</span>
            <span
              className={`stat-value ${efficiencyScore > 80 ? "good" : efficiencyScore > 60 ? "warning" : "critical"}`}
            >
              {efficiencyScore.toFixed(0)}%
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Power</span>
            <span className="stat-value">{powerConsumption.toFixed(2)} kW</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Critical</span>
            {criticalCount > 0 ? (
              <span className="stat-value critical">{criticalCount}</span>
            ) : (
              <span className="stat-value">0</span>
            )}
          </div>
          <div className="stat-item">
            <span className="stat-label">Warning</span>
            {warningCount > 0 ? (
              <span className="stat-value warning">{warningCount}</span>
            ) : (
              <span className="stat-value">0</span>
            )}
          </div>
          <div className="stat-item">
            <span className="stat-label">Info</span>
            {infoCount > 0 ? (
              <span className="stat-value info">{infoCount}</span>
            ) : (
              <span className="stat-value">0</span>
            )}
          </div>
          <div className="stat-item">
            <span className="stat-label">Healthy Sensors</span>
            <span className="stat-value good">{healthySensors}/{totalSensors} Healthy</span>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric) => {
          const TrendIcon = getTrendIcon(metric.trend)
          const trendColor = getTrendColor(metric.trend)
          const IconComponent = metric.icon
          // const percentage = (metric.value / metric.max) * 100

          return (
            <div key={metric.title} className="metric-card">
              <div className="metric-header">
                <div className="metric-icon" style={{ color: metric.color }}>
                  <IconComponent size={20} />
                </div>
                <div className="metric-trend" style={{ color: trendColor }}>
                  <TrendIcon size={16} />
                  <span>{(Math.abs(metric.trend) ?? 0).toFixed(1)}%</span>
                </div>
              </div>

              <div className="metric-content">
                <h4>{metric.title}</h4>
                <div className="metric-value">
                  <span className="value">{(metric.value ?? 0).toFixed(1)}</span>
                  <span className="unit">{metric.unit}</span>
                </div>

                <>
                  <div style={{ display: "flex", justifyContent: metric.title === "Motor Temperature" ? "flex-end" : "center", marginTop: "0.1rem" }}>
<Odometer
  value={metric.value ?? 0}
  max={metric.max}
  unit={metric.unit}
  color={metric.color}
/>
                  </div>
                </>

                {/* Removed metric-range as odometer shows range visually */}
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .performance-metrics {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 3px solid #495e70;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .metrics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .metrics-header h3 {
          margin: 0;
          color: #22c55e;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .overall-stats {
          display: flex;
          gap: 2rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .stat-label {
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .stat-value {
          font-size: 1.2rem;
          font-weight: 700;
        }

        .stat-value.good {
          color: #22c55e;
        }

        .stat-value.warning {
          color: #f59e0b;
        }

        .stat-value.critical {
          color: #ef4444;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          align-items: stretch;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.03);
          border: 3px solid #C0C1EF;
          border-radius: 12px;
          padding: 0.5rem 0.75rem; /* reduced padding to resize box and remove spacing */
          transition: all 0.3s ease;
          /* Removed fixed min-height to allow flexible height */
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(34, 197, 94, 0.15);
          border-color: rgba(34, 197, 94, 0.3);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .metric-icon {
          padding: 0.5rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .metric-content h4 {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          opacity: 0.8;
          min-height: 1.2rem; /* Added to align all attribute names */
          display: flex;
          align-items: center;
          height: 1.2rem;
        }

        .metric-value {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .metric-value .value {
          font-size: 1.8rem;
          font-weight: 700;
        }

        .metric-value .unit {
          font-size: 0.9rem;
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .metrics-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .overall-stats {
            justify-content: center;
            gap: 1rem;
          }
          
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}